import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { NodeInfo, NodeInfoDocument } from "src/schemas/node-info.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { createHash } from "crypto";
import { getLocalIp } from "src/main";

@Injectable()
export class InfoService implements OnModuleInit {
  private readonly myAddress = createHash("sha256")
    .update(String(`${getLocalIp()}:${process.env.PORT || 3000}`))
    .digest("hex");
  private readonly logger = new Logger(InfoService.name);

  constructor(@InjectModel(NodeInfo.name) private nodeInfoModel: Model<NodeInfo>) {
    this.logger.log("Node wallet address: " + this.myAddress);
  }
  async onModuleInit() {
    const existingNode = await this.nodeInfoModel.findOne({ address: this.myAddress }).exec();
    if (!existingNode) {
      const nodeInfo = new this.nodeInfoModel({
        address: this.myAddress,
        network_address: `${getLocalIp()}:${process.env.PORT || 3000}`,
        stake: Math.floor(Math.random() * (150 - 100 + 1)) + 100,
        reputation: Math.floor(Math.random() * (15 - 10 + 1)) + 10,
      });
      await nodeInfo.save();
      this.logger.log("Created new node info record");
    }
  }

  async getThisNodeInfo(): Promise<NodeInfoDocument> {
    return await this.nodeInfoModel.findOne().where("address", this.myAddress).exec();
  }

  getMyAddress(): string {
    return this.myAddress;
  }
}
