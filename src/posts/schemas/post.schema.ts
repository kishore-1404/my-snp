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
export class Post extends Document {
    @Field(() => ID)
    get id() {
        return this._id.toString();
    }

    @Prop({ required: true })
    @Field()
    content: string;
    
    @Prop({ type: String, ref: 'User', required: true })
    @Field(() => UserType)
    author: UserType;

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

export const PostSchema = SchemaFactory.createForClass(Post);