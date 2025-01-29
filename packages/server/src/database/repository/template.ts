import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AttachmentEntity } from '../entity/attachment/attachment';
import { TemplateEntity } from '../entity/template/template';
import { TemplateAttachmentEntity } from '../entity/template/template.attachment';
import { YN } from '@app/util/yn';
import { DefaultColumn } from '../column/default';
import { InsertTemplate, InsertTemplateAttachment, SelectTemplate } from './param/template';

export class TemplateRepository {
  private readonly logger = new Logger(TemplateRepository.name);

  constructor(
    @InjectRepository(TemplateEntity)
    private readonly template: Repository<TemplateEntity>,
    @InjectRepository(TemplateAttachmentEntity)
    private readonly templateAttachment: Repository<TemplateAttachmentEntity>,
    @InjectRepository(AttachmentEntity)
    private readonly attachment: Repository<AttachmentEntity>,
  ) {}

  async selectTemplateTotalCount(
    entityManager?: EntityManager,
  ): Promise<number> {
    const repo = this._getRepository('template', entityManager);
    return await repo.count({
      where: {
        useYn: YN.Y,
      },
    });
  }

  async selectTemplates({
    startAt,
    limit,
    entityManager,
  }: Pick<SelectTemplate, 'startAt' | 'limit' | 'entityManager'>): Promise<
    TemplateEntity[]
  > {
    const repo = this._getRepository(
      'template',
      entityManager,
    ) as Repository<TemplateEntity>;
    const where = { useYn: YN.Y };
    if (startAt) {
      where['templateId'] = startAt;
    }
    const ids = await repo
      .createQueryBuilder()
      .select('templateId')
      .where(where)
      .orderBy('templateId', 'DESC')
      .limit(limit)
      .getRawMany();
    return await repo
      .createQueryBuilder()
      .leftJoinAndSelect(
        'template.templateAttachment',
        'templateAttachment',
        `templateAttachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .leftJoinAndSelect(
        'templateAttachment.attachment',
        'attachment',
        `attachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect(
        'attachment.metadata',
        'metadata',
        `metadata.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .where('template.templateId IN (:...ids)', { ids })
      .getMany();
  }

  async selectTemplateFromId({
    templateId,
    entityManager,
  }: Pick<
    SelectTemplate,
    'templateId' | 'entityManager'
  >): Promise<TemplateEntity> {
    const repo = this._getRepository(
      'template',
      entityManager,
    ) as Repository<TemplateEntity>;
    const qb = repo
      .createQueryBuilder('template')
      .leftJoinAndSelect(
        'template.templateAttachment',
        'templateAttachment',
        `templateAttachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .leftJoinAndSelect(
        'templateAttachment.attachment',
        'attachment',
        `attachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect(
        'attachment.metadata',
        'metadata',
        `metadata.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .where({ templateId, useYn: YN.Y });
    this.logger.debug(`qb : ${JSON.stringify(qb.getSql())}`);
    return await qb.getOne();
  }

  async insertTemplate({
    template,
    entityManager,
  }: Pick<
    InsertTemplate,
    'template' | 'entityManager'
  >)  {
      const repo = this._getRepository(
        'template',
        entityManager,
      ) as Repository<TemplateEntity>;
      return await repo.insert(template);
  }

  async bulkInsertTemplateAttachment({
    templateAttachments,
    entityManager,
  }: Pick<InsertTemplateAttachment, 'templateAttachments' | 'entityManager'>) {
    const repo = this._getRepository(
      'templateAttachment',
      entityManager,
    ) as Repository<TemplateAttachmentEntity>;
    return await repo.insert(templateAttachments);
  }

  async deleteTemplateFromId({
    templateId,
    entityManager,
  }: Pick<
    SelectTemplate,
    'templateId' | 'entityManager'
  >)  {
      const repo = this._getRepository(
        'template',
        entityManager,
      ) as Repository<TemplateEntity>;
      return await repo.update(
        {
          templateId,
        },
        {
          useYn: YN.N,
        },
      );
  }

  private _getRepository<
    T extends 'template' | 'templateAttachment' | 'attachment',
  >(
    type: T,
    entityManager?: EntityManager,
  ): T extends 'template'
    ? Repository<TemplateEntity>
    : T extends 'templateAttachment'
      ? Repository<TemplateAttachmentEntity>
      : Repository<AttachmentEntity> {
    if (type === 'template')
      return (
        entityManager
          ? entityManager.getRepository(TemplateEntity)
          : this.template
      ) as any;
    if (type === 'templateAttachment')
      return (
        entityManager
          ? entityManager.getRepository(TemplateAttachmentEntity)
          : this.templateAttachment
      ) as any;
    if (type === 'attachment')
      return (
        entityManager
          ? entityManager.getRepository(AttachmentEntity)
          : this.attachment
      ) as any;
    throw new Error('Invalid repository type');
  }
}
