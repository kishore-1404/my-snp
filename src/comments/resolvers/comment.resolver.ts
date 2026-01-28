import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from '../comments.service';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Resolver(of => Comment)
export class CommentResolver {
    constructor(private readonly commentsService: CommentsService) {}
    
    @Query(() => [Comment], { name: 'getcomments' })
    async comments(): Promise<Comment[]> {
        return this.commentsService.findAll();
    }

    @Query(() => Comment, { name: 'getcomment' })
    async comment(@Args('id') id: string): Promise<Comment | null> {
        return this.commentsService.findOne(id);
    }

    @Mutation(() => Comment, { name: 'createcomment' })
    async createComment(@Args('createCommentDto') createCommentDto: CreateCommentDto): Promise<Comment> {
        return this.commentsService.create(createCommentDto);
    }

    @Mutation(() => Comment, { name: 'updatecomment' })
    async updateComment(@Args('updateCommentDto') updateCommentDto: UpdateCommentDto): Promise<Comment | null> {
        return this.commentsService.update(updateCommentDto);
    }
    
    @Mutation(() => Comment, { name: 'deletecomment' })
    async deleteComment(@Args('id') id: string): Promise<Comment | null> {
        return this.commentsService.remove(id);
    }
}   
