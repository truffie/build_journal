import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../types/jwt-payload.type';

export const CurrentUser = createParamDecorator(
  (
    property: keyof JwtPayload | undefined,
    context: ExecutionContext,
  ): JwtPayload | JwtPayload[keyof JwtPayload] => {
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = request.user;
    if (property) {
      return user[property];
    }
    return user;
  },
);
