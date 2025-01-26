import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpResponse } from '../dto/response';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetLetterPageRequest } from './dto/request/get.page';
import { GetLetterPageResponse } from './dto/response/get.page';
import { PrepareResponse } from './dto/response/prepare';
import { PrepareRequest } from './dto/request/prepare';
import { AddLetterRequest } from './dto/request/add.letter';
import { AddLetterResponse } from './dto/response/add.letter';
import { GetLetterDetailRequest } from './dto/request/get.detail';
import { GetLetterDetailResponse } from './dto/response/get.detail';
import { ResponseValidationInterceptor } from '@app/interceptor/response.validation';
import { UserAccessGuard } from '@app/jwt/guard/user.access.guard';
import { GetLetterResponse } from './dto/response/get.letter';
import { LetterFacade } from './letter.facade';
import { UserPublicGuard } from '@app/jwt/guard/user.public.guard';
import { GetUser } from '@app/decorator/user.decorator';
import { User } from '@app/jwt/user';
import { ModifyLetterRequest } from './dto/request/modify.letter';

@Controller('letter')
export class LetterController {
  constructor(private readonly letterFacade: LetterFacade) {}

  @ApiOperation({ summary: '내 초대장 페이지 조회' })
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: GetLetterPageResponse,
  })
  @ApiBearerAuth()
  @Get()
  @UseGuards(UserAccessGuard)
  @UseInterceptors(new ResponseValidationInterceptor(GetLetterPageResponse))
  async getLetters(
    @Query() dto: GetLetterPageRequest,
    @GetUser() user: User,
  ): Promise<HttpResponse<GetLetterPageResponse>> {
    return {
      result: true,
      data: await this.letterFacade.getLetters(dto, user),
    };
  }

  @ApiOperation({
    summary: '초대장 업로드 url 조회',
    description:
      '반환된 URL을 통해 업로드할 때 헤더를 첨부해야 한다.\n필수:[x-amx-session:세션키,x-amx-width:파일의 가로크기,x-amx-height:파일의 세로크기]\n선택(Component 업로드 시):[x-amx-x:파일의 x 좌표,x-amx-y:파일의 y 좌표,x-amx-z:파일의 인덱스,x-amx-angle:파일의 기울기]',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: PrepareResponse,
  })
  @Post('prepare-add')
  @UseGuards(UserAccessGuard)
  @UseInterceptors(new ResponseValidationInterceptor(PrepareResponse))
  async prepareAddLetter(
    @Body() dto: PrepareRequest,
    @GetUser() user: User,
  ): Promise<HttpResponse<PrepareResponse>> {
    return {
      result: true,
      data: await this.letterFacade.prepareAddLetter(dto, user),
    };
  }

  @ApiOperation({ summary: '초대장 업로드' })
  @ApiOkResponse({
    status: 201,
    description: '성공',
    type: AddLetterResponse,
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(UserAccessGuard)
  @UseInterceptors(new ResponseValidationInterceptor(AddLetterResponse))
  async addLetter(
    @Body() dto: AddLetterRequest,
    @GetUser() user: User,
  ): Promise<HttpResponse<AddLetterResponse>> {
    return {
      result: true,
      data: await this.letterFacade.addLetter(dto, user),
    };
  }

  @ApiOperation({ summary: '초대장 수정 전 처리' })
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: PrepareResponse,
  })
  @ApiBearerAuth()
  @Post('prepare-modify/:id')
  @UseGuards(UserAccessGuard)
  @UseInterceptors(new ResponseValidationInterceptor(PrepareResponse))
  async prepareModifyLetter(
    @Param('id') id: string,
    @Body() dto: PrepareRequest,
    @GetUser() user: User,
  ): Promise<HttpResponse<PrepareResponse>> {
    return {
      result: true,
      data: await this.letterFacade.prepareModifyLetter(Number(id), dto, user),
    };
  }

  @ApiOperation({ summary: '초대장 수정' })
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: AddLetterResponse,
  })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(UserAccessGuard)
  async modifyLetter(
    @Param() dto: GetLetterDetailRequest,
    @Body() body: ModifyLetterRequest,
    @GetUser() user: User,
  ): Promise<HttpResponse<AddLetterResponse>> {
    return {
      result: true,
      data: await this.letterFacade.modifyLetter(dto.id, body, user),
    };
  }

  @Post('password/:id')
  @ApiOperation({ summary: '초대장 패스워드 생성' })
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: 'string',
  })
  @ApiBearerAuth()
  @UseGuards(UserAccessGuard)
  async generateLetterPassword(
    @Param() dto: GetLetterDetailRequest,
    @Request() req,
  ): Promise<HttpResponse<string>> {
    return {
      result: true,
      data: await this.letterFacade.generateLetterPassword(dto.id, req.user),
    };
  }

  @Get('detail/:id')
  @ApiOperation({ summary: '초대장 상세 정보 조회' })
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: GetLetterDetailResponse,
  })
  @UseInterceptors(new ResponseValidationInterceptor(GetLetterDetailResponse))
  async getLetterDetail(
    @Param() dto: GetLetterDetailRequest,
  ): Promise<HttpResponse<GetLetterDetailResponse>> {
    return {
      result: true,
      data: await this.letterFacade.getLetterDetail(dto.id),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '공유된 초대장 페이지' })
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: GetLetterResponse,
  })
  @UseGuards(UserPublicGuard)
  @UseInterceptors(new ResponseValidationInterceptor(GetLetterResponse))
  async getLetter(
    @Param() dto: GetLetterDetailRequest,
    @Query('token') token: string,
    @Request() req,
  ): Promise<HttpResponse<GetLetterResponse>> {
    return {
      result: true,
      data: await this.letterFacade.getLetter(dto.id, token, req.user),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '초대장 삭제' })
  @ApiBearerAuth()
  @UseGuards(UserAccessGuard)
  async deleteLetter(@Param() dto: GetLetterDetailRequest, @Request() req) {
    await this.letterFacade.deleteLetter(dto.id, req.user);
    return {
      result: true,
    };
  }
}
