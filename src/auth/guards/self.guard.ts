
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SelfGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const req = ctx.getContext().req || {};
		let user = req.user;

		// If user is not set, try to extract from JWT
		if (!user || !user.id) {
			const headers = req.headers || {};
			const authHeader = headers.authorization || headers.Authorization;
			if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
				throw new UnauthorizedException('No authorization header found');
			}
			const [, token] = authHeader.split(' ');
			try {
				user = this.jwtService.verify(token);
			} catch (err) {
				throw new UnauthorizedException('Invalid or expired token');
			}
		}

		if (!user || !user.id) {
			throw new UnauthorizedException('User not authenticated');
		}

		// Generalized: look for id or username in args or nested input
		const args = ctx.getArgs();
		let inputId = args.id || args.userId || args.username;
		// Check nested input objects for id/username
		if (!inputId) {
			for (const value of Object.values(args)) {
				if (value && typeof value === 'object') {
					if ('id' in value) inputId = value.id;
					else if ('userId' in value) inputId = value.userId;
					else if ('username' in value) inputId = value.username;
				}
				if (inputId) break;
			}
		}
		if (!inputId) {
			throw new UnauthorizedException('No user id or username provided in request');
		}

		// Allow by id or username
		const userIds = [user.id, user._id, user.username];
		if (!userIds.includes(inputId)) {
			throw new UnauthorizedException('You can only modify your own account');
		}
		return true;
	}
}
