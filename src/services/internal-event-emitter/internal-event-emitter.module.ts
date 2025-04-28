import { Module } from "@nestjs/common";
import { InternalEventEmitterService } from "./internal-event-emitter.service";

@Module({
  controllers: [],
  providers: [InternalEventEmitterService],
  exports: [InternalEventEmitterService],
})
export class InternalEventEmitterModule {}
