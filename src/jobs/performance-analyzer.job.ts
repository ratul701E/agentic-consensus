import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Queues } from "./queue.enum";
import { AgentService } from "src/services/agent/agent.service";
import { Logger } from "@nestjs/common";

@Processor(Queues.SYS_PERFORMENCE_ANALYZER)
export class PerfomanceAnalyzer extends WorkerHost {
  private readonly logger = new Logger(PerfomanceAnalyzer.name);
  constructor(private readonly agenService: AgentService) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    this.agenService.analyzeSystemPerformance();
    return {};
  }
}
