import { Injectable } from '@nestjs/common';
import { TransactionDTO } from 'src/dtos/transaction.dto';
import { P2pGateway } from './p2p-server.gateway';

@Injectable()
export class P2pService {

    constructor(private readonly p2pGateway: P2pGateway) {}

    async transactionBroadcast(transaction: TransactionDTO) {
        this.p2pGateway.transactionBroadcast(transaction)
    }
}