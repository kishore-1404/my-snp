import { Injectable } from '@nestjs/common';
import { FollowUserDto } from './dto/create-follow.input';
import { Follow } from './schemas/follow.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Types, PipelineStage } from 'mongoose';
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

    async getFollowersWithDetails(userId: string, page: number=1, limit: number=20): Promise<Follow[]> {
        const skip = (page - 1) * limit;

        const pipeline: PipelineStage[] = [
            //Stage 1: Match follows where the user is the following
            { $match: { following: new Types.ObjectId(userId) } },

            //Stage 2: Sort by recent follows
            { $sort: { createdAt: -1 } },

            //Stage 3: Join with users collection to get follower details
            {
                $lookup: {
                    from: 'users', // Name of the users collection
                    localField: 'follower', // Field in follows collection
                    foreignField: '_id', // Field in users collection
                    as: 'followerDetails' // Output array field
                }
            },

            //Stage 4: Unwind the followerDetails array to get a single object
            { $unwind: {
                path: '$followerDetails',
                preserveNullAndEmptyArrays: false,
            } },

            //Stage 5: Check if current user is following the follower (for mutual follow status)
            {
                $lookup: {
                    from: 'follows',
                    let: { followerId: '$followerDetails._id' },
                    pipeline: [
                        { $match: { $expr: { $and: [
                            { $eq: ['$follower', new Types.ObjectId(userId)] },
                            { $eq: ['$following', '$$followerId'] }
                        ] } } }
                    ],
                    as: 'isFollowingBack'
                }
            },

            //Stage 6: Add a field to indicate mutual follow status
            {
                $addFields: {
                    isMutualFollow: { $gt: [ { $size: '$isFollowingBack' }, 0 ] }
                }
            },

            //Stage 7: Select only needed fields for response
            {
                $project: {
                    _id: 0,
                    followID: '$_id',
                    userId: '$followerDetails._id',
                    username: '$followerDetails.username',
                    isFollowingBack: 1,
                    followedAt: '$createdAt'
                }
            },

            // Stage 8: Pagination
            { 
                $facet: {
                    metadata: [ { $count: "total" } ],
                    data: [ { $skip: skip }, { $limit: limit } ]
                }
            }
        ];

        const result = await this.followModel.aggregate(pipeline).exec();
        return result[0].data; // Return the paginated followers with details
    }

    //Suggested Users to follow
    // Idea:
    // Find who user follow
    // Find who those users follow
    // Count how many of my followings follow them
    // Exclude who I already follow and myself
    // sort by connections
    async getSuggestedUsers(userId: string, limit: number=10): Promise<any[]> {
        const pipeline: PipelineStage[] = [
            //stage 1: Find who the user is following
            { $match: { follower: new Types.ObjectId(userId) } },
            
            //stage 2: Find who those users are following
            { $lookup: {
                from: 'follows',
                localField: 'following',
                foreignField: 'follower',
                as: 'secondDegreeFollows'}
            },

            //stage 3: Unwind the secondDegreeFollows array
            { $unwind: '$secondDegreeFollows' },

            // Stage 4: Extract the suggested user ID
            {
                $group: {
                    _id: '$secondDegreeFollows.following',
                    commonConnections: { $sum: 1 }, //count how many of my follows also follow them

                    connectedThrough: {$push: '$following' } // who I know that follows them

                }
            },

            // Stage 5: Exclude self
            { $match: {
                _id: { $ne: new Types.ObjectId(userId) }
            } },

            // Stage 6: Exclude already followed users
            { $lookup: {
                from: 'follows',
                let: { suggestedUserId: '$_id' },
                pipeline: [
                    { $match: { 
                        $expr: { $and: [
                            { $eq: ['$follower', new Types.ObjectId(userId)] },
                            { $eq: ['$following', '$$suggestedUserId'] }
                        ] }
                    } }
                ],
                as: 'alreadyFollowing'
            } },
            //Stage 7: Keep only those not already followed

            { $match: {
                'alreadyFollowing.0': { $exists: false } // Keep only if not already following
            } },

            // stage 8: Get user details
            { $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails'
            } },

            // stage 9: Unwind userDetails
            { $unwind: '$userDetails' },

            // stage 10: Get details of connecting users
            { $lookup: {
                from: 'users',
                localField: 'connectedThrough',
                foreignField: '_id',
                as: 'connectedUserDetails'
            } },

            // Sort by most common connections
            { $sort: { commonConnections: -1 } },

            // Limit results
            { $limit: limit },

            // Project final fields
            { $project: {
                _id: 0,
                userId: '$_id',
                username: '$userDetails.username',
                commonConnections: 1,
                connectedThrough: '$connectedUserDetails.username'
            } }
        ];

        const suggestions = await this.followModel.aggregate(pipeline).exec();
        return suggestions;
    }

    
}   

