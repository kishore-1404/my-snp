import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Order extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ type: String })
    customerPhone: string;

    @Prop({ type: String })
    customerEmail: string;

    @Prop({ type: String })
    customerName: string;

    @Prop({ type: String, required: true })
    orderId: string;

    @Prop({ type: String })
    cfOrderId: string;

    @Prop({ type: Number, required: true })
    amount: number;

    @Prop({ type: String, required: true })
    currency: string;

    @Prop({ type: String, required: true })
    status: string;

    @Prop({ type: String })
    paymentStatus: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);