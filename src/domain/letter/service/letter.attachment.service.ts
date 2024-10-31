// letterAttachment.service.ts

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { StorageService } from '@storage/storage.service';
import { LetterBaseService } from './letter.base.service';
import { LetterAttachmentCode } from '@util/attachment';
import { AttachmentDetail } from '../transaction/insert.letter';

@Injectable()
export class LetterAttachmentService extends LetterBaseService {
  private readonly logger = new Logger(LetterAttachmentService.name);
  constructor(private readonly storage: StorageService) {
    super();
  }

  async validateSessionAndRetrieveMetadata(
    sessionKey: string,
    objectKey: string,
    componentCount: number,
  ) {
    const metadata = await this.getMetadata(objectKey, componentCount);
    console.log(JSON.stringify(metadata));
    if (
      metadata.thumbnailMeta['x-amz-session-key'] !== sessionKey ||
      metadata.letterMeta['x-amz-session-key'] !== sessionKey ||
      metadata.backgroundMeta['x-amz-session-key'] !== sessionKey ||
      metadata.componentMetas.some((c) => c['x-amz-session-key'] !== sessionKey)
    ) {
      this.deleteInvalidObjects(metadata, objectKey);
      throw new UnauthorizedException('세션키가 일치하지 않습니다.');
    }

    return metadata;
  }

  private async getMetadata(objectKey: string, componentCount: number) {
    const [thumbnailMeta, letterMeta, backgroundMeta] = await Promise.all([
      this.storage.getObjectMetadata({
        bucket: this.thumbnailBucket,
        key: objectKey,
      }),
      this.storage.getObjectMetadata({
        bucket: this.letterBucket,
        key: objectKey,
      }),
      this.storage.getObjectMetadata({
        bucket: this.backGroundBucket,
        key: objectKey,
      }),
    ]);
    const componentPromises = Array.from({ length: componentCount }, (_, i) =>
      this.storage.getObjectMetadata({
        bucket: this.componentBucket,
        key: `${objectKey}-${i}`,
      }),
    );
    const componentResults = await Promise.allSettled(componentPromises);
    const componentMetas = componentResults
      .filter((result) => result.status === 'fulfilled' && result.value)
      .map((result) => (result as PromiseFulfilledResult<any>).value);

    return { thumbnailMeta, letterMeta, backgroundMeta, componentMetas };
  }

  private deleteInvalidObjects(metadata: any, objectKey: string) {
    const deletePromises = [
      this.storage.deleteObject({
        bucket: this.thumbnailBucket,
        key: objectKey,
      }),
      this.storage.deleteObject({
        bucket: this.letterBucket,
        key: objectKey,
      }),
      this.storage.deleteObject({
        bucket: this.backGroundBucket,
        key: objectKey,
      }),
    ];

    for (let i = 0; i < metadata.componentMetas.length; i++) {
      deletePromises.push(
        this.storage.deleteObject({
          bucket: this.componentBucket,
          key: `${objectKey}-${i}`,
        }),
      );
    }

    Promise.allSettled(deletePromises).then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          this.logger.error(
            `파일 삭제 실패 (${index + 1}/${deletePromises.length}) => ${result.reason.message}`,
          );
        }
      });
    });
  }

  createAttachmentDetail(
    meta: any,
    bucket: string,
    code: LetterAttachmentCode,
    objectKey: string,
  ): AttachmentDetail {
    if (!meta['x-amx-width'] || !meta['x-amx-height']) {
      this.storage.deleteObject({
        bucket,
        key: objectKey,
      });
      throw new BadRequestException('메타데이터에 필수값이 존재하지 않습니다.');
    }

    const detail: AttachmentDetail = {
      attachmentPath: `${bucket}/${objectKey}`,
      attachmentCode: code,
      width: Number(meta['x-amx-width']),
      height: Number(meta['x-amx-height']),
      x: Number(meta['x-amx-x']) || 0,
      y: Number(meta['x-amx-y']) || 0,
      z: Number(meta['x-amx-z']) || 0,
      angle: Number(meta['x-amx-angle']) || 0,
    };
    return detail;
  }
}
