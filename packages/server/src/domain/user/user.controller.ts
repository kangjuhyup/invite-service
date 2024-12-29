import { UserAccessGuard } from '@app/jwt/guard/user.access.guard';
import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { HttpResponse } from '../dto/response';
import { GetMyProfileResponse } from './dto/response/get.profile';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseValidationInterceptor } from '@app/interceptor/response.validation';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
      data: GetMyProfileResponse.of(
        await this.userService.getUser({ userId: user.id }),
      ),
    };
  }
}
