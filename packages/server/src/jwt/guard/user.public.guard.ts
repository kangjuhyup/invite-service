import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class UserPublicGuard extends AuthGuard('user-access') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    // 토큰이 없는 경우 user를 비워두고 통과
    if (!token) {
      request['user'] = undefined;
      return true;
    }

    try {
      // 토큰이 있는 경우 검증
      const isActivated = (await super.canActivate(context)) as boolean;
      if (!isActivated) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }
      return true;
    } catch (error) {
      // 토큰 검증 실패 시 user를 비워두고 통과
      request['user'] = undefined;
      return true;
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}