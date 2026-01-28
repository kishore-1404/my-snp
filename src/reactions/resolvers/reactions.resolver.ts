
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReactionsService } from '../reactions.service';
import { Reaction } from '../schemas/reaction.schema';
import { CreateReactionDto } from '../dto/create-reaction.dto';
import { UpdateReactionDto } from '../dto/update-reaction.dto';

@Resolver(of => Reaction)
export class ReactionsResolver {
    constructor(private readonly reactionsService: ReactionsService) {}
    
    @Query(() => [Reaction], { name: 'getreactions' })
    async reactions(): Promise<Reaction[]> {
        return this.reactionsService.findAll();
    }

    @Query(() => Reaction, { name: 'getreaction' })
    async reaction(@Args('id') id: string): Promise<Reaction | null> {
        return this.reactionsService.findOne(id);
    }

    @Mutation(() => Reaction, { name: 'createreaction' })
    async createReaction(@Args('createReactionDto') createReactionDto: CreateReactionDto): Promise<Reaction> {
        return this.reactionsService.create(createReactionDto);
    }

    @Mutation(() => Reaction, { name: 'updatereaction' })
    async updateReaction(@Args('updateReactionDto') updateReactionDto: UpdateReactionDto): Promise<Reaction | null> {
        return this.reactionsService.update(updateReactionDto);
    }
}   
