import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blockchain, BlockchainSchema } from 'src/schemas/blockchain.schema';
import { TransactionModule } from 'src/modules/transaction/transaction.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [BlockchainService],
  imports: [DatabaseModule, TransactionModule, MongooseModule.forFeature([
    { name: Blockchain.name, schema: BlockchainSchema },
  ]),],
  exports: [BlockchainService],
  controllers: [BlockchainController]
})
export class BlockchainModule { }
