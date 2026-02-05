import { Args, Mutation, Query, ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { CommentType } from '../graphql/comment.type';
import { CommentsService } from '../comments.service';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CommentsMapper } from '../comments.mapper';
import { UserType } from 'src/users/graphql/user.type';
import { PostType } from 'src/posts/graphql/post.type';
@Resolver(of => CommentType)
export class CommentResolver {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly commentsMapper: CommentsMapper) {}
    
    @Query(() => [CommentType], { name: 'getcomments' })
    async comments(): Promise<CommentType[]> {
        return (await this.commentsService.findAll()).map(comment => this.commentsMapper.toCommentType(comment));
    }

    @Query(() => CommentType, { name: 'getcomment' })
    async comment(@Args('id') id: string): Promise<CommentType | null> {
        const comment = await this.commentsService.findOne(id);
        return comment ? this.commentsMapper.toCommentType(comment) : null;
    }

    @Mutation(() => CommentType, { name: 'createcomment' })
    async createComment(@CurrentUser() user, @Args('createCommentDto') createCommentDto: CreateCommentDto): Promise<CommentType> {
        const comment = await this.commentsService.create(createCommentDto, user.id);
        return this.commentsMapper.toCommentType(comment);
    }

    @Mutation(() => CommentType, { name: 'updatecomment' })
    async updateComment(@CurrentUser() user, @Args('updateCommentDto') updateCommentDto: UpdateCommentDto): Promise<CommentType | null> {
        const comment = await this.commentsService.update(updateCommentDto, user.id);
        return comment ? this.commentsMapper.toCommentType(comment) : null;
    }

    @Mutation(() => CommentType, { name: 'deletecomment' })
    async deleteComment(@CurrentUser() user, @Args('id') id: string): Promise<CommentType | null> {
        const comment = await this.commentsService.remove(id, user.id);
        return comment ? this.commentsMapper.toCommentType(comment) : null;
    }

    @ResolveField(() => UserType)
    async author(@Parent() comment: CommentType): Promise<UserType | null> {
        if (typeof comment.author === 'object' && 'id' in comment.author) {
            return comment.author as UserType;
        }
        const user = await this.commentsService['usersService'].findOne(comment.author as string);
        return user ? this.commentsService['usersMapper'].toUserType(user) : null;
    }

    @ResolveField(() => PostType)
    async post(@Parent() comment: CommentType): Promise<PostType | null> {
        if (typeof comment.post === 'object' && 'id' in comment.post) {
            return comment.post as PostType;
        }
        const post = await this.commentsService['postsService'].findOne(comment.post as string);
        return post ? this.commentsService['postsMapper'].toPostType(post) : null;
    }   

}   
