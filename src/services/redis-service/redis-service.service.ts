import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Queue } from "bullmq";
import { Queues } from "src/jobs/queue.enum";

@Injectable()
export class RedisServiceService implements OnModuleInit {
  private readonly logger = new Logger(RedisServiceService.name);
  constructor(@InjectQueue(Queues.SYS_PERFORMENCE_ANALYZER) private paQueue: Queue) {}

  async onModuleInit() {
    try {
      const client = await this.paQueue.client;

      client.on("ready", () => {
        this.logger.log("Redis connection is ready.");
      });

      client.on("error", () => {
        this.logger.error("Redis connection error");
      });
    } catch (err) {
      this.logger.error("Failed to get Redis client");
    }
  }
}
