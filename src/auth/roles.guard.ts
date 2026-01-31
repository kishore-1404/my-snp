import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/roles.enum';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req || {};
        const authHeader = req.headers?.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('No authorization header found');
        }
        const [, token] = authHeader.split(' ');
        let user;
        try {
            user = this.jwtService.verify(token);
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
        if (!user || !user.roles) {
            throw new UnauthorizedException('User roles not found');
        }

        const hasRole = user.roles.some((role: Role) => requiredRoles.includes(role));
        if (!hasRole) {
            throw new UnauthorizedException('Insufficient role');
        }
        return true;
    }
}