import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeepseekAgentModule } from './deepseek-agent/deepseek-agent.module';
import { ConfigModule } from '@nestjs/config';
import { OpenaiAgentModule } from './openai-agent/openai-agent.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestModule } from './test/test.module';
import { TransactionModule } from './transaction/transaction.module';
import { ChainModule } from './chain/chain.module';
import { RagModule } from './rag/rag.module';
import { P2pClientModule } from './p2p-client/p2p-client.module';
import { DatabaseModule } from './database/database.module';
import { P2pServerModule } from './p2p-server/p2p-server.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { BlockModule } from './block/block.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DeepseekAgentModule,
    OpenaiAgentModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    TestModule,
    TransactionModule,
    ChainModule,
    RagModule,
    P2pServerModule,
    P2pClientModule,
    DatabaseModule,
    BlockchainModule,
    BlockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
