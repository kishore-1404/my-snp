import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PostsService } from '../posts.service';
// import { Post } from '../schemas/post.schema';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PubSub } from "graphql-subscriptions";
import { PostType } from '../graphql/post.type';

// Use 'any' type to avoid type error with asyncIterator
const pubSub = new PubSub();

@Resolver(of => PostType)
export class PostResolver {
    constructor(private readonly postsService: PostsService) {}
    
    @Query(() => [PostType], { name: 'getposts' })
    async posts(): Promise<PostType[]> {
        return this.postsService.findAll();
    }

    @Query(() => PostType, { name: 'getpost' })
    async post(@Args('id') id: string): Promise<PostType | null> {
        return this.postsService.findOne(id);
    }

    @Mutation(() => PostType, { name: 'createpost' })
    async createPost(
        @Args('createPostDto') createPostDto: CreatePostDto,
        @CurrentUser() user: any
    ): Promise<PostType> {
        return this.postsService.create(createPostDto, user._id);
    }

    @Subscription(() => PostType)
    postCreated() {
        return pubSub.asyncIterableIterator('postCreated');
    }

    @Mutation(() => PostType, { name: 'updatepost' })
    async updatePost(
        @Args('updatePostDto') updatePostDto: UpdatePostDto,
        @CurrentUser() user: any
    ): Promise<PostType | null> {
        return this.postsService.update(updatePostDto, user._id);
    }

    @Subscription(() => PostType)
    postUpdated() {
        return pubSub.asyncIterableIterator('postUpdated');
    }

    @Mutation(() => PostType, { name: 'deletepost' })
    async deletePost(@Args('id') id: string): Promise<PostType | null> {
        return this.postsService.remove(id);
    }
    
}
