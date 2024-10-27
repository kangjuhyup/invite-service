import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { HttpResponse } from '../dto/response';
import { ResponseValidationInterceptor } from 'src/interceptor/response.validation';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetLetterPageRequest } from './dto/request/get.page';
import { GetLetterPageResponse } from './dto/response/get.page';
import { LetterService } from './letter.service';
import { LetterCategory } from '@util/category';
import { PrepareResponse } from './dto/response/prepare';
import { PrepareRequest } from './dto/request/prepare';
import { AddLetterRequest } from './dto/request/add.letter';
import { AddLetterResponse } from './dto/response/add.letter';

@Controller('letter')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Get()
  @ApiOperation({ summary: '초대장 페이지 조회' })
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: GetLetterPageResponse,
  })
  @UseInterceptors(new ResponseValidationInterceptor(GetLetterPageResponse))
  async getLetters(
    @Query() dto: GetLetterPageRequest,
  ): Promise<HttpResponse<GetLetterPageResponse>> {
    return {
      result: true,
      data: {
        totalCount: 1,
        items: [
          {
            id: 1,
            title: 'Mock초대장',
            category: LetterCategory.WEDDING,
            thumbnail: 'https://s3.ap-northeast-1.wasabisys.com/thm/00001',
          },
        ],
      },
    };
  }

  @ApiOperation({ summary: '초대장 업로드 url 조회' })
  @ApiOkResponse({
    status: 200,
    description: '성공',
    type: PrepareResponse,
  })
  @Get('prepare-add')
  @UseInterceptors(new ResponseValidationInterceptor(PrepareResponse))
  async prepareAddLetter(
    @Query() dto: PrepareRequest,
    @Request() req
  ): Promise<HttpResponse<PrepareResponse>> {
    return {
      result: true,
      data: await this.letterService.prepareAddLetter(dto,req.user),
    };
  }

  @ApiOperation({ summary : '초대장 업로드'})
  @ApiOkResponse({
    status : 201,
    description : '성공',
    type : AddLetterResponse
  })
  @Post()
  @UseInterceptors(new ResponseValidationInterceptor(AddLetterResponse))
  async addLetter(
    @Body() dto : AddLetterRequest,
    @Request() req,
  ) : Promise<HttpResponse<AddLetterResponse>> {
    return {
        result : true,
        data : await this.letterService.addLetter(dto,req.user)
    }
  }

  //   @Get(':id')
  //   @ApiOperation({ summary: '초대장 상세 정보 조회' })
  //   @ApiOkResponse({
  //     status: 200,
  //     description: '성공',
  //     type: GetLetterDetailResponse,
  //   })
  //   @UseInterceptors(new ResponseValidationInterceptor(GetLetterDetailResponse))
  //   async getLetterDetail(
  //     @Param() dto: GetLetterDetailRequest,
  //   ): Promise<HttpResponse<GetLetterDetailResponse>> {
  //     return {
  //       result: true,
  //       data: {
  //         background: {
  //           path: 'https://s3.ap-northeast-1.wasabisys.com/bgr/mock01',
  //           width: 800,
  //           height: 1600,
  //         },
  //         image: [
  //           {
  //             path: 'https://s3.ap-northeast-1.wasabisys.com/cpn/mock01',
  //             width: 100,
  //             height: 80,
  //             x: 200,
  //             y: 800,
  //           },
  //         ],
  //         text: [
  //           {
  //             body: 'MOCK',
  //             size: 18,
  //             x: 200,
  //             y: 600,
  //           },
  //         ],
  //       },
  //     };
  //   }
}
