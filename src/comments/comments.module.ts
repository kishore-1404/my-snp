import { Module } from '@nestjs/common';
import { CommentResolver } from './resolvers/comment.resolver';
import { CommentsService } from './comments.service';

@Module({
  providers: [CommentResolver, CommentsService]
})
export class CommentsModule {}
