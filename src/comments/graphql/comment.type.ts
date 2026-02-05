import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/users/graphql/user.type';
import { PostType } from 'src/posts/graphql/post.type';

@ObjectType()
export class CommentType {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => UserType)
  author: UserType;

  @Field(() => PostType)
  post: PostType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  isDeleted: boolean;
}
