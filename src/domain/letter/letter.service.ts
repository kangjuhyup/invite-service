import { StorageService } from '@storage/storage.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Enviroments } from '../dto/env';
import { v4 as uuidv4 } from 'uuid';
import { PrepareRequest } from './dto/request/prepare';
import { PrepareResponse } from './dto/response/prepare';
import { AddLetterRequest } from './dto/request/add.letter';
import { AddLetterResponse } from './dto/response/add.letter';
import { RedisClientService } from '@redis/redis.client.service';
import { User } from '@jwt/user';
import { randomString } from '@util/random';
import { InsertLetterTrasnaction } from './transaction/insert.letter';
import { booleanToYN } from '@util/yn';

@Injectable()
export class LetterService {
  private readonly thumbnailBucket;
  private readonly backGroundBucket;
  private readonly componentBucket;
  private readonly letterBucket;
  private readonly urlExpires = 60;
  constructor(
    private readonly storage: StorageService,
    private readonly redis: RedisClientService,
    private readonly insertLetterTransaction: InsertLetterTrasnaction,
  ) {
    const env = plainToInstance(Enviroments, process.env, {
      enableImplicitConversion: true,
    });
    this.thumbnailBucket = env.THUMB_BUCKET;
    this.backGroundBucket = env.BACKGROUND_BUCKET;
    this.componentBucket = env.COMPONENT_BUCKET;
    this.letterBucket = env.LETTER_BUCKET;
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
    const thubnailMeta = await this.storage.getObjectMetadata({
      bucket: this.thumbnailBucket,
      key: objectKey,
    });
    const letterMeta = await this.storage.getObjectMetadata({
      bucket: this.letterBucket,
      key: objectKey,
    });
    const backgroundMeta = await this.storage.getObjectMetadata({
      bucket: this.backGroundBucket,
      key: objectKey,
    });
    if (!thubnailMeta || !letterMeta || !backgroundMeta)
      throw new ForbiddenException('파일을 찾을 수 없습니다.');
    if (
      thubnailMeta['x-amz-session-key'] !== sessionKey ||
      letterMeta['x-amz-session-key'] !== sessionKey ||
      backgroundMeta['x-amz-session-key'] !== sessionKey
    ) {
      await this.storage.deleteObject({
        bucket: this.thumbnailBucket,
        key: objectKey,
      });
      await this.storage.deleteObject({
        bucket: this.letterBucket,
        key: objectKey,
      });
      await this.storage.deleteObject({
        bucket: this.backGroundBucket,
        key: objectKey,
      });
      throw new UnauthorizedException('세션키가 일치하지 않습니다.');
    }
    // 2-2. 아이템 메타데이터 조회 후 업로드된 아이템만 추출
    const componentPaths = [];
    for(let i = 0; i<componentCount; i++) {
      const componentMeta = await this.storage.getObjectMetadata({
        bucket: this.componentBucket,
        key: `${objectKey}-${i}`,
      });
      if(componentMeta) {
        if(componentMeta['x-amz-session-key'] === sessionKey) componentPaths.push(`${objectKey}-${i}`)
        else await this.storage.deleteObject({
          bucket: this.componentBucket,
          key: `${objectKey}-${i}`,
        })
      }
    }
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
        thumnailAttachment: {
          attachmentPath: `${this.thumbnailBucket}/${objectKey}`,
        },
        backgroundAttachment: {
          attachmentPath: `${this.backGroundBucket}/${objectKey}`,
        },
        letterAttachment: {
          attachmentPath: `${this.letterBucket}/${objectKey}`,
        },
        componentAttachments: componentPaths.map((path) => ({attachmentPath : `${this.componentBucket}/${path}`}))
      }),
    };
  }
}
