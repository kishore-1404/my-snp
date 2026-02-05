
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Comment extends Document {
    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
    post: Types.ObjectId;

    // Parent comment reference for nested comments
    @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
    parentComment: Types.ObjectId | null;

    @Prop({ default: Date.now, immutable: true, required: true })
    createdAt: Date;

    @Prop({ default: Date.now, required: true })
    updatedAt: Date;

    @Prop({ default: false, required: true, type: Boolean })
    isDeleted: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);