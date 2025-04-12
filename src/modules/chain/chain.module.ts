import { Module } from '@nestjs/common';
import { ChainService } from './chain.service';
import { ChainController } from './chain.controller';
import { TransactionModule } from 'src/modules/transaction/transaction.module';
import { DeepseekAgentModule } from 'src/modules/deepseek-agent/deepseek-agent.module';

@Module({
  controllers: [ChainController],
  providers: [ChainService],
  imports: [TransactionModule, DeepseekAgentModule]
})
export class ChainModule {}
