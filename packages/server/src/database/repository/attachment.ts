import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import {
  DeleteAttachment,
  InsertAttachment,
  InsertMetadata,
  SelectAttachment,
} from './param/attachment';
import { AttachmentEntity } from '../entity/attachment/attachment';
import { YN } from '@app/util/yn';
import { MetadataEntity } from '../entity/attachment/metadata';

export class AttachmentRepository {
  constructor(
    @InjectRepository(AttachmentEntity)
    private readonly attachment: Repository<AttachmentEntity>,
    @InjectRepository(MetadataEntity)
    private readonly metadata: Repository<MetadataEntity>,
  ) {}

  async selectAttachmentFromId({
    attachmentId,
    entityManager,
  }: Pick<SelectAttachment, 'attachmentId' | 'entityManager'>): Promise<
    AttachmentEntity
  > {
    const repo = this._getRepository('attachment', entityManager);
    return await repo.findOne({
      where: {
        attachmentId,
      },
      relations : {
        metadata: true,
      }
    });
  }

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

  async insertMetadata({
    metadata,
    entityManager,
  }: Pick<InsertMetadata, 'metadata' | 'entityManager'>) {
    const repo = this._getRepository('metadata', entityManager);
    return await repo.insert(metadata);
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

  async buildInsertMetadata({
    metadatas,
    entityManager,
  }: Pick<InsertMetadata, 'metadatas' | 'entityManager'>) {
    const repo = this._getRepository('metadata', entityManager);
    return await repo.insert(metadatas);
  }

  async deleteAttachments({
    attachmentIds,
    entityManager,
  }: Omit<DeleteAttachment, 'attachmentId'>) {
    const repo = this._getRepository('attachment', entityManager);
    return await repo.update(
      {
        attachmentId: In(attachmentIds),
      },
      {
        useYn: YN.N,
      },
    );
  }

  private _getRepository<T extends 'attachment' | 'metadata'>(
    type: T,
    entityManager?: EntityManager,
  ): T extends 'attachment'
    ? Repository<AttachmentEntity>
    : T extends 'metadata'
      ? Repository<MetadataEntity>
      : Repository<AttachmentEntity> {
    if (type === 'attachment')
      return (
        entityManager
          ? entityManager.getRepository(AttachmentEntity)
          : this.attachment
      ) as any;
    if (type === 'metadata')
      return (
        entityManager
          ? entityManager.getRepository(MetadataEntity)
          : this.metadata
      ) as any;
    throw new Error('Invalid repository type');
  }
}
