import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { P2pServerModule } from 'src/p2p-server/p2p-server.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [
    MongooseModule.forFeature([{name: Transaction.name, schema: TransactionSchema}]), P2pServerModule, DatabaseModule
  ],
  exports: [TransactionService]
})
export class TransactionModule {}
