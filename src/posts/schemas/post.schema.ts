import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Post extends Document {
    get id() {
        return this._id.toString();
    }

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: Types.ObjectId;

    @Prop({ default: Date.now, immutable: true, required: true })
    createdAt: Date;

    @Prop({ default: Date.now, required: true })
    updatedAt: Date;

    @Prop({ default: false, required: true, type: Boolean })
    isDeleted: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);