import { UserAccessGuard } from '@app/jwt/guard/user.access.guard';
import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpResponse } from '../dto/response';
import { GetMyProfileResponse } from './dto/response/get.profile';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseValidationInterceptor } from '@app/interceptor/response.validation';
import { UpdateProfileRequest } from './dto/request/update.profile';
import { UserFacade } from './user.facade';
import { GetUser } from '@app/decorator/user.decorator';
import { User } from '@app/jwt/user';
import { UpsertUserProfileImage } from '../../database/repository/param/user';

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
    @GetUser() user: User,
  ): Promise<HttpResponse<GetMyProfileResponse>> {
    return {
      result: true,
      data: await this.userFacade.getMyProfile(user),
    };
  }

  @Patch()
  @UseGuards(UserAccessGuard)
  async updateProfile(
    @Body() dto: UpdateProfileRequest,
    @GetUser() user: User,
  ) {
    return {
      result: true,
      data: await this.userFacade.updateProfile(dto, user),
    };
  }

  @Get('profile-image/prepare-add')
  @UseGuards(UserAccessGuard)
  async prepareAddUser(@GetUser() user: User) {
    return {
      result: true,
      data: await this.userFacade.getProfilePresignedUrl(user),
    };
  }

  @Put('profile-image')
  @UseGuards(UserAccessGuard)
  async updateProfileImage(@GetUser() user: User) {
    return {
      result: true,
      data: await this.userFacade.validateProfileImage(user),
    };
  }
}
