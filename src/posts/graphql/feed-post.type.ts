import {ObjectType, Field, ID, Int} from '@nestjs/graphql';

@ObjectType()
export class FeedPostType {
    @Field(() => ID)
    id: string;

    @Field()
    content: string;

    @Field(() => ID)
    authorId: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => Int)
    reactionsCount: number;
    
    @Field(() => Int)
    commentsCount: number;
}

@ObjectType()
export class FeedResponse{
    @Field(() => [FeedPostType])
    posts: FeedPostType[];
    
    @Field(() => Int)
    total: number;
    
    @Field()
    hasMore: boolean;
}   