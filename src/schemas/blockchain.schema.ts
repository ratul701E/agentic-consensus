import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlockchainDocument = HydratedDocument<Blockchain>;

@Schema({ timestamps: true })
export class Blockchain {
  @Prop({ required: true })
  index: number;

  @Prop({ required: true })
  previousHash: string;

  @Prop({ required: true })
  transactions: Array<any>;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  nonce: number;
}

export const BlockchainSchema = SchemaFactory.createForClass(Blockchain);
