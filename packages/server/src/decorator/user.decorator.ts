import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/jwt/user';

/**
 * Request 객체에서 User 정보를 추출하는 데코레이터
 * @example
 * ```typescript
 * @Get()
 * async getMyProfile(@User() user: User) {
 *   // user 객체 사용
 * }
 * ```
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
