import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlockchainDocument = HydratedDocument<Blockchain>;


// Validator Schema
class Validator {
  @Prop({ required: true })
  publicKey: string;

  @Prop({ required: true })
  stakingBalance: string;

  @Prop({ required: true })
  validatorSignature: string;
}

// Proof of Stake Schema
class ProofOfStake {
  @Prop({ required: true })
  stakingReward: number;
}

// Block Info Schema
class BlockInfo {
  @Prop({ required: true })
  blockNumber: number;

  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true })
  merkleRoot: string;

  @Prop({ required: true })
  blockHash: string;

  @Prop({ required: true })
  previousBlockHash: string;

  @Prop({ required: true, type: Validator })
  validator: Validator;

  @Prop({ required: true, type: ProofOfStake })
  proofOfStake: ProofOfStake;
}

// Transaction Schema
class Transaction {
  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  block: number;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  transactionAction: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  transactionFee: number;

  @Prop({ required: true })
  gasPrice: number;

  @Prop({ required: true })
  transactionHash: string;

  @Prop({ required: true })
  signature: string;
}

// Blockchain Schema
@Schema({ timestamps: true })
export class Blockchain {
  @Prop({ required: true, type: BlockInfo })
  blockInfo: BlockInfo;

  @Prop({ required: true, type: [Transaction] })
  transactions: Transaction[];
}

export const BlockchainSchema = SchemaFactory.createForClass(Blockchain);
