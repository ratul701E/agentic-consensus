import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeepseekAgentService } from './deepseek-agent.service';

@Controller('deepseek-agent')
export class DeepseekAgentController {
  constructor(private readonly deepseekService: DeepseekAgentService) {}

  @Post('chat')
  async chat(@Body('tx') tx: string) {
    return this.deepseekService.chatWithDeepSeek(JSON.stringify(tx));
  }
}
