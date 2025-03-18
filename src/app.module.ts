import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeepseekAgentModule } from './deepseek-agent/deepseek-agent.module';
import { ConfigModule } from '@nestjs/config';
import { OpenaiAgentModule } from './openai-agent/openai-agent.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestModule } from './test/test.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DeepseekAgentModule,
    OpenaiAgentModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    TestModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
