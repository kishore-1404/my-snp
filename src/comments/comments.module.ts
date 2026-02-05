import { Module } from '@nestjs/common';
import { CommentResolver } from './resolvers/comment.resolver';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsMapper } from './comments.mapper';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [MongooseModule.forFeature(
    [
      { name: Comment.name, schema: CommentSchema }]),
      UsersModule, PostsModule],
  providers: [CommentResolver, CommentsService, CommentsMapper],
  exports: [CommentsService, CommentsMapper],
})
export class CommentsModule {}
