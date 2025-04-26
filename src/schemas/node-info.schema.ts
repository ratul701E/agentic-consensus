import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class NodeInfo {
    @Prop({required: true, type: String})
    address: string;

    @Prop({required: true, type: String})
    network_address: string;

    @Prop({required: false, type: Number, default: 0})
    reputation: number;

    @Prop({required: false, type: Number, default: 0})
    stake: number;
}

export const NodeInfoSchema = SchemaFactory.createForClass(NodeInfo);
export type NodeInfoDocument = HydratedDocument<NodeInfo>;