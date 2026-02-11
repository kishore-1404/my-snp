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

    
    // src/auth/guards/auth.guard.ts

async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
    ]);
    if (isPublic) return true;

    // Fix: Handle both REST (HTTP) and GraphQL contexts
    const req = context.getType() === 'http' 
        ? context.switchToHttp().getRequest() 
        : GqlExecutionContext.create(context).getContext().req;

    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No authorization header found');

    const [, token] = authHeader.split(' ');
    try {
        const decoded = await this.jwtService.verifyAsync(token);
        req.user = decoded; // Attaches the JWT payload to the request
        return true;
    } catch (err) {
        throw new UnauthorizedException('Invalid or expired token');
    }
}
}