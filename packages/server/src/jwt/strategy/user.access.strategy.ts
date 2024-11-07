import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@app/domain/user/user.service';
import { User } from '../user';

@Injectable()
export class UserAccessStrategy extends PassportStrategy(Strategy,'user-access') {
  constructor(
    private userService: UserService,
    private secret: string,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: User): Promise<any> {
    const user = await this.userService.getUser({ userId: payload.id });
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.userId,
    };
  }
}
