import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
    
    async create(createPostDto: CreatePostDto): Promise<Post> {
        const createdPost = new this.postModel(createPostDto);
        return createdPost.save();
    }

    async update(updatePostDto: UpdatePostDto): Promise<Post | null> {
        const { id, ...updateData } = updatePostDto;
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