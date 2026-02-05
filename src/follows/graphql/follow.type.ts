import { ObjectType,Field, ID } from "@nestjs/graphql";
import { UserType } from "src/users/graphql/user.type";

@ObjectType()
export class FollowType {
    @Field(() => ID)
    id: string;

    @Field(() => UserType)
    follower: UserType;

    @Field(() => UserType)
    following: UserType;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}