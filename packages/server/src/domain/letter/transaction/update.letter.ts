import { AttachmentEntity } from '@app/database/entity/attachment/attachment';
import { LetterAttachmentEntity } from '@app/database/entity/letter/letter.attachment';
import { AttachmentRepository } from '@app/database/repository/attachment';
import { LetterRepository } from '@app/database/repository/letter';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import {
  LetterTransactionBase,
  AttachmentDetail,
} from './letter.transaction.base';
import { LetterCategoryCode } from '@app/util/category';

interface UpdateLetter {
  letterId: number;
  category?: LetterCategoryCode;
  title?: string;
  content?: string;
  inviteDate?: string;
  commentYn?: boolean;
  attendYn?: boolean;
  publicYn?: boolean;
}

interface Input {
  letter: UpdateLetter;
  thumbnailAttachment: AttachmentDetail;
  backgroundAttachment: AttachmentDetail;
  letterAttachment: AttachmentDetail;
  componentAttachments: Array<AttachmentDetail>;
}

@Injectable()
export class UpdateLetterTransaction extends LetterTransactionBase<
  Input,
  number
> {
  constructor(
    ds: DataSource,
    letterRepository: LetterRepository,
    attachmentRepository: AttachmentRepository,
  ) {
    super(
      ds,
      letterRepository,
      attachmentRepository,
      UpdateLetterTransaction.name,
    );
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
    // 1. 레터 업데이트
    const letterId = await this.#updateLetter(letter, entityManager);

    // 2. 첨부 파일 삽입 (병렬 처리)
    const [
      thumbnailId,
      letterAttachmentId,
      backgroundAttachmentId,
      ...componentAttachmentIds
    ] = await Promise.all([
      this.insertAttachment(thumbnailAttachment, entityManager),
      this.insertAttachment(letterAttachment, entityManager),
      this.insertAttachment(backgroundAttachment, entityManager),
      ...componentAttachments.map((c) =>
        this.insertAttachment(c, entityManager),
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
    await this.insertLetterAttachments(letterId, allAttachments, entityManager);

    return letterId;
  }

  /**
   * 레터를 업데이트하고, 업데이트된 레터의 ID를 반환합니다.
   */
  async #updateLetter(
    letter: UpdateLetter,
    entityManager: EntityManager,
  ): Promise<number> {
    await this.letterRepository.updateLetter({
      ...letter,
      updator: this.transactionName,
      entityManager,
    });
    return letter.letterId;
  }
}
