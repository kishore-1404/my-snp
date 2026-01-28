import { CreatePostDto } from "./create-post.dto";
import { InputType, Field, PartialType, ID } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdatePostDto extends PartialType(CreatePostDto) {
    @Field(() => ID)
    @IsNotEmpty()
    id: string;
}