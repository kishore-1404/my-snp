import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateCommentDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    content: string;
    
    @Field()
    @IsNotEmpty()
    @IsString()
    postId: string;

    @Field({ nullable: true })
    @IsString()
    parentCommentId?: string;
}