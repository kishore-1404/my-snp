import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateNotificationDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    recipientId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    message: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    category: string;
}