import { AttachmentRepository } from '@app/database/repository/attachment';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LetterEntity } from '@app/database/entity/letter/letter';
import { BaseTransaction } from '@app/database/transaction.base';
import { TemplateRepository } from '../../../database/repository/template';
import { MetadataEntity } from '@app/database/entity/attachment/metadata';
import { TemplateAttachmentEntity } from '@app/database/entity/template/template.attachment';
import { LetterAttachmentCode } from '@app/util/attachment';
import { TemplateEntity } from '@app/database/entity/template/template';

interface Input {
  letterEntity : LetterEntity
}

@Injectable()
export class InsertTemplateTransaction extends BaseTransaction<
  Input,
  number
> {
    #logger = new Logger(InsertTemplateTransaction.name);
    #transactionName = InsertTemplateTransaction.name;

  constructor(
    ds: DataSource,
    private readonly templateRepository: TemplateRepository,
    private readonly attachmentRepository: AttachmentRepository,
  ) {
    super(ds);
  }

  protected async execute(
    {
        letterEntity
    }: Input,
    entityManager: EntityManager,
  ): Promise<number> {
    // 1. 탬플릿 삽입
    const userId = letterEntity.userId;
    const template = TemplateEntity.of(userId, this.#transactionName);
    const insertResult = await this.templateRepository.insertTemplate({
      template,
      entityManager,
    });

    const templateId = insertResult.identifiers[0].templateId;

    await this.insertAttachments(templateId, letterEntity, entityManager);
    

    return templateId;
  }

  protected async insertAttachments(
    templateId : number,
    letterEntity: LetterEntity,
    entityManager: EntityManager,
  ): Promise<void> {
    const attachments = letterEntity.letterAttachment.map((a) => a.attachment.setTemplatePath().setUpdator(this.#transactionName).deleteId());
    this.#logger.debug('attachments : ', attachments)
    // 2. 첨부 파일 삽입
    await this.attachmentRepository.bulkInsertAttachments({attachments,entityManager})
    const newAttachments = await this.attachmentRepository.selectAttachments({
        attachmentPaths : attachments.map((a) => a.attachmentPath),
        entityManager,
    })
    // 3. 모든 첨부 파일 정보를 결합
    const metadatas = newAttachments.map((a) => MetadataEntity.of(
      this.#transactionName,
      a.attachmentId,
      a.metadata.angle,
      a.metadata.width,
      a.metadata.height,
      a.metadata.x,
      a.metadata.y,
      a.metadata.z,
      a.metadata.font,
      a.metadata.color,
      a.metadata.bold,
    ));
    await this.attachmentRepository.buildInsertMetadata({metadatas,entityManager});
    const templateAttachments = newAttachments.map((a) => {
        const attachmentCode = a.attachmentPath.split('-')[1];
        switch (attachmentCode) {
            case LetterAttachmentCode.THUMBNAIL:
                return TemplateAttachmentEntity.of(templateId, LetterAttachmentCode.THUMBNAIL, a.attachmentId, this.#transactionName);
            case LetterAttachmentCode.LETTER:
                return TemplateAttachmentEntity.of(templateId, LetterAttachmentCode.LETTER, a.attachmentId, this.#transactionName);
            case LetterAttachmentCode.BACKGROUND:
                return TemplateAttachmentEntity.of(templateId, LetterAttachmentCode.BACKGROUND, a.attachmentId, this.#transactionName);
            case LetterAttachmentCode.COMPONENT:
                return TemplateAttachmentEntity.of(templateId, LetterAttachmentCode.COMPONENT, a.attachmentId, this.#transactionName);
        }
    });
    // 4. 탬플릿 첨부 파일 관계 삽입
    await this.templateRepository.bulkInsertTemplateAttachment({templateAttachments,entityManager});
  }

}
