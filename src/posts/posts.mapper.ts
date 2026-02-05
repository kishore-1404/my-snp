import { Injectable } from "@nestjs/common";
import { PostType } from "./graphql/post.type";
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
}