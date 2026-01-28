import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';


@Schema()
@ObjectType()
export class User extends Document {

    @Prop({ required: true, unique: true })
    @Field()
    username: string;

    @Prop({ required: true, unique: true })
    @Field()
    email: string;

    @Prop({ required: true })
    @Field()
    password: string;

    @Prop()
    @Field({ nullable: true })
    bio?: string;

    @Prop({type: Map, of:Boolean, default: {}})
    @Field(() => Map)
    preferences: Map<string, boolean>;

    @Prop({ default: Date.now , immutable: true,required:true})
    @Field()
    createdAt: Date;
    

    @Prop({ default: Date.now , required:true})
    @Field()
    updateAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);