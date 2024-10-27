import { StorageService } from '@storage/storage.service';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
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

@Injectable()
export class LetterService {
  private readonly thumbnailBucket;
  private readonly backGroundBucket;
  private readonly componentBucket;
  private readonly letterBucket;
  private readonly urlExpires = 60;
  constructor(private readonly storage: StorageService, private readonly redis : RedisClientService) {
    const env = plainToInstance(Enviroments, process.env, {
      enableImplicitConversion: true,
    });
    this.thumbnailBucket = env.THUMB_BUCKET;
    this.backGroundBucket = env.BACKGROUND_BUCKET;
    this.componentBucket = env.COMPONENT_BUCKET;
    this.letterBucket = env.LETTER_BUCKET;
  }

  async prepareAddLetter({
    componentCount,
  }: PrepareRequest, user:User): Promise<PrepareResponse> {
    const uuid = uuidv4();
    const thumbnailUrl = await this.storage.generateUploadPresignedUrl({
      bucket: this.thumbnailBucket,
      key: uuid,
      expires: this.urlExpires,
    });
    const letterUrl = await this.storage.generateUploadPresignedUrl({
      bucket : this.letterBucket,
      key : uuid,
      expires : this.urlExpires,
    })
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
    await this.redis.set(this.redis.generateKey(LetterService.name,`add-${user.id}`),{
      sessionKey : sessionKey,
      objectKey : uuid,
    },70)
    return {
      thumbnailUrl,
      letterUrl,
      backgroundUrl,
      componentUrls,
      expires: this.urlExpires,
      sessionKey
    };
  }

  async addLetter(dto : AddLetterRequest,user:User) : Promise<AddLetterResponse> {
    //1. 세션키 획득
    const session = await this.redis.get<{sessionKey:string,objectKey:string}>(this.redis.generateKey(LetterService.name,`add-${user.id}`))
    if(!session) throw new BadRequestException('필수 요청이 누락되었습니다.')
    //2. 메타데이터 조회
    const { sessionKey,objectKey } = session;
    const thubnailMeta = await this.storage.getObjectMetadata({bucket:this.thumbnailBucket,key:objectKey})
    const letterMeta = await this.storage.getObjectMetadata({bucket:this.letterBucket,key:objectKey})
    const backgroundMeta = await this.storage.getObjectMetadata({bucket:this.backGroundBucket,key:objectKey})
    if(!thubnailMeta || !letterMeta || !backgroundMeta) throw new ForbiddenException('파일을 찾을 수 없습니다.')
    if(thubnailMeta['x-amz-session-key'] !== sessionKey ||letterMeta['x-amz-session-key'] !== sessionKey ||backgroundMeta['x-amz-session-key'] !== sessionKey ) {
      //TODO: 업로드된 파일 제거
    }
    //3. 데이터 저장
    return {
      letterId : 0
    }
  }
}
