import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// src/common/decorators/current-user.decorator.ts

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    // Fix: Handle both REST and GraphQL
    const req = context.getType() === 'http'
      ? context.switchToHttp().getRequest()
      : GqlExecutionContext.create(context).getContext().req;

    const user = req.user;
    
    // Ensure the ID is available as 'id' or '_id' regardless of JWT field name
    if (user && user.sub && !user._id) {
        user._id = user.sub; 
    }
    
    return user;
  },
);