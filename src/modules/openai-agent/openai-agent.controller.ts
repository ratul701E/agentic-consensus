import { Body, Controller, Get, Post } from '@nestjs/common';
import { OpenaiAgentService } from './openai-agent.service';

@Controller('openai-agent')
export class OpenaiAgentController {
  constructor(private readonly openaiAgentService: OpenaiAgentService) {}
  @Post()
  sendMessage(@Body() body: { message: string }):any {
    const { message } = body;
    return this.openaiAgentService.generateText(message)
  }
  @Get()
  getHello(){
    return this.openaiAgentService.get();
  }
}
