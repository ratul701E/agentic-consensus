import { Module } from '@nestjs/common';
import { OpenaiAgentService } from './openai-agent.service';
import { OpenaiAgentController } from './openai-agent.controller';

@Module({
  controllers: [OpenaiAgentController],
  providers: [OpenaiAgentService],
})
export class OpenaiAgentModule {}
