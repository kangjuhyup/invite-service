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
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { UserGuard } from '@app/jwt/guard/user.access.guard';
import { AuthFacade } from './auth.facade';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthFacade) {}

  @ApiOperation({
    summary: '회원가입',
  })
  @Post('signup')
  async signUp(
    @Body() dto: SignRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.auth.signUp(dto.phone, dto.password);
    res.cookie('accessToken',data.access, {
      httpOnly : true
    })
    res.cookie('refreshToken', data.refresh ,{ httpOnly : true})
    return {
      result: true,
      data
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
    const data = await this.auth.signIn(dto.phone, dto.password);
    res.cookie('accessToken',data.access, {
      httpOnly : true
    })
    res.cookie('refreshToken', data.refresh ,{ httpOnly : true})
    return {
      result: true,
      data
    };
  }

  @ApiOperation({
    summary : '로그인 연장'
  })
  @UseGuards()
  @Post('resign')
  async resign(
    @Req() req,
    @Res({passthrough : true}) res: Response
  ) {
    const data = await this.auth.resign(req.refreshToken)
    res.cookie('accessToken',data.access, {
      httpOnly : true
    })
    res.cookie('refreshToken', data.refresh ,{ httpOnly : true})
    return {
      result : true,
      data
    }
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
