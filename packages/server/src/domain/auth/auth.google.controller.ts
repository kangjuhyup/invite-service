import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { GoogleSignRequest, SignRequest } from './dto/sign';
import { AuthFacade } from './auth.facade';
import { Response } from 'express';

@Controller('auth/google')
export class AuthGoogleController {
  constructor(private readonly auth: AuthFacade) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect() {
    return {
      result: true,
    };
  }
}
