import { Injectable } from '@nestjs/common';
import { FollowUserDto } from './dto/create-follow.input';
import { Follow } from './schemas/follow.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FollowsService {
    constructor(
        @InjectModel(Follow.name) private followModel: Model<Follow>
    ) {}

    async followUser(followUserDto: FollowUserDto, followerId: string): Promise<Follow> {
        const { followingId } = followUserDto;
        const existingFollow = await this.followModel.findOne({ follower: followerId, following: followingId }).exec();
        if (existingFollow) {
            return existingFollow; // Already following
        }
        const newFollow = new this.followModel({ follower: followerId, following: followingId });
        return newFollow.save();
    }

    async unfollowUser(followingId: string, followerId: string): Promise<Follow | null> {
        return this.followModel.findOneAndDelete({ follower: followerId, following: followingId }).exec();
    }

    async getFollowers(userId: string): Promise<Follow[]> {
        return this.followModel.find({ following: userId }).exec();
    }

    async getFollowing(userId: string): Promise<Follow[]> {
        return this.followModel.find({ follower: userId }).exec();
    }

    async getFollowersCount(userId: string): Promise<number> {
        return this.followModel.countDocuments({ following: userId }).exec();
    }

    async getFollowingCount(userId: string): Promise<number> {
        return this.followModel.countDocuments({ follower: userId }).exec();
    }

    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        const follow = await this.followModel.findOne({ follower: followerId, following: followingId }).exec();
        return !!follow;
    }

    async getFollowingIds(userId: string): Promise<string[]> {
        const follows = await this.followModel.find({ follower: userId }).exec();
        return follows.map(follow => follow.following.toString());
    }
}
