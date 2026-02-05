import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users.service';
import { UserType } from '../graphql/user.type';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { PreferencesInput } from '../dto/preferences.input';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UsersMapper } from '../users.mapper';

@Resolver(() => UserType)
export class UserResolver {
    constructor(
        private readonly usersService: UsersService,
        private readonly usersMapper: UsersMapper
    ) {}

    @Roles(Role.Admin)
    @Query(() => [UserType], { name: 'getusers' })
    async users(): Promise<UserType[]> {
        // Only admin can get all users
        const users = await this.usersService.findAll();
        return users.map(u => this.usersMapper.toUserType(u));
    }

    @Roles(Role.User, Role.Admin)
    @Query(() => UserType, { name: 'getuser' })
    async user(@CurrentUser() user): Promise<UserType | null> {
        // Use context for user id, only admin can query by id
        const foundUser = await this.usersService.findOne(user.id);
        return foundUser ? this.usersMapper.toUserType(foundUser) : null;
    }

    @Public()
    @Mutation(() => UserType, { name: 'createUser' })
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserType> {
        // Registration is public, input is safe
        const user = await this.usersService.create(createUserInput);
        return this.usersMapper.toUserType(user);
    }

    @Mutation(() => UserType, { name: 'updateUser' })
    async updateUser(@CurrentUser() user, @Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<UserType | null> {
        // Only allow update for current user
        const updatedUser = await this.usersService.update(updateUserInput, user.id);
        return updatedUser ? this.usersMapper.toUserType(updatedUser) : null;
    }

    @Mutation(() => UserType, { name: 'deleteUser' })
    async deleteUser(@CurrentUser() user): Promise<UserType | null> {
        // Use user context for id, do not accept id as input
        const deletedUser = await this.usersService.remove(user.id);
        return deletedUser ? this.usersMapper.toUserType(deletedUser) : null;
    }

    @Mutation(() => UserType, { name: 'updateUserPreferences' })
    async updateUserPreferences(
        @CurrentUser() user,
        @Args('preferences', { type: () => PreferencesInput }) preferences: PreferencesInput
    ): Promise<UserType | null> {
        // Only allow update for current user
        const updatedUser = await this.usersService.updatePreferences(user.id, preferences);
        return updatedUser ? this.usersMapper.toUserType(updatedUser) : null;
    }

}
