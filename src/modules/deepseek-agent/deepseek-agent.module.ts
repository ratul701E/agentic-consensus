import { Module } from '@nestjs/common';
import { DeepseekAgentService } from './deepseek-agent.service';
import { DeepseekAgentController } from './deepseek-agent.controller';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from 'src/modules/transaction/transaction.module';
import { LLM } from 'src/class/LLM';

@Module({
  controllers: [DeepseekAgentController],
  providers: [DeepseekAgentService],
  imports: [
    ConfigModule,
    TransactionModule,
    LLM
  ],
  exports: [DeepseekAgentService]
})
export class DeepseekAgentModule { }
