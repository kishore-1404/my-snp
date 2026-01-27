import { CreateUserDto } from "./create-user.dto";
import { InputType, Field, PartialType, ID } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @Field(() => ID)
    @IsNotEmpty()
    id: string;
}