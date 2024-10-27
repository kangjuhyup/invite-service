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
import { UserGuard } from '@app/jwt/guard/user.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('signout')
  @UseGuards(UserGuard)
  async signOut(@Req() req) {
    return {
      result: true,
    };
  }

  @Delete('account')
  @UseGuards(UserGuard)
  async deleteAccount(@Body() dto: SignRequest) {
    return {
      result: true,
    };
  }
}
