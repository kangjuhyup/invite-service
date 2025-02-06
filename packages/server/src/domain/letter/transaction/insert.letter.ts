import { AttachmentRepository } from '@app/database/repository/attachment';
import { LetterRepository } from '@app/database/repository/letter';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import {
  LetterTransactionBase,
  AttachmentDetail,
} from './letter.transaction.base';
import { LetterEntity } from '@app/database/entity/letter/letter';
import { LetterCategoryCode } from '@app/util/category';
import { booleanToYN } from '../../../util/yn';
import { LetterTotalEntity } from '@app/database/entity/letter/letter.total';

interface LetterDetail {
  userId: string;
  letterCategoryCode: LetterCategoryCode;
  title: string;
  body?: string;
  comment?: boolean;
  attend?: boolean;
  public?: boolean;
}

interface Input {
  letter: LetterDetail;
  thumbnailAttachment: AttachmentDetail;
  backgroundAttachment: AttachmentDetail;
  letterAttachment: AttachmentDetail;
  componentAttachments: Array<AttachmentDetail>;
}

@Injectable()
export class InsertLetterTransaction extends LetterTransactionBase<
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
      InsertLetterTransaction.name,
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
    // 1. 레터 삽입
    const letterId = await this.#insertLetter(letter, entityManager);

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
    await this.letterRepository.insertLetterTotal({
      letterTotal: LetterTotalEntity.of(letterId, this.transactionName),
      entityManager,
    });

    return letterId;
  }

  /**
   * 레터를 삽입하고, 삽입된 레터의 ID를 반환합니다.
   */
  async #insertLetter(
    letter: LetterDetail,
    entityManager: EntityManager,
  ): Promise<number> {
    const letterEntity = LetterEntity.of({
      userId: letter.userId,
      letterCategoryCode: letter.letterCategoryCode,
      title: letter.title,
      body: letter.body,
      commentYn: booleanToYN(letter.comment),
      attendYn: booleanToYN(letter.attend),
      publicYn: booleanToYN(letter.public),
      creator: this.transactionName,
    });
    const result = await this.letterRepository.insertLetter({
      letter: letterEntity,
      entityManager,
    });
    return result.identifiers[0].letterId;
  }
}
