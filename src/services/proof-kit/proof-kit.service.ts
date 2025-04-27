import { Injectable, Logger } from "@nestjs/common";
import { NodeInfoDocument } from "src/schemas/node-info.schema";
import mongoose from "mongoose";
import * as crypto from "crypto";

@Injectable()
export class ProofKitService {
  private readonly logger = new Logger(ProofKitService.name);
  private readonly STAKE_WEIGHT = 0.7;
  private readonly REPUTATION_WEIGHT = 0.3;

  constructor() {
    // const nodes: any[] = [
    //   {
    //     address: "ec351e24af73a8d6f9c6ac57fa77be9f24ae014b24a259a6ad708fca1b6605ab",
    //     network_address: "192.168.31.47:4005",
    //     reputation: 85,
    //     stake: 1000,
    //   },
    //   {
    //     address: "f72a3ee9c78d25bf219c8c94522dcf99d596f7fae589af340d94476eba166e4c",
    //     network_address: "10.0.15.123:4005",
    //     reputation: 92,
    //     stake: 2500,
    //   },
    //   {
    //     address: "d83b7c8fb1c1ea3cdc48847c89c3810600c8e2f77921dc9889986744dcc19449",
    //     network_address: "172.16.8.201:4005",
    //     reputation: 78,
    //     stake: 1500,
    //   },
    //   {
    //     address: "a5c4b2e9d7f8361590ce4d3b8fa7e02c1d3p9m5n6q7r8s9t0u1v2w3x4y5z6",
    //     network_address: "192.168.55.180:4005",
    //     reputation: 95,
    //     stake: 3000,
    //   },
    //   {
    //     address: "b9e7d5c2a4f1836940md7n2p5r8t1v4x7z0q3w6y9s2u5h8k1m4n7p0r3t6",
    //     network_address: "10.10.20.150:4005",
    //     reputation: 88,
    //     stake: 2000,
    //   },
    // ];
    // const randomSeedByVRF = this.verifiableRandomFunction([], "test_epoch_seed");
    // this.logger.verbose(`VRF Seed: ${randomSeedByVRF}`);
    // const leaderSchedule = this.generateWeightedLeaderSchedule(nodes, randomSeedByVRF.toString(), 20);
    // this.logger.verbose(`Leader Schedule: ${JSON.stringify(leaderSchedule, null, 2)}`);
  }

  verifiableRandomFunction(nodes: NodeInfoDocument[], epochSeed: string): bigint {
    const sortedNodes = nodes.sort((a, b) => a.address.localeCompare(b.address));
    const addressesConcatenated = sortedNodes.map((node) => node.address).join("");
    const vrfInput = addressesConcatenated + epochSeed;
    const hash = crypto.createHash("sha256").update(vrfInput).digest("hex");
    return BigInt("0x" + hash);
  }

  generateWeightedLeaderSchedule(
    nodes: NodeInfoDocument[],
    randomSeed: bigint,
    numberOfSlots: number,
  ): Record<number, string> {
    if (nodes.length === 0) {
      this.logger.error("No nodes available for leader selection.");
      return null;
    }

    const sortedNodes = [...nodes].sort((a, b) => a.address.localeCompare(b.address));

    const nodeScores = sortedNodes.map((node) => ({
      address: node.address,
      score: node.stake * this.STAKE_WEIGHT + node.reputation * this.REPUTATION_WEIGHT,
    }));

    const totalScore = nodeScores.reduce((sum, node) => sum + node.score, 0);

    if (totalScore === 0) {
      throw new Error("Total score is zero. Cannot generate leader schedule.");
    }

    const slotAssignments: string[] = [];

    for (const node of nodeScores) {
      const expectedSlots = Math.floor((node.score / totalScore) * numberOfSlots);

      for (let i = 0; i < expectedSlots; i++) {
        slotAssignments.push(node.address);
      }
    }

    while (slotAssignments.length < numberOfSlots) {
      const randomValue = crypto
        .createHash("sha256")
        .update(randomSeed + slotAssignments.length.toString())
        .digest();
      const randomInt = Number(BigInt("0x" + randomValue.toString("hex")) % BigInt(totalScore));

      let accumulated = 0;
      for (const node of nodeScores) {
        accumulated += node.score;
        if (randomInt < accumulated) {
          slotAssignments.push(node.address);
          break;
        }
      }
    }

    const shuffledSlots = this.deterministicShuffleFunction(slotAssignments, randomSeed);

    const leaderSchedule: Record<number, string> = {};
    shuffledSlots.forEach((address, index) => {
      leaderSchedule[index] = address;
    });

    return leaderSchedule;
  }

  private deterministicShuffleFunction(array: string[], randomSeed: bigint): string[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const combined = BigInt(randomSeed) ^ BigInt(i);
      const hash = crypto.createHash("sha256").update(combined.toString(16)).digest("hex");
      const bigIntHash = BigInt("0x" + hash);
      const j = Number(bigIntHash % BigInt(i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }
}
