import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/users/graphql/user.type';

@ObjectType()
export class PostType {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => UserType)
  author: UserType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  isDeleted: boolean;
}
