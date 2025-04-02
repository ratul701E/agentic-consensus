import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { P2pClientModule } from 'src/p2p-client/p2p-client.module';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { P2pServerModule } from 'src/p2p-server/p2p-server.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, TransactionModule, P2pClientModule, BlockchainModule, P2pServerModule],
  controllers: [BlockController],
  providers: [BlockService]
})
export class BlockModule {}
