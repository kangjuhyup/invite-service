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
import { AttachmentEntity } from '@app/database/entity/attachment/attachment';
import { TemplateTotalEntity } from '@app/database/entity/template/template.total';
import { LetterCategoryCode } from '@app/util/category';

interface Input {
  userId : string
  title : string
  category : LetterCategoryCode
  attachments : Array<{attachmentCode : LetterAttachmentCode , attachment : AttachmentEntity}>
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
        userId,
        title,
        category,
        attachments
    }: Input,
    entityManager: EntityManager,
  ): Promise<number> {    // 1. 탬플릿 삽입
    const template = TemplateEntity.of(userId, title, category, this.#transactionName);
    const insertResult = await this.templateRepository.insertTemplate({
      template,
      entityManager,
    });

    const templateId = insertResult.identifiers[0].templateId;

    await this.insertAttachments(
      templateId,
      attachments,
      entityManager
    );

    return templateId;
  }

  protected async insertAttachments(
    templateId : number,
    attachmentEntities: Array<{attachmentCode : LetterAttachmentCode , attachment : AttachmentEntity}>,
    entityManager: EntityManager,
  ): Promise<void> {
    const attachments = attachmentEntities.map((a) => a.attachment.setUpdator(this.#transactionName));
    // 1. 첨부 파일 삽입
    this.#logger.debug(`1. 첨부파일 삽입`)
    this.#logger.debug(`attachments : ${attachments.length} 건`)
    await this.attachmentRepository.bulkInsertAttachments({attachments,entityManager})
    const newAttachments = await this.attachmentRepository.selectAttachments({
        attachmentPaths : attachments.map((a) => a.attachmentPath),
        entityManager,
    })

    this.#logger.debug(`newAttachments : ${JSON.stringify(newAttachments)}`)
    this.#logger.debug(`newAttachments.length : ${newAttachments.length} 건`)
    // 2. 메타데이터 생성 및 삽입
    this.#logger.debug(`2. 메타데이터 생성 및 삽입`)
    const metadatas = attachments.map((a, index) => MetadataEntity.of(
      this.#transactionName,
      newAttachments[index].attachmentId,
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
    const templateAttachments = newAttachments.map((a,idx) => {
        const attachmentCode = attachmentEntities[idx].attachmentCode;
        this.#logger.debug(`attachmentCode : ${attachmentCode}`)
        switch (attachmentCode) {
            case LetterAttachmentCode.THUMBNAIL:
                return TemplateAttachmentEntity.of(templateId, LetterAttachmentCode.THUMBNAIL, a.attachmentId, this.#transactionName);
            case LetterAttachmentCode.LETTER:
                return TemplateAttachmentEntity.of(templateId, LetterAttachmentCode.LETTER, a.attachmentId, this.#transactionName);
            case LetterAttachmentCode.BACKGROUND:
                return TemplateAttachmentEntity.of(templateId, LetterAttachmentCode.BACKGROUND, a.attachmentId, this.#transactionName);
            case LetterAttachmentCode.COMPONENT:
                return TemplateAttachmentEntity.of(templateId, LetterAttachmentCode.COMPONENT, a.attachmentId, this.#transactionName);
            default: 
                return;
        }
    });
    // 4. 탬플릿 첨부 파일 관계 삽입
    this.#logger.debug(`4. 탬플릿 첨부 파일 관계 삽입`)
    this.#logger.debug(`templateAttachments : ${JSON.stringify(templateAttachments)}`)
    const result = await this.templateRepository.bulkInsertTemplateAttachment({templateAttachments,entityManager});
    await this.templateRepository.insertTemplateTotal({
      templateTotal : TemplateTotalEntity.of(templateId, this.#transactionName),
      entityManager,
    })
    this.#logger.debug(`result : ${JSON.stringify(result)}`);
  }

}
