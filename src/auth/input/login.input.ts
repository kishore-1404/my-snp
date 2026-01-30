import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

@InputType()
export class LoginInputDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    username: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    password: string;
}