import { StorageService } from 'packages/server/src/storage/storage.service';
import { PrepareRequest } from '../dto/request/prepare';
import { PrepareResponse } from '../dto/response/prepare';
import { AddLetterRequest } from '../dto/request/add.letter';
import { AddLetterResponse } from '../dto/response/add.letter';
import { RedisClientService } from 'packages/server/src/redis/redis.client.service';
import { User } from 'packages/server/src/jwt/user';
import { InsertLetterTransaction } from '../transaction/insert.letter';
import { GetLetterPageRequest } from '../dto/request/get.page';
import { GetLetterPageResponse } from '../dto/response/get.page';
import { LetterRepository } from 'packages/server/src/database/repository/letter';
import { GetLetterDetailResponse } from '../dto/response/get.detail';
import { LetterBaseService } from './letter.base.service';
import { LetterAttachmentService } from './letter.attachment.service';
export declare class LetterService extends LetterBaseService {
    private readonly storage;
    private readonly redis;
    private readonly letterAttachmentService;
    private readonly letterRepository;
    private readonly insertLetterTransaction;
    private logger;
    constructor(storage: StorageService, redis: RedisClientService, letterAttachmentService: LetterAttachmentService, letterRepository: LetterRepository, insertLetterTransaction: InsertLetterTransaction);
    getLetters({ limit, skip }: GetLetterPageRequest, user: User): Promise<GetLetterPageResponse>;
    getLetterDetail(id: number): Promise<GetLetterDetailResponse>;
    prepareAddLetter({ thumbnailMeta, backgroundMeta, letterMeta, componentMetas, }: PrepareRequest, user: User): Promise<PrepareResponse>;
    addLetter({ category, title, body, commentYn, attendYn }: AddLetterRequest, user: User): Promise<AddLetterResponse>;
}
