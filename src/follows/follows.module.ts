import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsResolver } from './resolvers/follows.resolver';
import { AggregationResolver } from './resolvers/aggregation.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './schemas/follow.schema';
import { UsersModule } from 'src/users/users.module';
import { FollowsMapper } from './follows.mapper';

@Module({
  imports: [MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]), UsersModule],
  providers: [FollowsService, FollowsResolver, AggregationResolver, FollowsMapper],
  exports: [FollowsService, FollowsMapper],
})
export class FollowsModule {}
