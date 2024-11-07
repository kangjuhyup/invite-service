import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(phone: string, pwd: string) {
    const { userId, password } = await this.userService.getUser({ phone });
    if (password !== pwd)
      throw new UnauthorizedException('잘못된 비밀번호 입니다.');
    const refresh = this._generateRefreshToken(userId);
    await this.userService.updateRefresh(userId, refresh);
    return {
      userId: userId,
      access: this._generateAccessToken(userId),
      refresh,
    };
  }

  async signUp(phone: string, pwd: string) {
    const user = await this.userService.saveUser(phone, pwd);
    const access = this._generateAccessToken(user.userId);
    const refresh = this._generateRefreshToken(user.userId);
    await this.userService.updateRefresh(user.userId, refresh);
    return { access, refresh };
  }

  async resign(userId: string) {
    const access = this._generateAccessToken(userId);
    const refresh = this._generateRefreshToken(userId);
    await this.userService.updateRefresh(userId, refresh);
    return { access, refresh };
  }

  private _generateRefreshToken(id: string) {
    const payload = { id };
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES'),
    });
  }

  private _generateAccessToken(id: string) {
    const payload = { id };
    return this.jwtService.sign(payload);
  }
}
