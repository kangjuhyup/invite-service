import {
  Body,
  Controller,
  Get,
  Param,
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
import { LetterService } from './service/letter.service';
import { PrepareResponse } from './dto/response/prepare';
import { PrepareRequest } from './dto/request/prepare';
import { AddLetterRequest } from './dto/request/add.letter';
import { AddLetterResponse } from './dto/response/add.letter';
import { GetLetterDetailRequest } from './dto/request/get.detail';
import { GetLetterDetailResponse } from './dto/response/get.detail';
import { ResponseValidationInterceptor } from '@app/interceptor/response.validation';
import { UserAccessGuard } from '@app/jwt/guard/user.access.guard';
import { GetLetterResponse } from './dto/response/get.letter';

@Controller('letter')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

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
    @Request() req,
  ): Promise<HttpResponse<GetLetterPageResponse>> {
    return {
      result: true,
      data: await this.letterService.getLetters(dto, req.user),
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
    @Request() req,
  ): Promise<HttpResponse<PrepareResponse>> {
    return {
      result: true,
      data: await this.letterService.prepareAddLetter(dto, req.user),
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
    @Request() req,
  ): Promise<HttpResponse<AddLetterResponse>> {
    return {
      result: true,
      data: await this.letterService.addLetter(dto, req.user),
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
      data: await this.letterService.getLetterDetail(dto.id),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '공유된 초대장 페이지' })
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: GetLetterPageResponse,
  })
  @UseInterceptors(new ResponseValidationInterceptor(GetLetterResponse))
  async getLetter(
    @Param() dto: GetLetterDetailRequest,
  ): Promise<HttpResponse<GetLetterResponse>> {
    return {
      result: true,
      data: await this.letterService.getLetter(dto.id),
    };
  }
}
