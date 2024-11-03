import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignRequest } from './dto/sign';
import { AuthService } from './auth.service';
import { UserGuard } from 'packages/server/src/jwt/guard/user.guard';
import { Response } from 'express';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '회원가입',
  })
  @Post('signup')
  async signUp(
    @Body() dto: SignRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signUp(dto.phone, dto.password);
    res.setHeader('Authorization', `Bearer ${data.access}`);
    return {
      result: true,
    };
  }

  @ApiOperation({
    summary: '로그인',
  })
  @Post('signin')
  async signIn(
    @Body() dto: SignRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signIn(dto.phone, dto.password);
    res.setHeader('Authorization', `Bearer ${data.access}`);
    return {
      result: true,
    };
  }

  @ApiOperation({
    summary: '로그아웃',
  })
  @Post('signout')
  @UseGuards(UserGuard)
  async signOut(@Req() req) {
    return {
      result: true,
    };
  }

  @ApiOperation({
    summary: '회원탈퇴',
  })
  @Delete('account')
  @UseGuards(UserGuard)
  async deleteAccount(@Body() dto: SignRequest) {
    return {
      result: true,
    };
  }
}
