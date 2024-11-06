import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(phone: string, pwd: string) {
    const { userId, password } = await this.userService.getUser({ phone });
    if (password !== pwd)
      throw new UnauthorizedException('잘못된 비밀번호 입니다.');
    return {
      userId: userId,
      access: this._generateAccessToken(userId),
      refresh: this._generateRefreshToken(userId),
    };
  }

  async signUp(phone: string, pwd: string) {
    const user = await this.userService.saveUser(phone, pwd);
    return this._generateAccessToken(user.userId);
  }

  //TODO : Refresh 토큰 추가
  private _generateRefreshToken(id: string) {
    const payload = { id };
    return this.jwtService.sign(payload, {});
  }

  private _generateAccessToken(id: string) {
    const payload = { id };
    return this.jwtService.sign(payload);
  }
}
