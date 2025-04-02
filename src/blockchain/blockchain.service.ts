import { Injectable } from '@nestjs/common';
import { DatabaseService } from './../database/database.service';
import { Blockchain } from 'src/schemas/blockchain.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BlockchainService {
    constructor(private readonly databaseService: DatabaseService, @InjectModel(Blockchain.name) private readonly blockchainModel: Model<Blockchain>,) {}

    // Add a block to the blockchain
    async addToBlockchain(block: Partial<Blockchain>): Promise<Blockchain> {
        return this.databaseService.addBlock(block);
    }

    // Get the last block in the blockchain
    async getLastBlock(): Promise<Blockchain | null> {
        const blocks = await this.databaseService.getBlockchain();
        return blocks.length > 0 ? blocks[blocks.length - 1] : null;
    }

    // Retrieve blockchain with optional limit
    async printBlockchain(numberOfInstances?: number): Promise<Blockchain[]> {
        const blocks = await this.databaseService.getBlockchain();
        return numberOfInstances ? blocks.slice(-numberOfInstances) : blocks;
    }

    // Get block by block number
    async getBlockByNumber(blockNumber: number): Promise<Blockchain | null> {
        return this.blockchainModel.findOne({ 'blockInfo.blockNumber': blockNumber }).exec();
    }

    // Get block by hash
    async getBlockByHash(hash: string): Promise<Blockchain | null> {
        return this.blockchainModel.findOne({ 'blockInfo.blockHash': hash }).exec();
    }

    // Count total transactions in the blockchain
    async printTotalTransactionCount(): Promise<number> {
        const blocks = await this.databaseService.getBlockchain();
        return blocks.reduce((count, block) => count + (block.transactions?.length || 0), 0);
    }

    // Retrieve all transactions from the blockchain
    async printAllTransaction(): Promise<any[]> {
        const blocks = await this.databaseService.getBlockchain();
        return blocks.flatMap(block => block.transactions || []);
    }
}
