import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction } from './schemas/reaction.schema';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';

@Injectable()
export class ReactionsService {
    constructor(
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>
    ) {}

    async findAll(): Promise<Reaction[]> {
        return this.reactionModel.find({}).exec();
    }

    async findOne(id: string): Promise<Reaction | null> {
        return this.reactionModel.findOne({ _id: id,}).exec();
    }
    
    async create(createReactionDto: CreateReactionDto): Promise<Reaction> {
        const createdReaction = new this.reactionModel(createReactionDto);
        return createdReaction.save();
    }

    async update(updateReactionDto: UpdateReactionDto): Promise<Reaction | null> {
        const { id, ...updateData } = updateReactionDto;
        return this.reactionModel.findOneAndUpdate(
            { _id: id},
            updateData,
            { new: true }
        ).exec();
    }
}