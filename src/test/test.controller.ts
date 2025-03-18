import { Body, Controller, Post } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  async create(
    @Body('name') name: string
  ) {
    return await this.testService.create(name);
  }
}
