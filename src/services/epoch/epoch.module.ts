import { Module } from "@nestjs/common";
import { EpochService } from "./epoch.service";
import { Epoch, EpochSchema } from "src/schemas/epoch.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Slot, SlotSchema } from "src/schemas/slot.schema";
import { ProofKitModule } from "../proof-kit/proof-kit.module";
import { BlockModule } from "src/modules/block/block.module";
import { InfoModule } from "src/modules/info/info.module";
import { P2pClientModule } from "src/modules/p2p-client/p2p-client.module";

@Module({
  controllers: [],
  providers: [EpochService],
  imports: [
    MongooseModule.forFeature([
      { name: Epoch.name, schema: EpochSchema },
      { name: Slot.name, schema: SlotSchema },
    ]),
    ProofKitModule,
    P2pClientModule,
    InfoModule,

  ],
  exports: [EpochService],
})
export class EpochModule {}
