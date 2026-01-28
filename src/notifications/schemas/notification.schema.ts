import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/schemas/user.schema';

@Schema()
@ObjectType()
export class Notification extends Document {
    @Prop({ required: true })
    @Field()
    message: string;

    @Prop({ type: String, ref: 'User', required: true })
    @Field(() => User)
    recipient: User;
    
    @Prop({ default: false , required:true, type:Boolean})
    @Field()
    isRead: boolean;

    @Prop({ default: Date.now , immutable: true,required:true})
    @Field()
    createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);