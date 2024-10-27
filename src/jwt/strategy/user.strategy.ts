import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@app/domain/user/user.service';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy) {
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

  async validate(phone: string, password: string): Promise<any> {
    const user = await this.userService.getUser(phone);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.userId,
      nick_name: user.nickName,
    };
  }
}
