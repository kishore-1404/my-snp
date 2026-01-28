import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateReactionDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    content: string;
    
    @Field()    
    @IsNotEmpty()
    @IsString()
    userId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    postId: string;
}