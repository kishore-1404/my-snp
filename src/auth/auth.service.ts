import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginInputDto } from './input/login.input';
import { access } from 'fs';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService) {}
    
    async validateUser(loginInput: LoginInputDto): Promise<any> {
        const user = await this.usersService.findOne(undefined, loginInput.username);
        if (user?.password !== loginInput.password) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        }
        

        // TODO : Implement proper hashing and salting for passwords and JWT
    }
}
