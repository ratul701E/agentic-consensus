import { DatabaseService } from 'src/database/database.service';
import { Injectable, OnModuleInit } from "@nestjs/common";
import crypto from "crypto";
import { TransactionService } from "src/transaction/transaction.service";
import { P2pClientService } from "src/p2p-client/p2p-client.service";
import axios from "axios";
import { BlockchainService } from "src/blockchain/blockchain.service";
import { getLocalIp } from "src/main";
import { P2pGateway } from "src/p2p-server/p2p-server.gateway";

const GENERATION_DELAY = 10000;
const MINIMUM_TRANSACTION_PER_BLOCK = 1;

@Injectable()
export class BlockService implements OnModuleInit {
  private readonly mempool: any;
  constructor(
    private readonly dbService: DatabaseService,
    private readonly transactionService: TransactionService,
    private readonly p2pClientsService: P2pClientService,
    private readonly blockchainService: BlockchainService,
    private readonly p2pServerGateway: P2pGateway
  ) {
    this.mempool = dbService.getMempool();
  }

  async onModuleInit() {
    setInterval(() => {
      this.genereateBlock();
    }, GENERATION_DELAY);
  }

  async genereateBlock() {

    //console.log(await this.transactionService.printMempool())
    const _mempool: any = await this.transactionService.printMempool();

    const valid_transactions: any = []; 
    const last_block: any = await this.blockchainService.getLastBlock();
    const node_addresses = this.p2pClientsService.getNodeAddress();
    const node_staking_info = [];


    for (const transaction of _mempool) {
      const status = await this.transactionService.validateTransaction(transaction)
      if (
        status == "Valid Transaction"
      ) {
        valid_transactions.push(transaction);
      }
    }

    


    if (valid_transactions.length < MINIMUM_TRANSACTION_PER_BLOCK) {
      
      
      console.log(`Result: Failed. Need ${MINIMUM_TRANSACTION_PER_BLOCK} valid transactions found ${valid_transactions.length} (Invalid: ${_mempool.length})`)
      console.log("--------------------------------------------------------")
      return;
    }
    else {
      
      
      console.log(`Result: Ready for block creation. Valid Trasaction found:  ${valid_transactions.length}`)
    }

    for (const addr of node_addresses) {
      const req_addr = "http://" + addr + "/info";
      //console.log(req_addr)
      await axios.get(req_addr).then((res) => {
        node_staking_info.push(res.data);
        //console.log(res.data)
      });
    }

    //console.log(node_staking_info)
    //creating block

    node_staking_info.sort((a, b) => b.staking_coin - a.staking_coin);
    const top3Nodes = node_staking_info.slice(0, 3);
    const randomNodeIndex = Math.floor(Math.random() * top3Nodes.length);
    const selectedNode = top3Nodes[randomNodeIndex];
    //console.log("Selected node info: \n", selectedNode)

    if (selectedNode.addr !== getLocalIp() + ":3000") return; // checking

    //console.log("Selected Node's Public Key:", selectedNode.public_key);

    const blockWithTransactions = {
      blockInfo: {
        blockNumber: last_block.blockInfo.blockNumber + 1,
        timestamp: Date.now(),
        merkleRoot: "",
        blockHash: "",
        previousBlockHash: last_block.blockInfo.blockHash,
        validator: {
          publicKey: selectedNode.public_key,
          stakingBalance: selectedNode.staking_coin,
          validatorSignature: selectedNode.public_key,
        },
        proofOfStake: {
          stakingReward: 2,
        },
      },
      transactions: [],
    };

    valid_transactions.forEach((transaction) => {
      transaction.block = blockWithTransactions.blockInfo.blockNumber
      transaction.status = 'success'
      blockWithTransactions.transactions.push(transaction);
    });

    const merkleRoot = await this.buildMerkleTree(
      blockWithTransactions.transactions
    );
    //console.log('Merkle Root:', merkleRoot);
    blockWithTransactions.blockInfo.merkleRoot = merkleRoot;

    const blockHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(blockWithTransactions.blockInfo))
      .digest("hex");
    //console.log('Block Hash:', blockHash);

    blockWithTransactions.blockInfo.blockHash = blockHash;

    //-------// PRINT
    //console.log(blockWithTransactions)

    //--------add to blockchain db
    await this.blockchainService.addToBlockchain(blockWithTransactions)
    
    
    console.log("Block Status: Block created and added to the chain.")

    //----------- delete transactions from mempool
    
    
    console.log("Mempool cleanup: Cleaning . . .")
    for(const transaction of valid_transactions) {
      await this.transactionService.deleteTransactionFromMempool(transaction)
    }
    
    
    
    console.log("Mempool cleanup: Success")

    //--------propagate

    this.p2pServerGateway.blockBroadcast(blockWithTransactions);
    
    
    console.log("Broadcast: Successfully broadcasted to peers")
    
    console.log("--------------------------------------------------------")
  }

  // -----------------------------------------

  async buildMerkleTree(transactions) {
    if (transactions.length === 0) {
      return null;
    }

    const tree = transactions.map((transaction) =>
      crypto
        .createHash("sha256")
        .update(transaction.transactionHash)
        .digest("hex")
    );

    while (tree.length > 1) {
      const level = [];
      for (let i = 0; i < tree.length; i += 2) {
        const left = tree[i];
        const right = i + 1 < tree.length ? tree[i + 1] : "";
        const combined = left + right;
        const hash = crypto.createHash("sha256").update(combined).digest("hex");
        level.push(hash);
      }
      tree.length = 0;
      tree.push(...level);
    }

    return tree[0];
  }
}
