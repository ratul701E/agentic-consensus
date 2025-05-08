import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
@ApiTags("Blockchain")
@Controller('blockchain')
export class BlockchainController {
    constructor(
        private readonly blockchainService: BlockchainService
    ) { }
    @ApiOkResponse({ description: "It will return the total blockchain" })
    @Get()
    async printBlockchain(@Body('count') numberOfInstances?: number) {
        return await this.blockchainService.printBlockchain(numberOfInstances || undefined)
    }

    @Post()
    async addToBlockchain() {
        return await this.blockchainService.addToBlockchain(
            {
                blockInfo: {
                    blockNumber: 1,
                    timestamp: Date.now(),
                    merkleRoot: "",
                    blockHash: "0x0000000000000000000",
                    previousBlockHash: "null",
                    validator: {
                        publicKey: "Chain",
                        stakingBalance: 0,
                        validatorSignature: 'null',
                    },
                    proofOfStake: {
                        stakingReward: 0,
                    },
                },
                transactions: [
                    {
                        "status": "success",
                        "block": 1,
                        "timestamp": new Date(),
                        "transactionAction": "Transfer 10 DCL value to 0413c725274b4709b5faef702e0e91241eefca047a041561ce1d02e7e397fbe665de7f332c4799203770b16958f5e9989c3f11f0ae352588a75f440b891dc990b0",
                        "from": "Chain",
                        "to": "2e388b0fd73263b1388749603518708c9ec71ab25b53bb0a747f4513662e6701e48c4ff720b019fe18472f5966a906683822a697f3f5b51d11927b074b2caef7",
                        "value": 1000,
                        "transactionFee": 0,
                        "gasPrice": 0,
                        "signature": "0000000000000000000"
                    },
                    {
                        "status": "success",
                        "block": 1,
                        "timestamp": new Date(),
                        "transactionAction": "Transfer 10 DCL value to 047e8fcefa6ad28d9b675f5d8df9c55d7fd7407cf2f3fc1da464bedb65209a1671ddf17479814eef3a2ae1e5a6409bfb0d993cde108394af71d8c050fc68fbeefc",
                        "from": "Chain",
                        "to": "04d8823fd9a5c26d0f0ce8fd16f9612d014c80e0841e57e004e05b041710bb94cf11c8ae29b647d7a353874f3ae0f13df7f8c8988567de06c786c2af4218e8f9f6",
                        "value": 1000,
                        "transactionFee": 0,
                        "gasPrice": 0,
                        "signature": "0000000000000000000"
                    }
                ],
            }
        )
    }

    @Get('total-transaction')
    async getTotalTransaction() {
        return await this.blockchainService.printTotalTransactionCount()
    }

    @Get('transaction')
    async getAllTransaction() {
        return await this.blockchainService.printAllTransaction()
    }

    @Get('blocks/:number?')
    async getAllBlock(@Param('number') number: number = undefined) {
        return await this.blockchainService.printBlockchain(number)
    }

    @Get('last')
    async getLastBlock() {
        return await this.blockchainService.getLastBlock()
    }

    @Get("block/number/:number")
    async getBlockByNumber(@Param('number') number: number) {
        return await this.blockchainService.getBlockByNumber(number);
    }

    @Get("block/hash/:hash")
    async getBlockByHash(@Param('hash') hash: string) {
        return await this.blockchainService.getBlockByHash(hash);
    }

}
