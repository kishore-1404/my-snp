import { Args, Int, Resolver, Query, Mutation } from '@nestjs/graphql';
import { FollowsService } from '../follows.service';
import { FollowersWithDetailsResponse, SuggestedUsersResponse } from '../graphql/aggregation.types';
import { FollowsMapper } from '../follows.mapper';

@Resolver()
export class AggregationResolver {
    constructor(
        private readonly followsService: FollowsService,
        private readonly followsMapper: FollowsMapper
    ) {}

    @Query(() => FollowersWithDetailsResponse)
    async getFollowersWithDetails(
        @Args('userId') userId: string,
        @Args('skip', { type: () => Int, nullable: true }) skip?: number,
        @Args('limit', { type: () => Int, nullable: true }) limit?: number
    ): Promise<FollowersWithDetailsResponse> {
        // Service returns array of followers with details
        const followers = await this.followsService.getFollowersWithDetails(userId, skip, limit);
        // Map to followers with details response
        const followersWithDetails = Array.isArray(followers)
            ? followers.map(follow => this.followsMapper.toFollowerWithDetails(follow))
            : [];
        // Always get totalCount from service count method
        const totalCount = await this.followsService.getFollowersCount(userId);
        return { followers: followersWithDetails, totalCount };
    }

    @Query(() => SuggestedUsersResponse)
    async getSuggestedUsers(
        @Args('userId') userId: string,
        @Args('limit', { type: () => Int, nullable: true }) limit?: number
    ): Promise<SuggestedUsersResponse> {
        const suggestions = await this.followsService.getSuggestedUsers(userId, limit);
        const users = Array.isArray(suggestions)
            ? suggestions.map(s => this.followsMapper.toSuggestedUser(s))
            : [];
        return { users, totalCount: users.length };
    }




}