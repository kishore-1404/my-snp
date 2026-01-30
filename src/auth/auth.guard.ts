import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]); 
        if (isPublic) {
            return true;
        }
        const ctx = GqlExecutionContext.create(context);
        const req: Request & { user?: any } = ctx.getContext().req;

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('No authorization header found');
        }

        const [, token] = authHeader.split(' ');
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            req.user = decoded;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}