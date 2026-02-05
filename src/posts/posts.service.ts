import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FollowsService } from 'src/follows/follows.service';
@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        private readonly followsService: FollowsService
    ) {}

    async findAll(): Promise<Post[]> {
        return this.postModel.find({ isDeleted: false }).exec();
    }

    async findOne(id: string): Promise<Post | null> {
        return this.postModel.findOne({ _id: id, isDeleted: false }).exec();
    }

    async create(createPostDto: CreatePostDto, authorId): Promise<Post> {
        // Set author from context user
        const data = {
            ...createPostDto,
            author: new Types.ObjectId(authorId),
        };
        const createdPost = new this.postModel(data);
        return createdPost.save();
    }

    async update(updatePostDto: UpdatePostDto, authorId: string ): Promise<Post | null> {
        const { id, ...updateData } = updatePostDto;
        // Find the post first
        const existing = await this.postModel.findOne({ _id: id, isDeleted: false }).exec();
        if (!existing) return null;
        // Check author
        if (existing.author.toString() !== authorId) {
            // Optionally throw ForbiddenException here for stricter handling
            return null;
        }
        return this.postModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true }
        ).exec();
    }

    async remove(id: string): Promise<Post | null> {
        return this.postModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        ).exec();
    }

    // Get feed of Posts from followed users
    async getFeed(userId: string, page: number = 1, limit: number = 20): Promise<{posts: Post[],total: number,hasMore: boolean}> {
        const followingIds = await this.followsService.getFollowingIds(userId);

        // Include user's posts
        const authorIds = [...followingIds.map(id => new Types.ObjectId(id)), new Types.ObjectId(userId)];
        const skip = (page - 1) * limit;

        const pipeline: PipelineStage[] = [
            // Match Posts from followed users(not deleted)
            {
                $match: {
                    author: { $in: authorIds },
                    isDeleted: false,
                },
            },
            // Sort by recent posts
            { $sort: { createdAt: -1 } },

            //Lookup to get author details
            {
                $lookup: {
                    from: 'users', // Name of the users collection
                    localField: 'author', // Field in posts collection
                    foreignField: '_id', // Field in users collection
                    as: 'authorDetails' // Output array field
                }
            },
            { $unwind: '$authorDetails' }, // Unwind to get single author object
            //Lookup reactions count
            {
                $lookup: {
                    from: 'reactions', // Name of the reactions collection
                    localField: '_id', // Field in posts collection
                    foreignField: 'post', // Field in reactions collection
                    as: 'reactions' // Output array field
                }
            },

            // Lookup comments count
            {
                $lookup: {
                    from: 'comments', // Name of the comments collection
                    let: { postId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $and: [ { $eq: ['$post', '$$postId'] }, { $eq: ['$isDeleted', false] } ] } } },
                    ],
                    as: 'comments' // Output array field
                }
            },

            // Add computed fields
            {
                $addFields: {
                    reactionCount: { $size: '$reactions' },
                    commentCount: { $size: '$comments' },
                }
             },

            // Project only needed fields
            {
                $project: {
                    _id: 1,
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    author: '$authorDetails._id',
                    authorUsername: '$authorDetails.username',
                    reactionCount: 1,
                    commentCount: 1,

                }
            },

            // Facet for pagination
            {
                $facet: {
                    metadata: [ { $count: "total" } ],
                    data: [ { $skip: skip }, { $limit: limit } ]
                }
            }
        ];

        const result = await this.postModel.aggregate(pipeline).exec();
        const posts = result[0].data;
        const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
        return {
            posts,
            total,
            hasMore: skip + limit < total
        };
    }
}   