import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Epoch } from "./epoch.schema";

export type SlotDocument = Slot & Document;

@Schema({ timestamps: true })
export class Slot {
  @Prop({ required: true })
  slotNumber: number;

  @Prop({ type: Types.ObjectId, ref: Epoch.name, required: true })
  epoch: Types.ObjectId;

  @Prop({ required: true })
  leaderAddress: string;

  @Prop({ default: null })
  proposedBlockId: string;

  @Prop({ default: false })
  produced: boolean;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
