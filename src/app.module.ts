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
import { EpochModule } from './services/epoch/epoch.module';
import { VdfModule } from './modules/vdf/vdf.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InternalEventEmitterModule } from './services/internal-event-emitter/internal-event-emitter.module';
import { SysInfoModule } from './modules/sys-info/sys-info.module';
import { AgentModule } from './services/agent/agent.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisServiceModule } from './services/redis-service/redis-service.module';

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
    EpochModule,
    VdfModule,
    EventEmitterModule.forRoot(),
    InternalEventEmitterModule,
    AgentModule,
    SysInfoModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      }
    }),
    RedisServiceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
