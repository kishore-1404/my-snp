import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsResolver } from './resolvers/reactions.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }])],
  providers: [ReactionsService, ReactionsResolver]
})
export class ReactionsModule {}
