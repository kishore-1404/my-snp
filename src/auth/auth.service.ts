import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginInputDto } from './input/login.input';
import { compare } from 'bcrypt';


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
        const payload = { username: user.username, sub: user.id };
        // const access_token = await this.jwtService.signAsync(payload);
        return { 
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}
