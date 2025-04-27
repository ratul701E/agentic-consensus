import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { EpochStatus } from "src/services/epoch/enums";

export type EpochDocument = Epoch & Document;

@Schema({ timestamps: true })
export class Epoch {
  @Prop({ required: true })
  epochIndentifier: string;

  @Prop({ required: true })
  startSlot: number;

  @Prop({ required: true })
  endSlot: number;

  @Prop({ required: true })
  randomSeed: string;

  @Prop({ default: EpochStatus.PENDING, type: String })
  status: EpochStatus;
}

export const EpochSchema = SchemaFactory.createForClass(Epoch);
