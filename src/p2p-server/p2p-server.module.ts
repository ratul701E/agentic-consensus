import { Module, forwardRef } from '@nestjs/common';
import { P2pService } from './p2p-server.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { P2pGateway } from './p2p-server.gateway';

@Module({
  providers: [P2pGateway, P2pService],
  imports: [],
  exports: [P2pService, P2pGateway]
})
export class P2pServerModule {}