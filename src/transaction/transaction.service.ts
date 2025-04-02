import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionDTO } from 'src/dtos/transaction.dto';
import { P2pService } from 'src/p2p-server/p2p-server.service';
import { EC } from 'elliptic';
import * as elliptic from 'elliptic';
import { Blockchain } from 'src/schemas/blockchain.schema';
import { Mempool } from 'src/schemas/mempool.schema';

@Injectable()
export class TransactionService {
    private readonly ec: EC;

    constructor(
        private readonly p2pService: P2pService,
        @InjectModel(Blockchain.name) private readonly blockchainModel: Model<Blockchain>,
        @InjectModel(Mempool.name) private readonly mempoolModel: Model<Mempool>
    ) {
        this.ec = new elliptic.ec('secp256k1');
    }

    async transactionExists(transaction: TransactionDTO): Promise<boolean> {
        const existingTransaction = await this.mempoolModel.findOne({ transactionHash: transaction.transactionHash }).exec();
        console.log(existingTransaction);
        return !!existingTransaction;
    }

    async putTransaction(transaction: TransactionDTO): Promise<boolean> {
        // await this.p2pService.transactionBroadcast(transaction);
        await this.mempoolModel.create(transaction);
        return true;
    }

    async addTransactionToMempool(transaction: TransactionDTO): Promise<boolean> {
        return (await this.transactionExists(transaction)) ? false : await this.putTransaction(transaction);
    }

    async deleteTransactionFromMempool(transaction: TransactionDTO): Promise<boolean> {
        const result = await this.mempoolModel.deleteOne({ transactionHash: transaction.transactionHash }).exec();
        return result.deletedCount > 0;
    }

    async printMempool() {
        return this.mempoolModel.find().lean().exec();
    }

    async validateBalance(transaction: TransactionDTO): Promise<boolean> {
        const balance = await this.getBalance(transaction.from);
        return balance >= transaction.value + transaction.transactionFee;
    }

    async validateTransaction(transaction: TransactionDTO): Promise<string> {
        if (!await this.validateBalance(transaction)) return "Insufficient Account Balance";
        // if (!await this.validateSignature(transaction)) return "Unable to Validate Signature";
        return "Valid Transaction";
    }

    async validateSignature(transaction: TransactionDTO): Promise<boolean> {
        try {
            if (!transaction || !transaction.from) {
                throw new Error('Transaction or sender not found');
            }
            const key = this.ec.keyFromPublic(transaction.from, 'hex');
            return key.verify(transaction.transactionHash, transaction.signature);
        } catch (error) {
            console.error('Failed to validate signature:', error);
            return false;
        }
    }

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

        return block.transactions.find(tx => tx.transactionHash === transactionHash);
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
