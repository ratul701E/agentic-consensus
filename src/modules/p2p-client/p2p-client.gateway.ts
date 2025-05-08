import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { P2pClientService } from "./p2p-client.service";
import { io } from "socket.io-client";
import { Server } from "socket.io";
import { getLocalIp } from "src/main";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { TransactionDTO } from "src/dtos/transaction.dto";
import { Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InternalEventEmitterService } from "src/services/internal-event-emitter/internal-event-emitter.service";
import { BlockchainService } from "../blockchain/blockchain.service";
import { Blockchain, TransactionDocument } from "src/schemas/blockchain.schema";
import { P2pService } from "../p2p-server/p2p-server.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import axios from "axios";

@WebSocketGateway()
export class P2pClientGateway implements OnApplicationBootstrap {
  private readonly logger = new Logger(P2pClientGateway.name);
  @WebSocketServer() server: Server;
  private readonly PORT = process.env.PORT || 3000;

  constructor(
    private readonly p2pClientService: P2pClientService,
    private readonly transacationService: TransactionService,
    private readonly internalEventEmitterService: InternalEventEmitterService,
    private readonly blockchainService: BlockchainService,
    private readonly p2pServerService: P2pService,
    @InjectModel(Blockchain.name) private readonly blockchainModel: Model<Blockchain>,
  ) {}

  async onApplicationBootstrap() {
    await this.connectToSeedServers();
    //await this.getNodeAddressFromSeedServer()
  }

  private async connectToSeedServers(): Promise<void> {
    for (const seedAddr of this.p2pClientService.getSeedNodeAddrList()) {
      this.logger.log(`Connecting to seed server ${seedAddr}...`);
      const seedSocket = io(seedAddr, {
        query: {
          addr: getLocalIp() + ":" + this.PORT,
        },
      });

      seedSocket.on("connect", async () => {
        this.p2pClientService.addSeedSocket(seedSocket);
        await this.getNodeAddressFromSeedServer(seedSocket);
        this.logger.log(`Connected to seed server [${JSON.stringify(seedAddr)}]`);

        this.internalEventEmitterService.emit("seed_connected", { seedAddr });
      });

      seedSocket.on("disconnect", () => {
        this.logger.warn(`Disconnected from seed server [${JSON.stringify(seedAddr)}]`);
      });

      seedSocket.on("new_node_addr", () => {
        //add to list and connect
      });

      //node list response from seed server
      seedSocket.on("node_info_res", (node_addr_list) => {
        // console.log(node_addr_list);
        this.p2pClientService.addNodeAddresses(node_addr_list);
        const peers = this.p2pClientService.getNodeAddress();
        for (const peer of peers) {
          if (peer == getLocalIp() + ":" + this.PORT) continue; //ignore own server
          this.connect(peer);
        }
      });

      seedSocket.on("node_disconnected", (id) => {
        this.p2pClientService.removeFromActiveNodeList(id);
      });
    }
  }

  private async getNodeAddressFromSeedServer(seedServer: any): Promise<void> {
    //node list req to seed server
    if (seedServer.connected) seedServer.emit("node_info_req", getLocalIp() + this.PORT); //req with own address to save in the seed server
    // else console.log("socket not connected")
  }

  private connect(addr: string) {
    if (this.p2pClientService.isPeerConnected(addr)) return;
    //connect to other servers as peer
    const socket = io("http://" + addr);
    socket.on("connect", () => {
      this.p2pClientService.addSocket(socket);
      this.p2pClientService.addConnectedPeerAddress(addr);
      this.logger.verbose(`"Connected as a client to ${addr}"`);
      // const res = axios.get("http://" + addr + "/blockchain");
      // res.then(async (res) => {
      //   // Get existing block hashes from blockchain
      //   const existingBlocks = await this.blockchainModel.find();
      //   const existingBlockHashes = new Set(existingBlocks.map((block) => block.blockInfo.blockHash));
      //   this.logger.verbose("Existing block hashes: " + existingBlockHashes);
      //   // Filter and insert only new blocks
      //   const newBlocks = res.data.filter((block) => !existingBlockHashes.has(block.blockHash));
      //   if (newBlocks.length > 0) {
      //     const blocksToInsert = newBlocks.map((block) => {
      //       const { _id, ...blockWithoutId } = block;
      //       return blockWithoutId;
      //     });
      //     await this.blockchainModel.insertMany(blocksToInsert);
      //     this.logger.verbose(`${newBlocks.length} new blocks synced from peers`);
      //   } else {
      //     this.logger.verbose("No new blocks to sync from peers");
      //   }
      // });
    });

    //#events
    socket.on("disconnect", () => {
      this.logger.warn(`"Disconnected as a client from ${addr}"`);
      this.p2pClientService.removeFromActiveNodeList(addr);
    });

    //new transaction event
    socket.on("new_transaction", async (transaction: TransactionDTO) => {
      this.logger.log(
        `Received transaction from server (${JSON.stringify(addr)}): ${JSON.parse(JSON.stringify(transaction))}`,
      );
      //validate
      //add
      (await this.transacationService.addTransactionToMempool(transaction))
        ? this.logger.debug("Transaction successfully added to mempool")
        : this.logger.warn("Transaction already exists in the mepool");
      //broadcast
      //this.server.emit('new_transaction', transaction) //broadcast
    });

    //new block event
    socket.on("new_block", async (block: any) => {
      this.logger.log(`Received block from server (${JSON.stringify(addr)}): ${JSON.stringify(block, null, 2)}`);
      await this.blockchainService.addToBlockchain(block);
      this.logger.verbose("Block verification: Success. Added to blockchain");
      this.p2pServerService.notifyExplorer();

      const transactionsInBlock: TransactionDocument[] = block.transactions;

      await this.transacationService.deleteMultipleTransactionsFromMempool(transactionsInBlock);
      this.logger.verbose("Mempool cleanup: Success");
      //this.server.emit('new_block', block)
    });

    socket.on("new_node_connect", (transaction) => {
      this.logger.log(`Broadcast: ${JSON.stringify(transaction)}`);
    });

    socket.on("node_disconnect", (transaction) => {
      this.logger.log(`Broadcast: ${JSON.stringify(transaction)}`);
    });
  }
}

// private async getNodeAddressFromSeedServer() {
//   let temp_addrs = []
//   for(const seed of this.p2pClientService.getSeedNodeAddrList()){
//     await axios.get(seed)
//       .then(res => {
//         //console.log(res.data)
//         temp_addrs.push([...res.data.serverList])
//       })
//       .catch(err => {
//         console.log(`${seed} seed node unable to reach`)
//       })
//   }
//   //filtering duplicates
//   this.p2pClientService.replaceNodeAddressList([...new Set(temp_addrs)])
//   console.log("node address from seed: ")
//   console.log(this.p2pClientService.getNodeAddress())
// }

// const PORT = process.argv[process.argv.indexOf("--port") + 1]
//   for (let addr of this.p2pClientService.getNodeAddress()) {
//     //ignoring own server
//     let addr_port = addr.split(":")
//     if(addr_port[addr_port.length - 1] == PORT) continue

//     //connect to other servers as peer
//     const socket = io(addr)
//     socket.on('connect', () => {
//       this.p2pClientService.addSocket(socket)
//       console.log(`"Connected as a client to ${addr}"`)
//     })

//     //events
//     socket.on('disconnect', () => {
//       console.log(`"Disconnected as a client from ${addr}"`)
//     })

//     socket.on('new_transaction', transaction => {
//       console.log(`Received transaction from server (${JSON.stringify(addr)}): ${JSON.stringify(transaction)}`)
//       this.server.emit('new_transaction', transaction)
//     })

//     socket.on('new_node_connect', transaction => {
//       console.log(`Broadcast: ${JSON.stringify(transaction)}`)
//     })

//     socket.on('node_disconnect', transaction => {
//       console.log(`Broadcast: ${JSON.stringify(transaction)}`)
//     })
//   }
//}
