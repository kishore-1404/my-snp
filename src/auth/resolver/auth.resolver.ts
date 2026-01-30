import { Resolver,Mutation,Args } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { LoginInputDto } from '../input/login.input';
import { UseGuards } from '@nestjs/common';
import { Query, Context } from '@nestjs/graphql';
import { AuthGuard } from '../auth.guard';
// import { Context } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => String)
    async login(@Args('loginInput') loginInput: LoginInputDto): Promise<string> {
        const { username, password } = loginInput;
        return this.authService.validateUser(loginInput);
    }

    @UseGuards(AuthGuard)
    @Query(() => String)
    getProfile(@Context() context): string {
        const user = context.req.user;
        return `Hello, ${user.username}! This is your profile.`;
    }
}
