import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/users/graphql/user.type';
import { PostType } from 'src/posts/graphql/post.type';
import { Types } from 'mongoose';

@ObjectType()
export class CommentType {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => UserType)
  author: UserType| Types.ObjectId;

  @Field(() => PostType)
  post: PostType| Types.ObjectId;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  isDeleted: boolean;
}
