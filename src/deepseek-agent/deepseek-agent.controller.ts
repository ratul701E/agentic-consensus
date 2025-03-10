import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeepseekAgentService } from './deepseek-agent.service';

@Controller('deepseek-agent')
export class DeepseekAgentController {
  constructor(private readonly deepseekService: DeepseekAgentService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    return this.deepseekService.chatWithDeepSeek(message);
  }

  @Get()
  async test() {
    return "hey welcome"
  }
}
