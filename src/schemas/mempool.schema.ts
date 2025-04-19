import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MempoolDocument = HydratedDocument<Mempool>;

@Schema({ timestamps: true })
export class Mempool {
  @Prop({ required: true })
  status: string; // "success", "pending", etc.

  @Prop({ required: true })
  block: number; // Block number the transaction is in

  @Prop({ required: true })
  timestamp: Date; // Time of the transaction

  @Prop({ required: true })
  transactionAction: string; // Description of the transaction

  @Prop({ required: true })
  from: string; // Sender's public key

  @Prop({ required: true })
  to: string; // Receiver's public key

  @Prop({ required: true })
  value: number; // Amount transferred

  @Prop({ required: true })
  transactionFee: number; // Fee for processing

  @Prop({ required: true })
  gasPrice: number; // Gas price for the transaction

  @Prop({ required: true, unique: true })
  transactionHash: string; // Unique identifier for the transaction

  @Prop({ required: true })
  signature: string; // Digital signature
}

export const MempoolSchema = SchemaFactory.createForClass(Mempool);
