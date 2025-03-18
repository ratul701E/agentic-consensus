import { Module } from '@nestjs/common';
import { DeepseekAgentService } from './deepseek-agent.service';
import { DeepseekAgentController } from './deepseek-agent.controller';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  controllers: [DeepseekAgentController],
  providers: [DeepseekAgentService],
  imports: [
    ConfigModule,
    TransactionModule,
  ]
})
export class DeepseekAgentModule { }
