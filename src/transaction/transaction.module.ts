import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { P2pServerModule } from 'src/p2p-server/p2p-server.module';
import { DatabaseModule } from 'src/database/database.module';
import { Blockchain, BlockchainSchema } from 'src/schemas/blockchain.schema';
import { Mempool, MempoolSchema } from 'src/schemas/mempool.schema';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }, { name: Mempool.name, schema: MempoolSchema }, , { name: Blockchain.name, schema: BlockchainSchema },]), P2pServerModule, DatabaseModule
  ],
  exports: [TransactionService]
})
export class TransactionModule { }
