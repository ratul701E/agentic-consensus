import { Controller, Post, Get, Body, Delete, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDTO } from 'src/dtos/transaction.dto';

@Controller('transaction')
export class TransactionController {

    constructor(private readonly transactionService: TransactionService) {
        console.log("Requested")
    }
    @Post()
    async addTransactionToMempool(@Body() transaction: TransactionDTO): Promise <any> {
        //console.log(transaction)
        return await this.transactionService.addTransactionToMempool(transaction)

    }

    // @ApiOkResponse({description:"It will return the mempool"})
    // @Get()
    // async getMempool():Promise<mempoolDTO[]> {

    //     return await this.transactionService.printMempool()

    //}

    @Delete()
    async deleteTransaction(@Body() transaction: TransactionDTO) {
        return await this.transactionService.deleteTransactionFromMempool(transaction)
    }

    @Get('/balance/:address')
    async getBalance(@Param('address') address: string) {
        return {
            balance: await this.transactionService.getBalance(address),
        }
    }

    @Get(':transactionHash')
    async getTransactionByHash(@Param('transactionHash') transactionHash: string){
        return await this.transactionService.getTransactionByHash(transactionHash)
    }

    @Get('key/:key')
    async getAllTransactionOfKey(@Param('key') key : string) {
        return await this.transactionService.getAllTransactionByPublicKey(key)
    }

}