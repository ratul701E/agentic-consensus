import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model } from "mongoose";
import { Epoch, EpochDocument } from "src/schemas/epoch.schema";
import { Slot, SlotDocument } from "src/schemas/slot.schema";
import { ProofKitService } from "../proof-kit/proof-kit.service";
import { BlockService } from "src/modules/block/block.service";
import { EpochStatus } from "./enums";
import { NodeInfoDocument } from "src/schemas/node-info.schema";
import { getLocalIp } from "src/main";
import { P2pClientService } from "src/modules/p2p-client/p2p-client.service";
import { InfoService } from "src/modules/info/info.service";
import axios from "axios";
import * as crypto from "crypto";

@Injectable()
export class EpochService implements OnModuleInit {
  private readonly logger = new Logger(EpochService.name);
  private readonly MAX_SLOTS_PER_EPOCH = 6;
  private CURRENT_SLOT = 1;
  private currentEpoch: EpochDocument;

  constructor(
    @InjectModel(Epoch.name) private readonly epochModel: Model<Epoch>,
    @InjectModel(Slot.name) private readonly slotModel: Model<Slot>,
    private readonly proofKitService: ProofKitService,
    private readonly p2pClientsService: P2pClientService,
    private readonly infoService: InfoService,
  ) {}

  async onModuleInit() {
    await this.epochModel.deleteMany({});
    await this.slotModel.deleteMany({});
  }

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: "UTC" }) // CHANGE LATER
  async createEpoch() {
    this.logger.verbose("Creating new epoch...");
    const lastEpoch = await this.getLastEpoch();

    const nodes_information = await this.getCoonectedNodesInfo();

    if (!nodes_information) {
      this.logger.error("No nodes connected!");
      return;
    }

    if (nodes_information.length < 2) {
      this.logger.error("❌ Not enough nodes connected for create an epoch!");
      return;
    }

    const random_seed = this.proofKitService.verifiableRandomFunction(
      nodes_information,
      `epoch_random_seed_value_DECENTRALIZED_CHAIN_LINK_${new Date().getUTCMinutes()}`,
    );

    this.logger.log(`Random seed: ${random_seed}`);

    const leader_schedule = this.proofKitService.generateWeightedLeaderSchedule(
      nodes_information,
      random_seed,
      this.MAX_SLOTS_PER_EPOCH,
    );

    const newEpoch = new this.epochModel({
      epochIndentifier: crypto.createHash("sha256").update(random_seed.toString()).digest("hex"),
      startSlot: 0,
      endSlot: this.MAX_SLOTS_PER_EPOCH - 1,
      randomSeed: random_seed,
    });
    await newEpoch.save();
    this.currentEpoch = newEpoch;

    this.logger.log("New epoch created!");
    this.logger.log(`Creating slots for epoch ${newEpoch.epochIndentifier}...`);

    for (const [slotNumber, leader] of Object.entries(leader_schedule)) {
      const newSlot = new this.slotModel({
        slotNumber: parseInt(slotNumber),
        leaderAddress: leader,
        epoch: newEpoch._id,
      });
      await newSlot.save();
    }

    this.logger.log(`Slots created for epoch ${newEpoch.epochIndentifier}!`);
    this.CURRENT_SLOT = 1;
    this.logger.log(`Current Epoc: ${this.currentEpoch.epochIndentifier}`);
  }

  async updateEpochStatus(epoch_id: string, status: EpochStatus): Promise<boolean> {
    const epoch = await this.epochModel.findById(epoch_id);
    if (!epoch) {
      return false;
    }
    epoch.status = status;
    try {
      await epoch.save();
      return true;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  async updateSlotInfo(slot_id: string, block_hash?: string, produced?: boolean): Promise<boolean> {
    const slot = await this.slotModel.findById(slot_id);
    if (!slot) {
      return false;
    }
    slot.updateOne({
      blockHash: block_hash,
      produced: produced,
    });
    try {
      await slot.save();
      return true;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  async getEpoch(epoch_id: string): Promise<EpochDocument> {
    const epoch = await this.epochModel.findById(epoch_id);
    if (!epoch) {
      return null;
    }
    return epoch;
  }

  async getSlotById(slot_id: string): Promise<SlotDocument> {
    const slot = await this.slotModel.findById(slot_id);
    if (!slot) {
      return null;
    }
    return slot;
  }

  async getLastEpoch(): Promise<EpochDocument> {
    const epoch = await this.epochModel.findOne().sort({ createdAt: -1 }).exec();

    if (!epoch) {
      return null;
    }

    return epoch;
  }

  async getNextSlot() {
    if (this.CURRENT_SLOT > this.MAX_SLOTS_PER_EPOCH) return null;
    if (!this.currentEpoch) {
      return null;
    }
    const slot = await this.slotModel.findOne({ slotNumber: this.CURRENT_SLOT, epoch: this.currentEpoch._id }).exec();
    if (!slot) {
      return null;
    }
    this.CURRENT_SLOT++;
    this.logger.verbose(`Current slot: ${slot.slotNumber} of epoch ${this.currentEpoch.epochIndentifier}`);
    return slot;
  }

  async getCoonectedNodesInfo() {
    const node_staking_info: NodeInfoDocument[] = [await this.infoService.getThisNodeInfo()];
    const node_addresses = this.p2pClientsService.getNodeAddress();

    this.logger.log(node_addresses);

    for (const addr of node_addresses.filter((addr) => addr !== `${getLocalIp()}:${process.env.PORT || 3000}`)) {
      const req_addr = "http://" + addr + "/info";
      this.logger.verbose(`Requesting ${addr} for staking info`);
      await axios
        .get(req_addr)
        .then((res) => {
          node_staking_info.push(res.data);
          console.log(`${addr} staking info: \n`, res.data);
        })
        .catch((error) => console.log(error));
    }

    // const randomSeed = this.proofKitService.verifiableRandomFunction(node_staking_info, "epoch_Seed");
    // const leaderSchedule = this.proofKitService.generateWeightedLeaderSchedule(node_staking_info, randomSeed, 20);
    // this.logger.verbose(`Leader schedule: ${JSON.stringify(leaderSchedule, null, 2)}`);

    return node_staking_info;
  }
}
