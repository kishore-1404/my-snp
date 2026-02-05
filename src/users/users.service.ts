import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { hash } from 'bcrypt';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PreferencesInput } from './dto/preferences.input';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    /**
     * Maps GraphQL PreferencesInput to MongoDB-compatible preferences object.
     * @param preferences PreferencesInput
     */
    mapPreferences(preferences: { keys: string[]; values: boolean[] }): Record<string, boolean> {
        const preferencesObj: Record<string, boolean> = {};
        preferences.keys.forEach((key, idx) => {
            preferencesObj[key] = preferences.values[idx];
        });
        return preferencesObj;
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id?: string, username?: string): Promise<User | null> {
        if (username) {
            return this.userModel.findOne({ username }).exec();
        }
        return this.userModel.findById(id).exec();
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        const{
            password,
            preferences: PreferencesInput,
            ...rest
        }= createUserInput;
        // If preferences is in GraphQL format, map it
        let preferences: Record<string, boolean> = {};
        if (PreferencesInput && PreferencesInput.keys && PreferencesInput.values) {
            preferences = this.mapPreferences(PreferencesInput);
        }
        // Hash the password before saving for security
        const hashedPassword = await hash(password, 10);

        // Create a new user instance with mapped preferences and hashed password
        const createdUser = new this.userModel({
            ...rest,
            preferences,
            password: hashedPassword,
        });
        // Save the user to the database
        return createdUser.save();
    }
    

    async update(updateUserInput: UpdateUserInput, id: string): Promise<User | null> {
        const { password, preferences, ...rest } = updateUserInput;
        const updateData: any = { ...rest };

        // Handle preferences explicitly
        if (preferences !== undefined) {
            // If preferences is in GraphQL format, map it
            if ((preferences as any).keys && (preferences as any).values) {
                updateData.preferences = this.mapPreferences(preferences as any);
            } else {
                updateData.preferences = preferences;
            }
        }
        // Handle password explicitly
        if (password) {
            updateData.password = await hash(password, 10);
        }

        return this.userModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).exec();
    }

    async remove(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id).exec();
    }

    async updatePreferences(
        id: string,
        preferences: PreferencesInput | Record<string, boolean>
    ): Promise<User | null> {
        let preferencesObj = preferences;
        // If preferences is in GraphQL format, map it
        if (
            preferences &&
            (preferences as PreferencesInput).keys &&
            (preferences as PreferencesInput).values
        ) {
            preferencesObj = this.mapPreferences(preferences as PreferencesInput);
        }
        return this.userModel.findByIdAndUpdate(
            id,
            { preferences: preferencesObj },
            { new: true }
        ).exec();
    }
}
