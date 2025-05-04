import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TransactionDTO } from "src/dtos/transaction.dto";
import { Blockchain } from "src/schemas/blockchain.schema";
import { Mempool } from "src/schemas/mempool.schema";
import { P2pService } from "../p2p-server/p2p-server.service";
import { slh_dsa_sha2_256f } from "@noble/post-quantum/slh-dsa";
import { hexToBytes, utf8ToBytes } from "@noble/hashes/utils";

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly p2pService: P2pService,
    @InjectModel(Blockchain.name) private readonly blockchainModel: Model<Blockchain>,
    @InjectModel(Mempool.name) private readonly mempoolModel: Model<Mempool>,
  ) {}

  async transactionExists(transaction: TransactionDTO): Promise<boolean> {
    this.logger.log(`Checking if transaction ${transaction.signatures[0]} exists...`);
    const existingTransaction = await this.mempoolModel
      .findOne({
        signatures: { $in: [transaction.signatures[0]] },
      })
      .exec();
    !!existingTransaction
      ? this.logger.warn("Transaction exists in mempool")
      : this.logger.log("Transaction does not exist");
    return !!existingTransaction;
  }

  async putTransaction(transaction: TransactionDTO): Promise<boolean> {
    await this.mempoolModel.create(transaction);
    this.logger.log(`Transaction ${transaction.signatures[0]} added to mempool`);
    await this.p2pService.transactionBroadcast(transaction);
    this.logger.log(`Transaction ${transaction.signatures[0]} broadcasted to peers`);
    return true;
  }

  async addTransactionToMempool(transaction: TransactionDTO): Promise<boolean> {
    return (await this.transactionExists(transaction)) ? false : await this.putTransaction(transaction);
  }

  async deleteTransactionFromMempool(transaction: TransactionDTO): Promise<boolean> {
    const result = await this.mempoolModel.deleteOne({ signatures: { $in: [transaction.signatures[0]] } }).exec();
    return result.deletedCount > 0;
  }

  async deleteMultipleTransactionsFromMempool(transactions: TransactionDTO[]): Promise<boolean> {
    const result = await this.mempoolModel
      .deleteMany({ transactionHash: { $in: transactions.map((tx) => tx.signatures[0]) } })
      .exec();
    return result.deletedCount === transactions.length;
  }

  async printMempool() {
    return this.mempoolModel.find().lean().exec();
  }

  // async validateBalance(transaction: TransactionDTO): Promise<boolean> {
  //     const balance = await this.getBalance(transaction.from);
  //     return balance >= transaction.value + transaction.transactionFee;
  // }

  async validateTransaction(transaction: TransactionDTO): Promise<string> {
    // TODO: Implement validation logic
    // if (!await this.validateBalance(transaction)) return "Insufficient Account Balance";
    // if (!await this.validateSignature(transaction)) return "Unable to Validate Signature";
    return "Valid Transaction";
  }

  // async validateSignature(transaction: TransactionDTO): Promise<boolean> {
  //     try {
  //       if (!transaction || !transaction.from || !transaction.signature || !transaction.transaction) {
  //         throw new Error('Transaction is missing required fields');
  //       }

  //       const publicKeyBytes = hexToBytes(transaction.from);
  //       const signatureBytes = hexToBytes(transaction.signature);
  //       const messageBytes = utf8ToBytes(transaction.transaction);

  //       if (messageBytes.length > 128) {
  //         throw new Error('Transaction message too long for SLH-DSA');
  //       }

  //       const paddedMessage = new Uint8Array(128);
  //       paddedMessage.set(messageBytes);

  //       return slh_dsa_sha2_256f.verify(signatureBytes, paddedMessage, publicKeyBytes);
  //     } catch (error) {
  //       console.error('Failed to validate SLH-DSA signature:', error);
  //       return false;
  //     }
  //   }

  async getBalance(publicKey: string): Promise<number> {
    const blocks = await this.blockchainModel.find().lean().exec();
    let balance = 0;

    for (const block of blocks) {
      for (const transaction of block.transactions) {
        if (transaction.from === publicKey) balance -= transaction.value + transaction.transactionFee;
        if (transaction.to === publicKey) balance += transaction.value;
      }
    }

    return balance;
  }

  async getTransactionByHash(transactionHash: string): Promise<any> {
    const block = await this.blockchainModel.findOne({ "transactions.transactionHash": transactionHash }).lean().exec();
    if (!block) throw new Error(`Transaction with hash ${transactionHash} not found`);

    return block.transactions.find((tx) => tx.transactionHash === transactionHash);
  }

  async getAllTransactionByPublicKey(publicKey: string): Promise<any[]> {
    const blocks = await this.blockchainModel.find().lean().exec();
    const matchedTransactions: any[] = [];

    for (const block of blocks) {
      for (const transaction of block.transactions) {
        if (transaction.from === publicKey || transaction.to === publicKey) {
          matchedTransactions.push(transaction);
        }
      }
    }

    return matchedTransactions;
  }
}
