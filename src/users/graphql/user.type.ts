import { Field, ID, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Role } from 'src/common/roles.enum';


@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  preferences?: Record<string, boolean>;

  @Field(() => [String])
  roles: Role[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}