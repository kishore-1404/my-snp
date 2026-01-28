import { CreateReactionDto } from "./create-reaction.dto";
import { InputType, Field, PartialType, ID } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateReactionDto extends PartialType(CreateReactionDto) {
    @Field(() => ID)
    @IsNotEmpty()
    id: string;
}

