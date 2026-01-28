import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel (User.name) private userModel: Model<User>
    ) {}

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }
    
    async update(updateUserDto: UpdateUserDto): Promise<User | null> {
        const { id, ...updateData } = updateUserDto;
        return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async remove(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id).exec();
    }

    async updatePreferences(id: string, preferences: any): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(
            id,
            { preferences },
            { new: true }
        ).exec();
    }
}
