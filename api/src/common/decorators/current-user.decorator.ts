import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../types/tokens.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
