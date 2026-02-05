import {Injectable} from '@nestjs/common';
import { CommentType } from './graphql/comment.type';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsMapper {
  toCommentType(comment: Comment): CommentType {
    const commentType = new CommentType();
    commentType.id = comment._id.toString();
    commentType.content = comment.content;
    commentType.author = comment.author; // This will be resolved to UserType in the resolver
    commentType.post = comment.post; // This will be resolved to PostType in the resolver
    commentType.parentComment = comment.parentComment ? comment.parentComment.toString() : null;
    commentType.createdAt = comment.createdAt;
    commentType.updatedAt = comment.updatedAt;
    commentType.isDeleted = comment.isDeleted;
    // Note: author and post will be resolved separately in the resolver
    return commentType;
  }
}