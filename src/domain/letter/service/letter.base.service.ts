import { Enviroments } from '@app/domain/dto/env';
import { plainToInstance } from 'class-transformer';

export abstract class LetterBaseService {
  private readonly _thumbnailBucket: string;
  public get thumbnailBucket() {
    return this._thumbnailBucket;
  }
  private readonly _backGroundBucket: string;
  public get backGroundBucket() {
    return this._backGroundBucket;
  }
  private readonly _componentBucket: string;
  public get componentBucket() {
    return this._componentBucket;
  }
  private readonly _letterBucket: string;
  public get letterBucket() {
    return this._letterBucket;
  }
  private readonly _urlExpires = 60;
  public get urlExpires() {
    return this._urlExpires;
  }

  constructor() {
    {
      const env = plainToInstance(Enviroments, process.env, {
        enableImplicitConversion: true,
      });
      this._thumbnailBucket = env.THUMB_BUCKET;
      this._backGroundBucket = env.BACKGROUND_BUCKET;
      this._componentBucket = env.COMPONENT_BUCKET;
      this._letterBucket = env.LETTER_BUCKET;
    }
  }
}
