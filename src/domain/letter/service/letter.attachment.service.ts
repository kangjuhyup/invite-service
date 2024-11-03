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
    if (
      metadata.thumbnailMeta.Metadata.session !== sessionKey ||
      metadata.letterMeta.Metadata.session !== sessionKey ||
      metadata.backgroundMeta.Metadata.session !== sessionKey ||
      metadata.componentMetas.some((c) => c.Metadata.session !== sessionKey)
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
    if (!meta.Metadata.width || !meta.Metadata.height) {
      this.storage.deleteObject({
        bucket,
        key: objectKey,
      });
      throw new BadRequestException('메타데이터에 필수값이 존재하지 않습니다.');
    }

    const detail: AttachmentDetail = {
      attachmentPath: `${bucket}/${objectKey}`,
      attachmentCode: code,
      width: Number(meta.Metadata.width),
      height: Number(meta.Metadata.height),
      x: Number(meta.Metadata.x) || 0,
      y: Number(meta.Metadata.y) || 0,
      z: Number(meta.Metadata.z) || 0,
      angle: Number(meta.Metadata.angle) || 0,
    };
    return detail;
  }
}
