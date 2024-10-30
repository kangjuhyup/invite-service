import { StorageService } from '@storage/storage.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrepareRequest } from '../dto/request/prepare';
import { PrepareResponse } from '../dto/response/prepare';
import { AddLetterRequest } from '../dto/request/add.letter';
import { AddLetterResponse } from '../dto/response/add.letter';
import { RedisClientService } from '@redis/redis.client.service';
import { User } from '@jwt/user';
import { randomString } from '@util/random';
import { InsertLetterTransaction } from '../transaction/insert.letter';
import { booleanToYN } from '@util/yn';
import { GetLetterPageRequest } from '../dto/request/get.page';
import { GetLetterPageResponse } from '../dto/response/get.page';
import { LetterRepository } from '@database/repository/letter';
import { getCategoryFromCode } from '@util/category';
import { LetterAttachmentCode } from '@util/attachment';
import { GetLetterDetailRequest } from '../dto/request/get.detail';
import { GetLetterDetailResponse } from '../dto/response/get.detail';
import { LetterBaseService } from './letter.base.service';
import { LetterAttachmentService } from './letter.attachment.service';

@Injectable()
export class LetterService extends LetterBaseService {
  constructor(
    private readonly storage: StorageService,
    private readonly redis: RedisClientService,
    private readonly letterAttachmentService: LetterAttachmentService,
    private readonly letterRepository: LetterRepository,
    private readonly insertLetterTransaction: InsertLetterTransaction,
  ) {
    super();
  }

  async getLetters(
    { limit, skip }: GetLetterPageRequest,
    user: User,
  ): Promise<GetLetterPageResponse> {
    const letters = await this.letterRepository.selectLetterFromUser({
      userId: user.id,
      limit,
      skip,
    });
    return {
      totalCount: letters[1],
      items: letters[0].map((letter) => {
        return {
          id: letter.letterId,
          title: letter.title,
          category: getCategoryFromCode(letter.letterCategoryCode),
          thumbnail: letter.letterAttachment[0]?.attachment.attachmentPath,
        };
      }),
    };
  }

  async getLetterDetail({
    id,
  }: GetLetterDetailRequest): Promise<GetLetterDetailResponse> {
    const letter = await this.letterRepository.selectLetterFromId({
      letterId: id,
    });
    const bg = letter.letterAttachment.find(
      (la) => la.attachmentCode === LetterAttachmentCode.BACKGROUND,
    );
    const cmps = letter.letterAttachment.filter(
      (la) => la.attachmentCode === LetterAttachmentCode.COMPONENT,
    );
    return {
      title: letter.title,
      body: letter.body,
      background: {
        path: bg.attachment.attachmentPath,
        width: bg.width,
        height: bg.height,
      },
      components: cmps.map((c) => ({
        path: c.attachment.attachmentPath,
        width: c.width,
        height: c.height,
        x: c.x,
        y: c.y,
        z: c.z,
        ang: c.angle,
      })),
    };
  }

  async prepareAddLetter(
    { componentCount }: PrepareRequest,
    user: User,
  ): Promise<PrepareResponse> {
    const uuid = uuidv4();
    const thumbnailUrl = await this.storage.generateUploadPresignedUrl({
      bucket: this.thumbnailBucket,
      key: uuid,
      expires: this.urlExpires,
    });
    const letterUrl = await this.storage.generateUploadPresignedUrl({
      bucket: this.letterBucket,
      key: uuid,
      expires: this.urlExpires,
    });
    const backgroundUrl = await this.storage.generateUploadPresignedUrl({
      bucket: this.backGroundBucket,
      key: uuid,
      expires: this.urlExpires,
    });
    const componentUrls = [];
    for (let i = 0; i < componentCount; i++) {
      componentUrls.push(
        await this.storage.generateUploadPresignedUrl({
          bucket: this.componentBucket,
          key: uuid + '-' + i,
          expires: this.urlExpires,
        }),
      );
    }
    const sessionKey = randomString(5);
    await this.redis.set(
      this.redis.generateKey(LetterService.name, `add-${user.id}`),
      {
        sessionKey: sessionKey,
        objectKey: uuid,
        componentCount,
      },
      70,
    );
    return {
      thumbnailUrl,
      letterUrl,
      backgroundUrl,
      componentUrls,
      expires: this.urlExpires,
      sessionKey,
    };
  }

  async addLetter(
    { category, title, body, commentYn, attendYn }: AddLetterRequest,
    user: User,
  ): Promise<AddLetterResponse> {
    //1. 세션키 획득
    const session = await this.redis.get<{
      sessionKey: string;
      objectKey: string;
      componentCount: number;
    }>(this.redis.generateKey(LetterService.name, `add-${user.id}`));
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
    return {
      letterId: await this.insertLetterTransaction.run({
        letter: {
          userId: user.id,
          letterCategoryCode: category,
          body,
          title,
          commentYn: booleanToYN(commentYn),
          attendYn: booleanToYN(attendYn),
        },
        thumbnailAttachment:
          this.letterAttachmentService.createAttachmentDetail(
            thumbnailMeta,
            this.thumbnailBucket,
            LetterAttachmentCode.THUMBNAIL,
            objectKey,
          ),
        backgroundAttachment:
          this.letterAttachmentService.createAttachmentDetail(
            backgroundMeta,
            this.backGroundBucket,
            LetterAttachmentCode.BACKGROUND,
            objectKey,
          ),
        letterAttachment: this.letterAttachmentService.createAttachmentDetail(
          letterMeta,
          this.letterBucket,
          LetterAttachmentCode.LETTER,
          objectKey,
        ),
        componentAttachments: componentMetas.map((component, idx) =>
          this.letterAttachmentService.createAttachmentDetail(
            component,
            this.componentBucket,
            LetterAttachmentCode.COMPONENT,
            `${objectKey}-${idx}`,
          ),
        ),
      }),
    };
  }
}