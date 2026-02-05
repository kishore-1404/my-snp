import { Module } from '@nestjs/common';
import { PostResolver } from './resolvers/post.resolver';
import { PostsService } from './posts.service';
import { PostsMapper } from './posts.mapper';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { UsersModule } from 'src/users/users.module';
import { FollowsModule } from 'src/follows/follows.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UsersModule,
    FollowsModule,
  ],
  providers: [PostResolver, PostsService, PostsMapper],
  exports: [PostsService, PostsMapper],
})
export class PostsModule {}
