// letterAttachment.service.ts

import { AttachmentEntity } from '@database/entity/attachment';
import { LetterAttachmentEntity } from '@database/entity/letter.attachment';
import { AttachmentRepository } from '@database/repository/attachment';
import { LetterRepository } from '@database/repository/letter';
import { Attachment } from '@database/repository/param/attachment';
import { Letter, LetterAttachment } from '@database/repository/param/letter';
import { BaseTransaction } from '@database/transaction.base';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

export type AttachmentDetail = Pick<AttachmentEntity, 'attachmentPath'> &
  Pick<
    LetterAttachmentEntity,
    'attachmentCode' | 'angle' | 'width' | 'height' | 'x' | 'y' | 'z'
  >;

interface Input {
  letter: Omit<Letter, 'creator' | 'updator'>;
  thumbnailAttachment: AttachmentDetail;
  backgroundAttachment: AttachmentDetail;
  letterAttachment: AttachmentDetail;
  componentAttachments: Array<AttachmentDetail>;
}

@Injectable()
export class InsertLetterTransaction extends BaseTransaction<Input, number> {
  private readonly creator = InsertLetterTransaction.name;
  constructor(
    private readonly ds: DataSource,
    private readonly letterRepository: LetterRepository,
    private readonly attachmentRepository: AttachmentRepository,
  ) {
    super(ds);
  }

  protected async execute(
    {
      letter,
      thumbnailAttachment,
      letterAttachment,
      backgroundAttachment,
      componentAttachments,
    }: Input,
    entityManager: EntityManager,
  ): Promise<number> {
    console.log('Insert Transaction run');
    // 1. 레터 삽입 및 letterId 획득
    const letterId = await this._insertLetter(
      { ...letter, creator: this.creator, updator: this.creator },
      entityManager,
    );

    // 2. 첨부 파일 삽입 (병렬 처리)
    const [
      thumbnailId,
      letterAttachmentId,
      backgroundAttachmentId,
      ...componentAttachmentIds
    ] = await Promise.all([
      this._insertAttachment(thumbnailAttachment, entityManager),
      this._insertAttachment(letterAttachment, entityManager),
      this._insertAttachment(backgroundAttachment, entityManager),
      ...componentAttachments.map((c) =>
        this._insertAttachment(c, entityManager),
      ),
    ]);

    // 3. 모든 첨부 파일 정보를 결합
    const allAttachments = [
      { attachmentId: thumbnailId, ...thumbnailAttachment },
      { attachmentId: letterAttachmentId, ...letterAttachment },
      { attachmentId: backgroundAttachmentId, ...backgroundAttachment },
      ...componentAttachmentIds.map((id, index) => ({
        attachmentId: id,
        ...componentAttachments[index],
      })),
    ];

    // 4. 레터 첨부 파일 관계 삽입
    await this._insertLetterAttachments(
      letterId,
      allAttachments,
      entityManager,
    );

    return letterId;
  }

  /**
   * 레터를 삽입하고, 삽입된 레터의 ID를 반환합니다.
   */
  private async _insertLetter(
    letter: Letter,
    entityManager: EntityManager,
  ): Promise<number> {
    console.log(`_insertLetter`);
    console.log(this.letterRepository);
    const result = await this.letterRepository.insertLetter({
      letter,
      entityManager,
    });
    return result.identifiers[0].letterId;
  }

  private async _insertAttachment(
    attachmentDetail: AttachmentDetail,
    entityManager: EntityManager,
  ): Promise<number> {
    console.log(`_insertAttachment`);
    const attachment: Attachment = {
      attachmentPath: attachmentDetail.attachmentPath,
      creator: this.creator,
      updator: this.creator,
    };

    const result = await this.attachmentRepository.insertAttachment({
      attachment,
      entityManager,
    });
    return result.identifiers[0].attachmentId;
  }

  private async _insertLetterAttachments(
    letterId: number,
    attachments: Array<
      AttachmentDetail & {
        attachmentId: number;
      }
    >,
    entityManager: EntityManager,
  ): Promise<void> {
    console.log(`_insertLetterAttachments`);
    const letterAttachments: LetterAttachment[] = attachments.map((a) => ({
      letterId,
      attachmentId: a.attachmentId,
      attachmentCode: a.attachmentCode,
      angle: a.angle,
      width: a.width,
      height: a.height,
      x: a.x,
      y: a.y,
      z: a.z,
      creator: this.creator,
      updator: this.creator,
    }));

    await this.letterRepository.insertLetterAttachment({
      letterAttachments,
      entityManager,
    });
  }
}
