import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MempoolDocument = HydratedDocument<Mempool>;

@Schema({ timestamps: true })
export class Mempool {
  @Prop({ type: [String], required: true })
  signatures: string[];

  @Prop({
    type: {
      account_keys: { type: [String], required: true },
      recent_blockhash: { type: String, required: true },
      instructions: {
        type: [
          {
            program_id_index: { type: Number, required: true },
            accounts: { type: [Number], required: true },
            data: { type: [Number], required: true },
          },
        ],
        required: true,
      },
    },
    required: true,
  })
  message: {
    account_keys: string[];
    recent_blockhash: string;
    instructions: {
      program_id_index: number;
      accounts: number[];
      data: number[];
    }[];
  };
}

export const MempoolSchema = SchemaFactory.createForClass(Mempool);
