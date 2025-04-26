import { Module } from '@nestjs/common';
import { ProofKitService } from './proof-kit.service';

@Module({
  controllers: [],
  providers: [ProofKitService],
  exports: [ProofKitService],
})
export class ProofKitModule {}
