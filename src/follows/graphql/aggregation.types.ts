import { ObjectType,Field,Int,Float,ID } from "@nestjs/graphql";

@ObjectType()
export class FollowerWithDetails {
    @Field(() => ID)
    followId: string;

    @Field(() => ID)
    userId: string;

    @Field()
    username: string;
    
    @Field()
    isFollowingBack: boolean;

    @Field()
    followedAt: Date;
}

@ObjectType()
export class FollowersWithDetailsResponse   {
    @Field(() => [FollowerWithDetails])
    followers: FollowerWithDetails[];

    @Field(() => Int)
    totalCount: number;
}
    
@ObjectType()
export class SuggestedUser {
    @Field(() => ID)
    userId: string;
    
    @Field()
    username: string;

    @Field(() => Int)
    commonConnections: number;

    @Field(() => [ID])
    connectedThrough: string[];
}

@ObjectType()
export class SuggestedUsersResponse {
    @Field(() => [SuggestedUser])
    users: SuggestedUser[];

    @Field(() => Int)
    totalCount: number;
}