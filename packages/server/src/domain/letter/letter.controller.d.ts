import { HttpResponse } from '../dto/response';
import { GetLetterPageRequest } from './dto/request/get.page';
import { GetLetterPageResponse } from './dto/response/get.page';
import { LetterService } from './service/letter.service';
import { PrepareResponse } from './dto/response/prepare';
import { PrepareRequest } from './dto/request/prepare';
import { AddLetterRequest } from './dto/request/add.letter';
import { AddLetterResponse } from './dto/response/add.letter';
import { GetLetterDetailRequest } from './dto/request/get.detail';
import { GetLetterDetailResponse } from './dto/response/get.detail';
export declare class LetterController {
    private readonly letterService;
    constructor(letterService: LetterService);
    getLetters(dto: GetLetterPageRequest, req: any): Promise<HttpResponse<GetLetterPageResponse>>;
    prepareAddLetter(dto: PrepareRequest, req: any): Promise<HttpResponse<PrepareResponse>>;
    addLetter(dto: AddLetterRequest, req: any): Promise<HttpResponse<AddLetterResponse>>;
    getLetterDetail(dto: GetLetterDetailRequest): Promise<HttpResponse<GetLetterDetailResponse>>;
}
