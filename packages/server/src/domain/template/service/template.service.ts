import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TemplateRepository } from '../../../database/repository/template';
import { GetTemplatePageRequest } from '../dto/request/template.page';
import { TemplateEntity } from '@app/database/entity/template/template';

@Injectable()
export class TemplateService {

    constructor(
        private readonly templateRepository : TemplateRepository,
    ) {}

    async getTemplates(
        { startAt, limit }: GetTemplatePageRequest,
    ) : Promise<{ totalCount : number, entities : TemplateEntity[] }> {
        return {
            totalCount : await this.templateRepository.selectTemplateTotalCount(),
            entities : await this.templateRepository.selectTemplates({ startAt, limit }),
        };
    }

    async getTemplate(
        templateId : number,
    ) : Promise<TemplateEntity> {
        return await this.templateRepository.selectTemplateFromId({ templateId });
    }

    async deleteTemplate(
        templateId : number,
    ) {
        await this.templateRepository.deleteTemplateFromId({ templateId });
    }

    async checkTemplateAuthor(
        templateId : number,
        userId : string,
    ) : Promise<boolean> {
        const template = await this.templateRepository.selectTemplateFromId({ templateId });
        if(template.userId !== userId) throw new UnauthorizedException('탬플릿 작성자가 아닙니다.');
        return true;
    }
}
