import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeepseekAgentModule } from './modules/deepseek-agent/deepseek-agent.module';
import { ConfigModule } from '@nestjs/config';
import { OpenaiAgentModule } from './modules/openai-agent/openai-agent.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestModule } from './test/test.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ChainModule } from './modules/chain/chain.module';
import { RagModule } from './modules/rag/rag.module';
import { P2pClientModule } from './modules/p2p-client/p2p-client.module';
import { DatabaseModule } from './modules/database/database.module';
import { P2pServerModule } from './modules/p2p-server/p2p-server.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { BlockModule } from './modules/block/block.module';

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
