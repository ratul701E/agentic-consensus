import { DatabaseService } from "src/modules/database/database.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import crypto from "crypto";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { P2pClientService } from "src/modules/p2p-client/p2p-client.service";
import axios from "axios";
import { BlockchainService } from "src/modules/blockchain/blockchain.service";
import { getLocalIp } from "src/main";
import { P2pGateway } from "src/modules/p2p-server/p2p-server.gateway";
import { Cron, CronExpression } from "@nestjs/schedule";
import { NodeInfoDocument } from "src/schemas/node-info.schema";
import { TransactionDocument } from "src/schemas/blockchain.schema";
import { InfoService } from "../info/info.service";
import { ProofKitService } from "src/services/proof-kit/proof-kit.service";
import { EpochService } from "src/services/epoch/epoch.service";

const MINIMUM_TRANSACTION_PER_BLOCK = 1;

@Injectable()
export class BlockService implements OnModuleInit {
  private allowCron = false;
  private readonly logger = new Logger(BlockService.name);
  constructor(
    private readonly dbService: DatabaseService,
    private readonly transactionService: TransactionService,
    private readonly p2pClientsService: P2pClientService,
    private readonly blockchainService: BlockchainService,
    private readonly p2pServerGateway: P2pGateway,
    private readonly infoService: InfoService,
    private readonly proofKitService: ProofKitService,
    private readonly epochService: EpochService,
  ) {}

  onModuleInit() {
    setTimeout(() => {
      this.allowCron = true;
      // console.log("Cron job will now run every 10 seconds.");
    }, 1000);
  }

  @Cron("*/10 * * * * *", { timeZone: "UTC" })
  async genereateBlock() {
    if (!this.allowCron) return;

    const my_info = await this.infoService.getThisNodeInfo();
    const next_slot_details = await this.epochService.getNextSlot();

    if (next_slot_details) this.logger.log(`Slot Leader Address: ${next_slot_details.leaderAddress}`);

    if (!next_slot_details || next_slot_details.leaderAddress !== my_info.address) {
      if (process.env.SHOW_BLOCK_CEATION_LOG === "true") this.logger.warn("Not leader. Skipping block creation.");
      return;
    }

    // this.logger.log(await this.transactionService.printMempool())
    const _mempool: any = await this.transactionService.printMempool();

    this.logger.log(`Mempool: ${JSON.stringify(_mempool, null, 2)}`);

    const valid_transactions: any = [];
    const last_block: any = await this.blockchainService.getLastBlock();

    for (const _transaction of _mempool) {
      const transaction = await this.transactionService.validateTransaction(_transaction);
      if (transaction) {
        valid_transactions.push(transaction);
      } else {
        if (process.env.SHOW_BLOCK_CEATION_LOG === "true")
          this.logger.warn(
            `Transaction ${transaction.transactionHash} is invalid. Reason: Invalid Transaction Sturcture`,
          );
      }
    }

    this.logger.log(JSON.stringify(valid_transactions, null, 2));
    // return;

    if (valid_transactions.length < MINIMUM_TRANSACTION_PER_BLOCK) {
      if (process.env.SHOW_BLOCK_CEATION_LOG === "true")
        this.logger.error(
          `Result: Failed. Need ${MINIMUM_TRANSACTION_PER_BLOCK} valid transactions found ${valid_transactions.length} (Invalid: ${_mempool.length})`,
        );
      return;
    }
    if (process.env.SHOW_BLOCK_CEATION_LOG === "true")
      this.logger.log(`Ready for block creation. Valid Trasaction found:  ${valid_transactions.length}`);

    const blockWithTransactions = {
      blockInfo: {
        blockNumber: last_block.blockInfo.blockNumber + 1,
        timestamp: Date.now(),
        merkleRoot: "",
        blockHash: "",
        previousBlockHash: last_block.blockInfo.blockHash,
        validator: {
          publicKey: my_info.address,
          stakingBalance: my_info.stake,
          validatorSignature: my_info.address,
        },
        proofOfStake: {
          stakingReward: 2,
        },
      },
      transactions: [],
    };

    valid_transactions.forEach((transaction: TransactionDocument) => {
      transaction.block = blockWithTransactions.blockInfo.blockNumber;
      transaction.status = "success";
      blockWithTransactions.transactions.push(transaction);
    });


    const merkleRoot = await this.buildMerkleTree(blockWithTransactions.transactions);
    //console.log('Merkle Root:', merkleRoot);
    blockWithTransactions.blockInfo.merkleRoot = merkleRoot;
    

    const blockHash = crypto.createHash("sha256").update(JSON.stringify(blockWithTransactions.blockInfo)).digest("hex");
    //console.log('Block Hash:', blockHash);

    blockWithTransactions.blockInfo.blockHash = blockHash;


    //-------// PRINT
    //console.log(blockWithTransactions)

    //--------add to blockchain db
    await this.blockchainService.addToBlockchain(blockWithTransactions);

    this.logger.log("Block Status: Block created and added to the chain.");

    //----------- delete transactions from mempool

    this.logger.warn("Mempool cleanup: Cleaning . . .");
    await this.transactionService.deleteMultipleTransactionsFromMempool(valid_transactions);
    this.logger.log("Mempool cleanup: Success");
    return;
    //--------propagate

    this.p2pServerGateway.blockBroadcast(blockWithTransactions);
    this.logger.log("Broadcast: Successfully broadcasted to peers");
  }

  async buildMerkleTree(transactions) {
    if (transactions.length === 0) {
      return null;
    }

    const tree = transactions.map((transaction) =>
      crypto.createHash("sha256").update(transaction.transactionHash).digest("hex"),
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
