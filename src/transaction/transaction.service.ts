import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/schema/transaction.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TransactionService {
    constructor(
        @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>
    ) { }

    async create(sender: string, receiver: string, amount: string) {
        const transaction = this.transactionModel.create({ sender, receiver, amount });
        return transaction;
    }

    async getAll(sender?: string, receiver?: string) {
        return this.transactionModel.find({
            ...(sender && { sender }),
            ...(receiver && { receiver }),
        });
    }

    async getWhereKeyExist(sender?: string) {
        return this.transactionModel.find({
            $or: [
                ...(sender ? [{ sender }] : []),
                ...(sender ? [{ receiver: sender }] : [])
            ]
        });
    }

    async getUserBalanceByKey(key: string) {
        let balance = 0;
        const transactions = await this.getWhereKeyExist(key);
        transactions.forEach((transaction) => {
            if (transaction.sender === key) {
                balance -= Number(transaction.amount);
            } else {
                balance += Number(transaction.amount);
            }
        });
        return balance;
    }

}
