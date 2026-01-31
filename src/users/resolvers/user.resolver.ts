import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users.service';
import { User } from '../schemas/user.schema';
import { CreateUserInput } from '../input/create-user.input';
import { UpdateUserInput } from '../input/update-user.input';
import { PreferencesInput } from '../input/preferences.input';

import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/roles.enum';

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly usersService: UsersService) {}
    
    // @Public()
    @Roles(Role.Admin)
    @Query(() => [User], { name: 'getusers' })
    async users(): Promise<User[]> {
        return this.usersService.findAll();
    }

    // @Public()
    @Roles(Role.User, Role.Admin)
    @Query(() => User, { name: 'getuser' })
    async user(@Args('id') id: string): Promise<User | null> {
        return this.usersService.findOne(id);
    }

    // @Public()
    @Roles(Role.User, Role.Admin)               
    @Mutation(() => User, { name: 'createUser' })
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
        const { preferences, ...userData } = createUserInput;
        let preferencesObj: Record<string, boolean> | undefined;

        if (preferences) {
            preferencesObj = this.mapPreferences(preferences);
        }

        const dto: CreateUserDto = {
            ...userData,
            preferences: preferencesObj,
        };
        return this.usersService.create(dto);
    }

    private mapPreferences(preferences: PreferencesInput): Record<string, boolean> {
        const preferencesObj: Record<string, boolean> = {};
        preferences.keys.forEach((key, idx) => {
            preferencesObj[key] = preferences.values[idx];
        });
        return preferencesObj;
    }

    @Mutation(() => User, { name: 'updateUser' })
    async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<User | null> {
        const { preferences, ...userData } = updateUserInput;
        let preferencesObj: Record<string, boolean> | undefined;

        if (preferences) {
            preferencesObj = this.mapPreferences(preferences);
        }

        const updateUserDto: UpdateUserDto = {
            ...userData,
            preferences: preferencesObj,
        };
        return this.usersService.update(updateUserDto);
    }
    
    @Mutation(() => User, { name: 'deleteUser' })
    async deleteUser(@Args('id') id: string): Promise<User | null> {
        return this.usersService.remove(id);
    }

    @Mutation(() => User, { name: 'updateUserPreferences' })
    async updateUserPreferences(
        @Args('id') id: string,
        @Args('preferences', { type: () => PreferencesInput }) preferences: PreferencesInput
    ): Promise<User | null> {
        // Convert PreferencesInput to a Map<string, boolean>
        const preferencesMap = this.mapPreferences(preferences);
        return this.usersService.updatePreferences(id, preferencesMap);
    }
}
