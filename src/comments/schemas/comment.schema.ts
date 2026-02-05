import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/users/graphql/user.type'; 
import { Post } from 'src/posts/schemas/post.schema';

@Schema()
@ObjectType()
export class Comment extends Document {

    @Prop({ required: true })
    @Field()
    content: string;
    
    @Prop({ type: String, ref: 'User', required: true })
    @Field(() => UserType)
    author: UserType;
        
    @Prop({ type: String, ref: 'Post', required: true })
    @Field(() => Post)
    post: Post;

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

export const CommentSchema = SchemaFactory.createForClass(Comment);