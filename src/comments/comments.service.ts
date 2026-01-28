import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>
    ) {}

    async findAll(): Promise<Comment[]> {
        return this.commentModel.find({ isDeleted: false }).exec();
    }

    async findOne(id: string): Promise<Comment | null> {
        return this.commentModel.findOne({ _id: id, isDeleted: false }).exec();
    }
    
    async create(createCommentDto: CreateCommentDto): Promise<Comment> {
        const createdComment = new this.commentModel(createCommentDto);
        return createdComment.save();
    }

    async update(updateCommentDto: UpdateCommentDto): Promise<Comment | null> {
        const { id, ...updateData } = updateCommentDto;
        return this.commentModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true }
        ).exec();
    }

    async remove(id: string): Promise<Comment | null> {
        return this.commentModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        ).exec();
    }
}
