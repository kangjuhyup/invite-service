import { AttachmentEntity } from 'packages/server/src/database/entity/attachment';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { InsertAttachment, SelectAttachment } from './param/attachment';

export class AttachmentRepository {
  constructor(
    @InjectRepository(AttachmentEntity)
    private readonly attachment: Repository<AttachmentEntity>,
  ) {}

  async selectAttachments({
    attachmentPaths,
    entityManager,
  }: Pick<SelectAttachment, 'attachmentPaths' | 'entityManager'>): Promise<
    AttachmentEntity[]
  > {
    const repo = this._getRepository('attachment', entityManager);
    return await repo
      .createQueryBuilder()
      .select()
      .where({
        attachmentPath: In(attachmentPaths),
      })
      .getMany();
  }

  async insertAttachment({
    attachment,
    entityManager,
  }: Omit<InsertAttachment, 'attachments'>) {
    const repo = this._getRepository('attachment', entityManager);
    return await repo.insert(attachment);
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
