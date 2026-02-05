import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostType } from './graphql/post.type';
import { UserType } from '../users/graphql/user.type';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>
    ) {}

    async findAll(): Promise<PostType[]> {
        const posts = await this.postModel.find({ isDeleted: false }).exec();
        return posts.map(this.toPostType);
    }

    async findOne(id: string): Promise<PostType | null> {
        const post = await this.postModel.findOne({ _id: id, isDeleted: false }).exec();
        return post ? this.toPostType(post) : null;
    }

    async create(createPostDto: CreatePostDto, authorId): Promise<PostType> {
        // Set author from context user
        const data = {
            ...createPostDto,
            author: new Types.ObjectId(authorId),
        };
        const createdPost = new this.postModel(data);
        const saved = await createdPost.save();
        return this.toPostType(saved);
    }

    async update(updatePostDto: UpdatePostDto, authorId: string ): Promise<PostType | null> {
        const { id, ...updateData } = updatePostDto;
        // Find the post first
        const existing = await this.postModel.findOne({ _id: id, isDeleted: false }).exec();
        if (!existing) return null;
        // Check author
        if (existing.author.toString() !== authorId) {
            // Optionally throw ForbiddenException here for stricter handling
            return null;
        }
        const post = await this.postModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true }
        ).exec();
        return post ? this.toPostType(post) : null;
    }

    async remove(id: string): Promise<PostType | null> {
        const post = await this.postModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        ).exec();
        return post ? this.toPostType(post) : null;
    }

    // Helper to map Post (Mongoose) to PostType (GraphQL)
    toPostType(post: Post): PostType {
        return {
            id: post._id.toString(),
            content: post.content,
            author: post.author as any, // Should be populated in advanced use
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            isDeleted: post.isDeleted,
        };
    }
}