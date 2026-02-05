import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { UserType } from 'src/users/graphql/user.type';

@ObjectType()
export class PostType {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => UserType)
  author: UserType | Types.ObjectId; // Object ID is only for internal purposes, GraphQL will always return the populated UserType

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  isDeleted: boolean;
}
