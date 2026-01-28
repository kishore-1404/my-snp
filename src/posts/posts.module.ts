import { Module } from '@nestjs/common';
import { PostResolver } from './resolvers/post.resolver';
import { PostsService } from './posts.service';

@Module({
  providers: [PostResolver, PostsService]
})
export class PostsModule {}
