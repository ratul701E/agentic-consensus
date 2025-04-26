import { Module } from '@nestjs/common';
import { ProofKitService } from './proof-kit.service';

@Module({
  controllers: [],
  providers: [ProofKitService],
})
export class ProofKitModule {}
