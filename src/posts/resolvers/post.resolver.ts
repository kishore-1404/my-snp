import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PostsService } from '../posts.service';
import { Post } from '../schemas/post.schema';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PubSub } from "graphql-subscriptions";

// Use 'any' type to avoid type error with asyncIterator
const pubSub = new PubSub();

@Resolver(of => Post)
export class PostResolver {
    constructor(private readonly postsService: PostsService) {}
    
    @Query(() => [Post], { name: 'getposts' })
    async posts(): Promise<Post[]> {
        return this.postsService.findAll();
    }

    @Query(() => Post, { name: 'getpost' })
    async post(@Args('id') id: string): Promise<Post | null> {
        return this.postsService.findOne(id);
    }

    @Mutation(() => Post, { name: 'createpost' })
    async createPost(@Args('createPostDto') createPostDto: CreatePostDto): Promise<Post> {
        return this.postsService.create(createPostDto);
    }

    @Subscription(() => Post)
    postCreated() {
        return pubSub.asyncIterableIterator('postCreated');
    }

    @Mutation(() => Post, { name: 'updatepost' })
    async updatePost(@Args('updatePostDto') updatePostDto: UpdatePostDto): Promise<Post | null> {
        return this.postsService.update(updatePostDto);
    }

    @Subscription(() => Post)
    postUpdated() {
        return pubSub.asyncIterableIterator('postUpdated');
    }
    
    @Mutation(() => Post, { name: 'deletepost' })
    async deletePost(@Args('id') id: string): Promise<Post | null> {
        return this.postsService.remove(id);
    }
    
}
