import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from '@app/jwt/user';
import { LetterService } from './service/letter.service';
import { PrepareRequest } from './dto/request/prepare';
import { PrepareResponse } from './dto/response/prepare';
import { AddLetterRequest } from './dto/request/add.letter';
import { AddLetterResponse } from './dto/response/add.letter';
import { GetLetterPageRequest } from './dto/request/get.page';
import { GetLetterPageResponse } from './dto/response/get.page';
import { GetLetterResponse } from './dto/response/get.letter';
import { GetLetterDetailResponse } from './dto/response/get.detail';
import { StorageService } from '@app/storage/storage.service';
import { RedisClientService } from '@app/redis/redis.client.service';
import { LetterAttachmentService } from './service/letter.attachment.service';
import { InsertLetterTransaction } from './transaction/insert.letter';
import { v4 as uuidv4 } from 'uuid';
import { randomString } from '@app/util/random';
import { booleanToYN } from '@app/util/yn';
import { LetterAttachmentCode } from '@app/util/attachment';

@Injectable()
export class LetterFacade {
  private logger = new Logger(LetterFacade.name);

  constructor(
    private readonly letterService: LetterService,
    private readonly storage: StorageService,
    private readonly redis: RedisClientService,
    private readonly letterAttachmentService: LetterAttachmentService,
    private readonly insertLetterTransaction: InsertLetterTransaction,
  ) {}

  async getLetters(
    request: GetLetterPageRequest,
    user: User,
  ): Promise<GetLetterPageResponse> {
    return this.letterService.getLetters(request, user);
  }

  async getLetter(id: number): Promise<GetLetterResponse> {
    return this.letterService.getLetter(id);
  }

  async getLetterDetail(id: number): Promise<GetLetterDetailResponse> {
    return this.letterService.getLetterDetail(id);
  }

  async prepareAddLetter(
    {
      thumbnailMeta,
      backgroundMeta,
      letterMeta,
      componentMetas,
    }: PrepareRequest,
    user: User,
  ): Promise<PrepareResponse> {
    const uuid = uuidv4();
    const sessionKey = randomString(5);
    const thumbnailUrl = await this.storage.generateUploadPresignedUrl({
      bucket: this.letterAttachmentService.thumbnailBucket,
      key: uuid,
      expires: this.letterAttachmentService.urlExpires,
      meta: {
        session: sessionKey,
        ...thumbnailMeta,
      },
    });
    const letterUrl = await this.storage.generateUploadPresignedUrl({
      bucket: this.letterAttachmentService.letterBucket,
      key: uuid,
      expires: this.letterAttachmentService.urlExpires,
      meta: { session: sessionKey, ...letterMeta },
    });
    const backgroundUrl = await this.storage.generateUploadPresignedUrl({
      bucket: this.letterAttachmentService.backGroundBucket,
      key: uuid,
      expires: this.letterAttachmentService.urlExpires,
      meta: { session: sessionKey, ...backgroundMeta },
    });
    const componentUrls = await Promise.all(
      componentMetas.map(async (componentMeta, i) => {
        return await this.storage.generateUploadPresignedUrl({
          bucket: this.letterAttachmentService.componentBucket,
          key: uuid + '-' + i,
          expires: this.letterAttachmentService.urlExpires,
          meta: { session: sessionKey, ...componentMeta },
        });
      }),
    );

    await this.redis.set(
      this.redis.generateKey(LetterFacade.name, `add-${user.id}`),
      {
        sessionKey: sessionKey,
        objectKey: uuid,
        componentCount: componentMetas.length,
      },
      70,
    );
    return {
      thumbnailUrl,
      letterUrl,
      backgroundUrl,
      componentUrls,
      expires: this.letterAttachmentService.urlExpires,
      sessionKey,
    };
  }

  async addLetter(
    request: AddLetterRequest,
    user: User,
  ): Promise<AddLetterResponse> {
    this.logger.debug(`addLetter start`);
    //1. 세션키 획득
    const session = await this.redis.get<{
      sessionKey: string;
      objectKey: string;
      componentCount: number;
    }>(this.redis.generateKey(LetterFacade.name, `add-${user.id}`));
    if (!session) throw new BadRequestException('필수 요청이 누락되었습니다.');
    //2. 메타데이터 조회
    const { sessionKey, objectKey, componentCount } = session;
    const { thumbnailMeta, letterMeta, backgroundMeta, componentMetas } =
      await this.letterAttachmentService.validateSessionAndRetrieveMetadata(
        sessionKey,
        objectKey,
        componentCount,
      );
    //3. 데이터 저장
    const letterId = await this.insertLetterTransaction.run({
      letter: {
        userId: user.id,
        letterCategoryCode: request.category,
        body: request.body,
        title: request.title,
        commentYn: booleanToYN(request.commentYn),
        attendYn: booleanToYN(request.attendYn),
      },
      thumbnailAttachment: this.letterAttachmentService.createAttachmentDetail(
        thumbnailMeta,
        this.letterAttachmentService.thumbnailBucket,
        LetterAttachmentCode.THUMBNAIL,
        objectKey,
      ),
      backgroundAttachment: this.letterAttachmentService.createAttachmentDetail(
        backgroundMeta,
        this.letterAttachmentService.backGroundBucket,
        LetterAttachmentCode.BACKGROUND,
        objectKey,
      ),
      letterAttachment: this.letterAttachmentService.createAttachmentDetail(
        letterMeta,
        this.letterAttachmentService.letterBucket,
        LetterAttachmentCode.LETTER,
        objectKey,
      ),
      componentAttachments: componentMetas.map((component, idx) =>
        this.letterAttachmentService.createAttachmentDetail(
          component,
          this.letterAttachmentService.componentBucket,
          LetterAttachmentCode.COMPONENT,
          `${objectKey}-${idx}`,
        ),
      ),
    });
    return {
      letterId,
    };
  }
}
