import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as crypto from "crypto";
import { P2pClientService } from "../p2p-client/p2p-client.service";
import { getLocalIp } from "src/main";
import axios from "axios";
import { Interval } from "@nestjs/schedule";
import { OnEvent } from "@nestjs/event-emitter";

export const INITIAL_VDF_SEED = "0000000000000000000000000000000000000000000000000000000000000000";

@Injectable()
export class VdfService {
  private readonly logger = new Logger(VdfService.name);
  private readonly difficulty: number = Number(process.env.VDF_DIFFICULTY_LEVEL) || 100;
  private current_clock_tick: string;
  private allow_start_vdf: boolean = false;

  constructor(private readonly p2pClientService: P2pClientService) {}

  @OnEvent("seed_connected")
  async prepareVdfMechanism(payload: any) {
    this.logger.log(`✅ Seed connected: ${payload}`);
    const connected_peers = this.p2pClientService.getNodeAddress();
    const peers = connected_peers.filter((addr) => addr !== `${getLocalIp()}:${process.env.PORT || 3000}`);

    if (peers.length === 0) {
      this.current_clock_tick = INITIAL_VDF_SEED;
      this.allow_start_vdf = true;
      this.logger.log("✅ No peers found. Starting VDF with initial seed.");
    } else {
      let tickFetched = false;

      for (const addr of peers) {
        const req_addr = "http://" + addr + "/vdf/get-latest-tick";
        this.logger.verbose(`Requesting ${addr} for latest tick`);

        try {
          const response = await axios.get(req_addr);
          this.current_clock_tick = response.data;
          this.allow_start_vdf = true;
          this.logger.log(`${addr} latest tick: ${response.data}`);
          tickFetched = true;
          break;
        } catch (error) {
          this.logger.warn(`❌ Failed to fetch tick from ${addr}: ${error.message}. Trying next peer.`);
          continue;
        }
      }

      if (!tickFetched) {
        this.logger.error("❌ Cannot fetch tick from any peers. Please restart the application.");
        process.exit(1);
      }
    }
  }

  @Interval(200)
  runVDF(): { initialSeed: string; finalHash: string; iterations: number } {
    if (!this.allow_start_vdf) {
      return;
    }

    let currentHash = this.current_clock_tick;

    for (let i = 0; i < this.difficulty; i++) {
      currentHash = crypto.createHash("sha256").update(currentHash).digest("hex");
    }

    this.current_clock_tick = currentHash;

    // return {
    //   initialSeed: this.current_clock_tick,
    //   finalHash: currentHash,
    //   iterations: this.difficulty,
    // };
  }

  verifyVDF(initialSeed: string, finalHash: string, iterations: number): boolean {
    let currentHash = initialSeed;

    for (let i = 0; i < iterations; i++) {
      currentHash = crypto.createHash("sha256").update(currentHash).digest("hex");
    }

    return currentHash === finalHash;
  }

  getLatestTick(): string {
    return this.current_clock_tick;
  }
}
