import { InputType, Field } from "@nestjs/graphql";
import { IsMongoId, IsNotEmpty } from "class-validator";

@InputType()
export class FollowUserDto {
    @Field()
    @IsNotEmpty()
    @IsMongoId()
    readonly followingId: string;
}