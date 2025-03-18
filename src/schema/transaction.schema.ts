import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Transaction {
    @Prop({ required: false })
    sender: string;

    @Prop({ required: false })
    receiver: string;

    @Prop({ required: false })
    amount: string;

}


export type TransactionDocument = HydratedDocument<Transaction>;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);