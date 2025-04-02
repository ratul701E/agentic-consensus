import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MempoolDocument = HydratedDocument<Mempool>;

@Schema({ timestamps: true })
export class Mempool {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'pending' })
  status: string; // e.g., "pending", "confirmed"
}

export const MempoolSchema = SchemaFactory.createForClass(Mempool);
