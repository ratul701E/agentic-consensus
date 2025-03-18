import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from 'src/schema/transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [
    MongooseModule.forFeature([{name: Transaction.name, schema: TransactionSchema}])
  ],
  exports: [TransactionService]
})
export class TransactionModule {}
