import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateUserDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    username: string;
    
    @Field()
    @IsNotEmpty()
    @IsString()
    email: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    password: string;
        
    @Field({ nullable: true })
    @IsString()
    bio?: string;
}