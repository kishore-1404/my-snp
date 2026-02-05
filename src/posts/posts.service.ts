import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostType } from './graphql/post.type';
import { UserType } from 'src/users/graphql/user.type';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>
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

}