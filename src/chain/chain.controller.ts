import { Body, Controller, Post } from '@nestjs/common';
import { ChainService } from './chain.service';
import { Tx } from 'src/deepseek-agent/dto';

@Controller('chain')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Post('')
    async chat(@Body() tx: Tx) {
      return this.chainService.registerTransaction(tx);
    }
}
