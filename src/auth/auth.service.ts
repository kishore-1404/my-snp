import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginInputDto } from './input/login.input';
import { compare } from 'bcrypt';

import { GqlExecutionContext } from '@nestjs/graphql';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService) {}
    
    async validateUser(loginInput: LoginInputDto): Promise<{ access_token: string }> {
        const user = await this.usersService.findOne(undefined, loginInput.username);
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }
        // Validate using hashed password
        const isPasswordValid = await compare(loginInput.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user._id.toString() };
        // const access_token = await this.jwtService.signAsync(payload);
        return { 
            access_token: await this.jwtService.signAsync(payload),
        }
    }

    // Get user from context
    async getUser(context: ExecutionContext): Promise<{id: string, username: string}> {
        const ctx = GqlExecutionContext.create(context);
        const req: Request & { user?: any } = ctx.getContext().req;

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('No authorization header found');
        }

        const [, token] = authHeader.split(' ');
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            return { id: decoded.sub, username: decoded.username };
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }   
}
