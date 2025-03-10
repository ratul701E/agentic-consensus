import { Module } from '@nestjs/common';
import { DeepseekAgentService } from './deepseek-agent.service';
import { DeepseekAgentController } from './deepseek-agent.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [DeepseekAgentController],
  providers: [DeepseekAgentService],
  imports: [ConfigModule]
})
export class DeepseekAgentModule { }
