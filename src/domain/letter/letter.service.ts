import { StorageService } from '@storage/storage.service';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Enviroments } from '../dto/env';
import { v4 as uuidv4 } from 'uuid';
import { PrepareRequest } from './dto/request/prepare';
import { PrepareResponse } from './dto/response/prepare';

@Injectable()
export class LetterService {
  private readonly thumbnailBucket;
  private readonly backGroundBucket;
  private readonly componentBucket;
  private readonly letterBucket;
  private readonly urlExpires = 60;
  constructor(private readonly storage: StorageService) {
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
  }: PrepareRequest): Promise<PrepareResponse> {
    const uuid = uuidv4();
    const thumbnailUrl = await this.storage.generateUploadPresignedUrl({
      bucket: this.thumbnailBucket,
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
          bucket: this.backGroundBucket,
          key: uuid + '-' + i,
          expires: this.urlExpires,
        }),
      );
    }
    return {
      thumbnailUrl,
      backgroundUrl,
      componentUrls,
      expires: this.urlExpires,
    };
  }
}
