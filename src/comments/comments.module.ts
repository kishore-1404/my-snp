import { Module } from '@nestjs/common';
import { CommentResolver } from './resolvers/comment.resolver';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
  providers: [CommentResolver, CommentsService]
})
export class CommentsModule {}
