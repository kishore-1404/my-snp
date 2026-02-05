import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/users/graphql/user.type';

@Schema()
@ObjectType()
export class Notification extends Document {
    @Field(() => ID)
    get id() {
        return this._id.toString();
    }
    @Prop({ required: true })
    @Field()
    message: string;

    @Prop({ type: String, ref: 'User', required: true })
    @Field(() => UserType)
    recipient: UserType;
    
    @Prop({ default: false , required:true, type:Boolean})
    @Field()
    isRead: boolean;

    @Prop({ default: Date.now , immutable: true,required:true})
    @Field()
    createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);