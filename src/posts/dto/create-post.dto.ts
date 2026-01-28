import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreatePostDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    content: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    authorId: string;
}