import { Module } from "@nestjs/common";
import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";
import { TransactionModule } from "src/modules/transaction/transaction.module";
import { P2pServerModule } from "src/modules/p2p-server/p2p-server.module";
import { DatabaseModule } from "src/modules/database/database.module";
import { P2pClientModule } from "../p2p-client/p2p-client.module";
import { BlockchainModule } from "../blockchain/blockchain.module";
import { InfoModule } from "../info/info.module";
import { ProofKitModule } from "src/services/proof-kit/proof-kit.module";
import { EpochModule } from "src/services/epoch/epoch.module";

@Module({
  imports: [
    DatabaseModule,
    TransactionModule,
    P2pClientModule,
    BlockchainModule,
    P2pServerModule,
    InfoModule,
    ProofKitModule,
    EpochModule,
  ],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
