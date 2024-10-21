import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { GetLetterDetailRequest } from "./dto/request/get.detail";
import { HttpResponse } from "../dto/response";
import { ResponseValidationInterceptor } from "src/interceptor/response.validation";
import { GetLetterDetailResponse } from "./dto/response/get.detail";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { GetLetterPageRequest } from "./dto/request/get.page";
import { GetLetterPageResponse } from "./dto/response/get.page";

@Controller('letter')
export class LetterController {
     @Get()
     @ApiOperation({ summary : '초대장 페이지 조회'})
     @ApiOkResponse({ status : 200, description : '성공', type : GetLetterPageResponse})
     @UseInterceptors(new ResponseValidationInterceptor(GetLetterPageResponse))
     async getLetters(
        @Query() dto : GetLetterPageRequest
     ){}

     @Get(':id')
     @ApiOperation({ summary: '초대장 상세 정보 조회' })
     @ApiOkResponse({ status: 200, description: '성공', type: GetLetterDetailResponse })
     @UseInterceptors(new ResponseValidationInterceptor(GetLetterDetailResponse))
     async getLetterDetail(
        @Param() dto : GetLetterDetailRequest
     ) : Promise<HttpResponse<GetLetterDetailResponse>>{
        return {
            result : true,
            data : {
                background : {
                    path : 'https://invite.jhkang.xyz/storage/mock/bg-mock.png',
                    width : 800,
                    height : 1600                   
                },
                image : [{
                    path : 'https://invite.jhkang.xyz/storage/mock/img-mock01.png',
                    width : 100,
                    height : 80,
                    x : 200,
                    y : 800
                }],
                text : [{
                    body : 'MOCK',
                    size : 18,
                    x : 200,
                    y : 600
                }]
            }
        }
     }
}