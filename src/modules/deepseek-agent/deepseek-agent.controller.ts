import { Controller } from '@nestjs/common';
import { DeepseekAgentService } from './deepseek-agent.service';

@Controller('deepseek-agent')
export class DeepseekAgentController {
  constructor(private readonly deepseekService: DeepseekAgentService) { }

  // @Post('chat')
  // async chat(@Body() tx: Tx) {
  //   return this.deepseekService.chatWithDeepSeek(tx);
  // }
}
