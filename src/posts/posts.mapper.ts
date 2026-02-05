import { Injectable } from "@nestjs/common";
import { PostType } from "./graphql/post.type";
import { FeedPostType } from "./graphql/feed-post.type";
import { Post } from "./schemas/post.schema";

@Injectable()
export class PostsMapper {
    toPostType(post: Post): PostType {
        const postType = new PostType();
        postType.id = post._id.toString();
        postType.content = post.content;
        postType.author = post.author; // This will be resolved in the resolver
        postType.createdAt = post.createdAt;
        postType.updatedAt = post.updatedAt;
        return postType;
    }

    toFeedPostType(post: any): FeedPostType {
        const feedPost = new FeedPostType();
        feedPost.id = post._id?.toString?.() || '';
        feedPost.content = post.content || '';
        feedPost.authorId = post.author?.toString?.() || post.authorId?.toString?.() || '';
        feedPost.createdAt = post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);
        feedPost.updatedAt = post.updatedAt instanceof Date ? post.updatedAt : new Date(post.updatedAt);
        feedPost.reactionsCount = post.reactionCount ?? post.reactionsCount ?? 0;
        feedPost.commentsCount = post.commentCount ?? post.commentsCount ?? 0;
        return feedPost;
    }
}