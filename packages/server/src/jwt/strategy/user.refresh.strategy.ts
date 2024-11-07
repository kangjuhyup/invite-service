import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@app/domain/user/user.service';
import { User } from '../user';
import { Request } from 'express';
@Injectable()
export class UserRefreshStrategy extends PassportStrategy(
  Strategy,
  'user-refresh',
) {
  constructor(
    private userService: UserService,
    private secret: string,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookes?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(req: Request, payload: User): Promise<any> {
    const refreshToken = req.cookies['refreshToken'];
    const user = await this.userService.validateRefresh(
      payload.id,
      refreshToken,
    );

    return {
      id: user.userId,
    };
  }
}
