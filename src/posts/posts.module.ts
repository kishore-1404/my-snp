import { Module } from '@nestjs/common';
import { PostResolver } from './resolvers/post.resolver';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  providers: [PostResolver, PostsService],
})
export class PostsModule {}
