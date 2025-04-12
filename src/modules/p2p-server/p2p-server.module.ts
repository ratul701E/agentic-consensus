import { Module } from '@nestjs/common';
import { P2pService } from './p2p-server.service';
import { P2pGateway } from './p2p-server.gateway';

@Module({
  providers: [P2pGateway, P2pService],
  imports: [],
  exports: [P2pService, P2pGateway]
})
export class P2pServerModule {}