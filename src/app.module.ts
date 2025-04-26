import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { InfoModule } from './modules/info/info.module';
import { ProofKitModule } from './services/proof-kit/proof-kit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
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
    InfoModule,
    ProofKitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
