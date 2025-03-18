import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  async create(
    @Body('sender') sender: string,
    @Body('receiver') receiver: string,
    @Body('amount') amount: string,
  ) {
    return await this.transactionService.create(sender, receiver, amount);
  }

  @Get()
  async getAll(
    @Query('sender') sender: string,
    @Query('receiver') receiver: string,
  ) {
    return await this.transactionService.getAll(sender, receiver);
  }
}
