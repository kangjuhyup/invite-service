import { AttachmentEntity } from '@database/entity/attachment';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { InsertAttachment, SelectAttachment } from './param/attachment';

export class AttachmentRepository {
  constructor(
    @InjectRepository(AttachmentEntity)
    private readonly attachment: Repository<AttachmentEntity>,
  ) {}

  async selectAttachmentIds({
    attachmentPaths,
    entityManager,
  }: Pick<SelectAttachment, 'attachmentPaths' | 'entityManager'>): Promise<
    number[]
  > {
    const repo = this._getRepository('attachment', entityManager);
    return (
      await repo
        .createQueryBuilder()
        .select(['attachmentId'])
        .where({
          attachmentPath: In(attachmentPaths),
        })
        .getMany()
    ).map((att) => att.attachmentId);
  }

  async bulkInsertAttachments({
    attachments,
    entityManager,
  }: Omit<InsertAttachment, 'attachment'>) {
    const repo = this._getRepository('attachment', entityManager);
    return await repo
      .createQueryBuilder()
      .insert()
      .values(attachments)
      .execute();
  }

  private _getRepository(type: 'attachment', entityManager?: EntityManager) {
    if (type === 'attachment')
      return entityManager
        ? entityManager.getRepository(AttachmentEntity)
        : this.attachment;
  }
}
