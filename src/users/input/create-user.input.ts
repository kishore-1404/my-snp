import { InputType, Field } from '@nestjs/graphql';
import { PreferencesInput } from './preferences.input';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

@InputType()
export class CreateUserInput {
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

    @Field(() => PreferencesInput, { nullable: true })
    @ValidateNested()
    preferences?: PreferencesInput;
}
