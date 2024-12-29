import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignRequest } from './dto/sign';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { UserAccessGuard } from '@app/jwt/guard/user.access.guard';
import { AuthFacade } from './auth.facade';
import { UserRefreshGuard } from '@app/jwt/guard/user.refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthFacade) {}

  @Get('signup/:phone')
  async prepareSignup(@Param('phone') phone: string) {
    return {
      result: true,
      data: await this.auth.prepareSignUp(phone),
    };
  }

  @ApiOperation({
    summary: '회원가입',
  })
  @Post('signup')
  async signUp(
    @Body() dto: SignRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.auth.signUp(dto.email, dto.password);
    res.cookie('accessToken', data.access, {
      httpOnly: true,
    });
    res.cookie('refreshToken', data.refresh, { httpOnly: true });
    return {
      result: true,
      data,
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
    const data = await this.auth.signIn(dto.email, dto.password);
    res.cookie('accessToken', data.access, {
      httpOnly: true,
    });
    res.cookie('refreshToken', data.refresh, { httpOnly: true });
    return {
      result: true,
      data,
    };
  }

  @ApiOperation({
    summary: '구글 이메일 로그인',
    description: '기존 회원이 아닐 경우 회원 가입 처리',
  })
  @Post('signin/google')
  @UseGuards()
  async signInWithGoogle(
    @Body() body: { code: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.auth.signInWithGoogle(body.code);
    res.cookie('accessToken', data.access, {
      httpOnly: true,
    });
    res.cookie('refreshToken', data.refresh, { httpOnly: true });
    return {
      result: true,
      data,
    };
  }

  @ApiOperation({
    summary: '로그인 연장',
  })
  @UseGuards(UserRefreshGuard)
  @Post('resign')
  async resign(@Req() req, @Res({ passthrough: true }) res: Response) {
    const data = await this.auth.resign(req.refreshToken);
    res.cookie('accessToken', data.access, {
      httpOnly: true,
    });
    res.cookie('refreshToken', data.refresh, { httpOnly: true });
    return {
      result: true,
      data,
    };
  }

  @ApiOperation({
    summary: '로그아웃',
  })
  @Post('signout')
  @UseGuards(UserAccessGuard)
  async signOut(@Req() req) {
    return {
      result: true,
    };
  }

  @ApiOperation({
    summary: '회원탈퇴',
  })
  @Delete('account')
  @UseGuards(UserAccessGuard)
  async deleteAccount(@Body() dto: SignRequest) {
    return {
      result: true,
    };
  }
}
