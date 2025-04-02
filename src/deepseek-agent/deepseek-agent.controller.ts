import { Body, Controller, Post } from '@nestjs/common';
import { DeepseekAgentService } from './deepseek-agent.service';
import { Tx } from './dto';

@Controller('deepseek-agent')
export class DeepseekAgentController {
  constructor(private readonly deepseekService: DeepseekAgentService) { }

  // @Post('chat')
  // async chat(@Body() tx: Tx) {
  //   return this.deepseekService.chatWithDeepSeek(tx);
  // }
}
