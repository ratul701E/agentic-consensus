import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class NodeInfo {
    @Prop({required: true, type: String})
    address: string;

    @Prop({required: false, type: Number, default: 0})
    reputation: number;

    @Prop({required: false, type: Number, default: 0})
    stake: number;
}

export const NodeInfoSchema = SchemaFactory.createForClass(NodeInfo);