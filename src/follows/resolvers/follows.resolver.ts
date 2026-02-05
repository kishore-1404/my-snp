import { Args, Mutation, Query,Resolver,ResolveField } from '@nestjs/graphql';
import { FollowsService } from '../follows.service';
import { FollowType } from '../graphql/follow.type';
import { FollowUserDto } from '../dto/create-follow.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FollowsMapper } from '../follows.mapper';
import { UserType } from 'src/users/graphql/user.type';
import { UsersService } from 'src/users/users.service';
import { UsersMapper } from 'src/users/users.mapper';

@Resolver(() => FollowType )
export class FollowsResolver {
    constructor(
        private readonly followsService: FollowsService,
        private readonly followsMapper: FollowsMapper,
        private readonly usersService: UsersService,
        private readonly usersMapper: UsersMapper
    ) {}

    @Mutation(() => FollowType)
    async followUser(@CurrentUser() user, @Args('followUserDto') followUserDto: FollowUserDto): Promise<FollowType> {
        const follow = await this.followsService.followUser(followUserDto, user.id);
        return this.followsMapper.toFollowType(follow);
    }

    @Mutation(() => FollowType, { nullable: true })
    async unfollowUser(@CurrentUser() user, @Args('followingId') followingId: string): Promise<FollowType | null> {
        const follow = await this.followsService.unfollowUser(followingId, user.id);
        return follow ? this.followsMapper.toFollowType(follow) : null;
    }

    @Query(() => [FollowType])
    async getFollowers(@Args('userId') userId: string): Promise<FollowType[]> {
        const follows = await this.followsService.getFollowers(userId);
        return follows.map(follow => this.followsMapper.toFollowType(follow));
    }

    @Query(() => [FollowType])
    async getFollowing(@Args('userId') userId: string): Promise<FollowType[]> {
        const follows = await this.followsService.getFollowing(userId);
        return follows.map(follow => this.followsMapper.toFollowType(follow));
    }

    @ResolveField(() => UserType)
    async follower(@Args('followId') followId: string): Promise<UserType | null> {
        const follow = await this.followsService.getFollowers(followId);
        const user = await this.usersService.findOne(followId);
        return user ? this.usersMapper.toUserType(user) : null;
    }

    @ResolveField(() => UserType)
    async following(@Args('followId') followId: string): Promise<UserType | null> {
        const follow = await this.followsService.getFollowing(followId);
        const user = await this.usersService.findOne(followId);
        return user ? this.usersMapper.toUserType(user) : null;
    }
}
