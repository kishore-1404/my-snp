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
export class Post extends Document {

    @Prop({ required: true })
    @Field()
    content: string;
    
    @Prop({ type: String, ref: 'User', required: true })
    @Field(() => User)
    author: User;

    @Prop({ default: Date.now , immutable: true,required:true})
    @Field()
    createdAt: Date;
    
    @Prop({ default: Date.now , required:true})
    @Field()
    updateAt: Date;


    @Prop({ default: false , required:true, type:Boolean})
    @Field()
    isDeleted: boolean;

}