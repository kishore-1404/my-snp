import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/posts/schemas/post.schema';
import { UserType } from 'src/users/graphql/user.type';

@Schema()
@ObjectType()
export class Reaction extends Document {

    @Prop({ required: true , type:String, enum:['like','love','haha','wow','sad','angry']})
    @Field()
    type: string;
    
    @Prop({ type: String, ref: 'User', required: true })
    @Field(() => UserType)
    user: UserType;
        
    @Prop({ type: String, ref: 'Post', required: true })
    @Field(() => Post)
    post: Post;
    
    @Prop({ default: Date.now , immutable: true,required:true})
    @Field()
    createdAt: Date;

    @Prop({ default: Date.now , required:true})
    @Field()
    updateAt: Date;
    
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);