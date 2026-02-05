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
    
    async create(createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
        const createdComment = new this.commentModel({ ...createCommentDto, author: authorId });
        return createdComment.save();
    }

    async update(updateCommentDto: UpdateCommentDto, authorId: string): Promise<Comment | null> {
        const { id, ...updateData } = updateCommentDto;
        // Find the comment first
        const existing = await this.commentModel.findOne({ _id: id, isDeleted: false }).exec();
        if (!existing) return null;
        // Check author
        if (existing.author.toString() !== authorId) {
            return null;
        }
        // Ensure author field is set in update (optional, but for consistency)
        // updateData.author = authorId;
        return this.commentModel.findOneAndUpdate(
            { _id: id, isDeleted: false, author: authorId },
            updateData,

            { new: true }
        ).exec();
    }

    async remove(id: string, authorId: string): Promise<Comment | null> {
        let deletedComment = await this.commentModel.findOne({ _id: id, isDeleted: false, author: authorId }).exec();
        if (!deletedComment || deletedComment.author.toString() !== authorId) {
            return null; // Not found or not the author
        }
        return this.commentModel.findOneAndUpdate(
            { _id: id, isDeleted: false, author: authorId },
            { isDeleted: true },
            { new: true }
        ).exec();
    }
}

