import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isActivated = (await super.canActivate(context)) as boolean;
    if (!isActivated) {
      throw new UnauthorizedException('Invalid token');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('토큰 검증 실패');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
