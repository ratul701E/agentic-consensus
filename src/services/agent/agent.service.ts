import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import axios from "axios";
import { Queue } from "bullmq";
import { Model } from "mongoose";
import { assistantMessage, createUserMessage, systemMessage } from "src/contexts/test";
import { Queues } from "src/jobs/queue.enum";
import { LlamaResponse } from "src/modules/deepseek-agent/dto";
import { InfoService } from "src/modules/info/info.service";
import { SysInfoService } from "src/modules/sys-info/sys-info.service";
import { SysInfo } from "src/modules/sys-info/types";
import { NodeInfo } from "src/schemas/node-info.schema";

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  constructor(
    @InjectQueue(Queues.SYS_PERFORMENCE_ANALYZER) private performanceAnalyzerQueue: Queue,
    private readonly sysInfoService: SysInfoService,
    private readonly infoService: InfoService,
    @InjectModel(NodeInfo.name) private readonly nodeInfoModel: Model<NodeInfo>,
  ) {}
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    await this.performanceAnalyzerQueue.add("analyze-system-performance", {});
  }

  async analyzeSystemPerformance() {
    this.logger.log("Analyzing system performance...");
    const sysInfo = this.sysInfoService.getSysInfo();
    const res = await this.getSystemReportByAgent(sysInfo);
    const capacityScore = this.extractCapacityScore(res);
    if (capacityScore) {
      const myAddress = this.infoService.getMyAddress();
      const nodeInfo = await this.nodeInfoModel.findOne({ address: myAddress }).exec();
      await nodeInfo.updateOne({
        capacityScore,
      });
    }
    this.logger.verbose(capacityScore);
    return {};
  }

  async getSystemReportByAgent(sysInfo: SysInfo): Promise<LlamaResponse> {
    const res = await axios.post("http://localhost:11434/api/chat", {
      model: "llama3.2",
      messages: [
        { role: "system", content: systemMessage },
        { role: "assistant", content: assistantMessage },
        { role: "user", content: createUserMessage(sysInfo) },
      ],
      stream: false,
      format: {
        type: "object",
        properties: {
          capacityScore: {
            type: "number",
            minimum: 0,
            maximum: 1,
          },
        },
        required: ["capacityScore"],
      },
    });

    const response = res.data as LlamaResponse;
    return response;
  }

  private extractCapacityScore(response: LlamaResponse): number | null {
    try {
      const parsed = JSON.parse(response.message.content);
      if (typeof parsed.capacityScore === "number") {
        return parsed.capacityScore;
      }
      return null;
    } catch (error) {
      console.error("Failed to parse LLM content:", error);
      return null;
    }
  }
}
