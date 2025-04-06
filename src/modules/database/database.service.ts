import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blockchain } from 'src/schemas/blockchain.schema';
import { Mempool } from 'src/schemas/mempool.schema';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Mempool.name) private readonly mempoolModel: Model<Mempool>,
    @InjectModel(Blockchain.name) private readonly blockchainModel: Model<Blockchain>,
  ) {}

  // Get all mempool transactions
  async getMempool(): Promise<Mempool[]> {
    return this.mempoolModel.find().exec();
  }

  // Add a transaction to mempool
  async addToMempool(transaction: Partial<Mempool>): Promise<Mempool> {
    return new this.mempoolModel(transaction).save();
  }

  // Get all blockchain blocks
  async getBlockchain(): Promise<Blockchain[]> {
    return this.blockchainModel.find().exec();
  }

  // Add a block to the blockchain
  async addBlock(block: Partial<Blockchain>): Promise<Blockchain> {
    return new this.blockchainModel(block).save();
  }
}
