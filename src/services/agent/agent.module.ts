import { Module } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { VdfModule } from "src/modules/vdf/vdf.module";
import { BullModule } from "@nestjs/bullmq";
import { Queues } from "src/jobs/queue.enum";
import { PerfomanceAnalyzer } from "src/jobs/performance-analyzer.job";
import { SysInfoModule } from "src/modules/sys-info/sys-info.module";
import { InfoModule } from "src/modules/info/info.module";
import { MongooseModule } from "@nestjs/mongoose";
import { NodeInfo, NodeInfoSchema } from "src/schemas/node-info.schema";

@Module({
  controllers: [],
  providers: [AgentService, PerfomanceAnalyzer],
  imports: [
    VdfModule,
    BullModule.registerQueue({
      name: Queues.SYS_PERFORMENCE_ANALYZER,
    }),
    SysInfoModule,
    InfoModule,
    MongooseModule.forFeature([{ name: NodeInfo.name, schema: NodeInfoSchema }]),
  ],
  exports: [AgentService],
})
export class AgentModule {}
