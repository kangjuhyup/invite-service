import { UserAccessGuard } from '@app/jwt/guard/user.access.guard';
import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpResponse } from '../dto/response';
import { GetMyProfileResponse } from './dto/response/get.profile';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseValidationInterceptor } from '@app/interceptor/response.validation';
import { UpdateProfileRequest } from './dto/request/update.profile';
import { UserFacade } from './user.facade';

@Controller('user')
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @ApiOperation({ summary: '회원 정보 조회' })
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: GetMyProfileResponse,
  })
  @ApiBearerAuth()
  @UseGuards(UserAccessGuard)
  @UseInterceptors(new ResponseValidationInterceptor(GetMyProfileResponse))
  @Get()
  async getMyProfile(
    @Req() request: Request,
  ): Promise<HttpResponse<GetMyProfileResponse>> {
    const user = request.user as { id: string };
    return {
      result: true,
      data: await this.userFacade.getMyProfile(user),
    };
  }

  @Patch('profile')
  @UseGuards(UserAccessGuard)
  async updateProfile(
    @Body() dto: UpdateProfileRequest,
    @Req() req: Record<string, any>,
  ) {
    return {
      result: true,
      data: await this.userFacade.updateProfile(dto, req.user),
    };
  }

  @Get('profile-image/prepare-add')
  @UseGuards(UserAccessGuard)
  async prepareAddUser() {
    return {
      result: true,
    };
  }

  @Put('profile-image')
  @UseGuards(UserAccessGuard)
  async updateProfileImage() {
    return {
      result: true,
    };
  }
}
