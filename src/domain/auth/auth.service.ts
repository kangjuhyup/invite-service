import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(phone: string, pwd: string) {
    const user = await this.userService.getUser(phone);
    if (user.password !== pwd)
      throw new UnauthorizedException('잘못된 비밀번호 입니다.');
    return this._generateAccessToken(user.userId);
  }

  async signUp(phone: string, pwd: string) {
    const user = await this.userService.saveUser(phone, pwd);
    return this._generateAccessToken(user.userId);
  }

  private _generateAccessToken(id: string) {
    const payload = { id };
    return {
      access: this.jwtService.sign(payload),
    };
  }
}
