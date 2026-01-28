import { PreferencesInput } from '../dto/preferences.input';

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users.service';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly usersService: UsersService) {}
    
    @Query(() => [User], { name: 'getusers' })
    async users(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Query(() => User, { name: 'getuser' })
    async user(@Args('id') id: string): Promise<User | null> {
        return this.usersService.findOne(id);
    }

    @Mutation(() => User, { name: 'createuser' })
    async createUser(@Args('createUserDto') createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @Mutation(() => User, { name: 'updateuser' })
    async updateUser(@Args('updateUserDto') updateUserDto: UpdateUserDto): Promise<User | null> {
        return this.usersService.update(updateUserDto);
    }
    
    @Mutation(() => User, { name: 'deleteuser' })
    async deleteUser(@Args('id') id: string): Promise<User | null> {
        return this.usersService.remove(id);
    }

    @Mutation(() => User, { name: 'updateuserpreferences' })
    async updateUserPreferences(
        @Args('id') id: string,
        @Args('preferences', { type: () => PreferencesInput }) preferences: PreferencesInput
    ): Promise<User | null> {
        // Convert PreferencesInput to a Map<string, boolean>
        const preferencesMap = new Map<string, boolean>();
        preferences.keys.forEach((key, idx) => {
            preferencesMap.set(key, preferences.values[idx]);
        });
        return this.usersService.updatePreferences(id, preferencesMap);
    }
}
