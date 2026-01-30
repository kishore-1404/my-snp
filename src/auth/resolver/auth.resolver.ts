import { Resolver,Mutation,Args } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { LoginInputDto } from '../input/login.input';
import { UseGuards } from '@nestjs/common';
import { Query, Context } from '@nestjs/graphql';
import { AuthGuard } from '../auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
// import { Context } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Mutation(() => String)
    async login(@Args('loginInput') loginInput: LoginInputDto): Promise<string> {
        const result = await this.authService.validateUser(loginInput);
        return result.access_token;
    }

    @UseGuards(AuthGuard)
    @Query(() => String)
    getProfile(@Context() context): string {
        const user = context.req.user;
        return `Hello, ${user.username}! This is your profile.`;
    }
}
