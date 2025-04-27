import { Module } from '@nestjs/common';
import { VdfService } from './vdf.service';
import { VdfController } from './vdf.controller';
import { P2pClientModule } from '../p2p-client/p2p-client.module';

@Module({
  controllers: [VdfController],
  providers: [VdfService],
  imports: [P2pClientModule],
})
export class VdfModule {}
