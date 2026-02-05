import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from '../comments.service';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Resolver(of => Comment)
export class CommentResolver {
    constructor(private readonly commentsService: CommentsService) {}
    
    @Query(() => [Comment], { name: 'getcomments' })
    async comments(): Promise<Comment[]> {
        // Public: returns all comments
        return this.commentsService.findAll();
    }

    @Query(() => Comment, { name: 'getcomment' })
    async comment(@Args('id') id: string): Promise<Comment | null> {
        // Public: returns comment by id
        return this.commentsService.findOne(id);
    }

    @Mutation(() => Comment, { name: 'createcomment' })
    async createComment(@CurrentUser() user, @Args('createCommentDto') createCommentDto: CreateCommentDto): Promise<Comment> {
        // Use user context for author
        return this.commentsService.create(createCommentDto, user.id);
    }

    @Mutation(() => Comment, { name: 'updatecomment' })
    async updateComment(@CurrentUser() user, @Args('updateCommentDto') updateCommentDto: UpdateCommentDto): Promise<Comment | null> {
        // Only allow update for current user's comment
        return this.commentsService.update(updateCommentDto, user.id);
    }
    
    @Mutation(() => Comment, { name: 'deletecomment' })
    async deleteComment(@CurrentUser() user, @Args('id') id: string): Promise<Comment | null> {
        // Only allow delete for current user's comment
        return this.commentsService.remove(id, user.id);
    }
}   
