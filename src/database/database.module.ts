import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
import { Mempool, MempoolSchema } from 'src/schemas/mempool.schema';
import { Blockchain, BlockchainSchema } from 'src/schemas/blockchain.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/your-database'),
    MongooseModule.forFeature([
      { name: Mempool.name, schema: MempoolSchema },
      { name: Blockchain.name, schema: BlockchainSchema },
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
