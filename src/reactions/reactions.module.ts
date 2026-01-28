import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsResolver } from './resolvers/reactions.resolver';

@Module({
  providers: [ReactionsService, ReactionsResolver]
})
export class ReactionsModule {}
