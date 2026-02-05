import { Args, Mutation, Query, Resolver, Subscription, ResolveField, Parent } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PostsService } from '../posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PubSub } from "graphql-subscriptions";
import { PostType } from '../graphql/post.type';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/users/graphql/user.type';
import { UsersMapper } from 'src/users/users.mapper';
import { PostsMapper } from '../posts.mapper';
// Use 'any' type to avoid type error with asyncIterator
const pubSub = new PubSub();

@Resolver(of => PostType)
export class PostResolver {
    constructor(
        private readonly postsService: PostsService,
        private readonly postsMapper: PostsMapper,
        private readonly usersService: UsersService,
        private readonly usersMapper: UsersMapper
    ) {}
    
    @Query(() => [PostType], { name: 'getposts' })
    async posts(): Promise<PostType[]> {
        const posts = await this.postsService.findAll();
        return posts.map(p => this.postsMapper.toPostType(p));
    }

    @Query(() => PostType, { name: 'getpost' })
    async post(@Args('id') id: string): Promise<PostType | null> {
        const post = await this.postsService.findOne(id);
        return post ? this.postsMapper.toPostType(post) : null;
    }

    @Mutation(() => PostType, { name: 'createpost' })
    async createPost(
        @Args('createPostDto') createPostDto: CreatePostDto,
        @CurrentUser() user: any
    ): Promise<PostType> {
        const post = await this.postsService.create(createPostDto, user._id);
        return this.postsMapper.toPostType(post);
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
        const post = await this.postsService.update(updatePostDto, user._id);
        return post ? this.postsMapper.toPostType(post) : null;
    }

    @Subscription(() => PostType)
    postUpdated() {
        return pubSub.asyncIterableIterator('postUpdated');
    }

    @Mutation(() => PostType, { name: 'deletepost' })
    async deletePost(@Args('id') id: string): Promise<PostType | null> {
        const post = await this.postsService.remove(id);
        return post ? this.postsMapper.toPostType(post) : null;
    }

    @ResolveField(() => UserType)
    async author(@Parent() post: PostType) {
        // If author is already populated, return as is
        // if (post.author && typeof post.author === 'object') {
        //     return post.author;
        // }
        // Otherwise, fetch user by ID
        const user = await this.usersService.findOne(post.author.toString());
        return user ? this.usersMapper.toUserType(user) : null;
    }
}
