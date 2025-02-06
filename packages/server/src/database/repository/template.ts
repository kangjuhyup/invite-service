import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { AttachmentEntity } from '../entity/attachment/attachment';
import { TemplateEntity } from '../entity/template/template';
import { TemplateAttachmentEntity } from '../entity/template/template.attachment';
import { YN } from '@app/util/yn';
import { DefaultColumn } from '../column/default';
import { InsertTemplate, InsertTemplateAttachment, InsertTemplateTotal, SelectTemplate } from './param/template';
import { TemplateColumn } from '../column/template.column';
import { AttachmentColumn } from '../column/attachment.column';
import { TemplateTotalEntity } from '../entity/template/template.total';

export class TemplateRepository {
  private readonly logger = new Logger(TemplateRepository.name);

  constructor(
    @InjectRepository(TemplateEntity)
    private readonly template: Repository<TemplateEntity>,
    @InjectRepository(TemplateAttachmentEntity)
    private readonly templateAttachment: Repository<TemplateAttachmentEntity>,
    @InjectRepository(AttachmentEntity)
    private readonly attachment: Repository<AttachmentEntity>,
    @InjectRepository(TemplateTotalEntity)
    private readonly templateTotal: Repository<TemplateTotalEntity>,
  ) {}

  async selectTemplateTotalCount(
    { category, title, userId, entityManager }: Pick<SelectTemplate, 'category' | 'title' | 'userId' | 'entityManager'>,
  ): Promise<number> {
    const repo = this._getRepository('template', entityManager);
    const where = {
      useYn : YN.Y,
    }
    if (category) {
      where['category'] = category;
    }
    if (title) {
      where['title'] = title;
    }
    if (userId) {
      where['userId'] = userId;
    }
    return await repo.count({
      where,
    });
  }

  async selectTemplates({
    startAt,
    limit,
    category,
    title,
    userId,
    entityManager,
  }: Pick<SelectTemplate, 'startAt' | 'limit' | 'category' | 'title' | 'userId' | 'entityManager'>): Promise<
    TemplateEntity[]
  > {
    console.log(category);
    const repo = this._getRepository(
      'template',
      entityManager,
    ) as Repository<TemplateEntity>;
    const where = { useYn: YN.Y };
    if (startAt) {
      where['templateId'] = MoreThanOrEqual(startAt);
    }
    if (category) {
      where['category'] = category;
    }
    if (title) {
      where['title'] = Like(`%${title}%`);
    }
    if (userId) {
      where['userId'] = userId;
    }
    const baseTemplates = (await repo
      .createQueryBuilder()
      .select([TemplateColumn.templateId])
      .where(where)
      .orderBy(TemplateColumn.templateId, 'DESC')
      .limit(limit)
      .getRawMany());

    const ids = baseTemplates.map((template) => template[TemplateColumn.templateId]);
    console.log(baseTemplates);
    if(ids.length === 0) return [];
    else return await repo
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
      .leftJoinAndSelect(
        'attachment.metadata',
        'metadata',
        `metadata.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect('template.templateTotal','templateTotal')
      .where(`template.${TemplateColumn.templateId} IN (:...ids)`, { ids })
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
      .leftJoinAndSelect(
        'attachment.metadata',
        'metadata',
        `metadata.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .where({ templateId, useYn: YN.Y });
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
    return await repo.createQueryBuilder().insert().values(templateAttachments).execute();
  }

  async insertTemplateTotal({
    templateTotal,
    entityManager,
  }: Pick<
    InsertTemplateTotal,
    'templateTotal' | 'entityManager'
  >)  {
      const repo = this._getRepository(
        'templateTotal',
        entityManager,
      ) as Repository<TemplateTotalEntity>;
      return await repo.insert(templateTotal);
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
    T extends 'template' | 'templateAttachment' | 'attachment' | 'templateTotal',
  >(
    type: T,
    entityManager?: EntityManager,
  ): T extends 'template'
    ? Repository<TemplateEntity>
    : T extends 'templateAttachment'
      ? Repository<TemplateAttachmentEntity>
      : T extends 'templateTotal'
      ? Repository<TemplateTotalEntity>
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
    if (type === 'templateTotal')
      return (
        entityManager
          ? entityManager.getRepository(TemplateTotalEntity)
          : this.templateTotal
      ) as any;
    throw new Error('Invalid repository type');
  }
}
