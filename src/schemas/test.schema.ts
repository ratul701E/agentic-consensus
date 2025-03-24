import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Test {
    @Prop({required: false})
    name: string;
}

export const TestSchema = SchemaFactory.createForClass(Test);