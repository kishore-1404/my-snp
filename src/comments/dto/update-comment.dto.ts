import {CreateCommentDto} from "./create-comment.dto";
import {InputType, Field, PartialType, ID} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";

@InputType()
export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @Field(() => ID)
    @IsNotEmpty()
    id: string;
}