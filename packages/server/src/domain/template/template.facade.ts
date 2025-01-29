import { Injectable } from '@nestjs/common';
import { TemplateService } from './service/template.service';
import { GetTemplatePageRequest } from './dto/request/template.page';
import { GetTemplatePageResponse } from './dto/response/template.page';
import { TemplateDetailResponse } from './dto/response/template.detail';
import { User } from '@app/jwt/user';
import { StorageService } from '@app/storage/storage.service';
import { CreateTemplateRequest } from './dto/request/create.template';
import { LetterService } from '../letter/service/letter.service';

@Injectable()
export class TemplateFacade {

    constructor(
        private readonly letter : LetterService,
        private readonly template: TemplateService,
        private readonly storage : StorageService,
    ) {}

    async getTemplates(
        { startAt, limit }: GetTemplatePageRequest,
    ) : Promise<GetTemplatePageResponse> {
        const { totalCount, entities } = await this.template.getTemplates({ startAt, limit });
        return GetTemplatePageResponse.of(
            totalCount,
            limit,
            startAt,
            entities,
        );
    }

    async getTemplateDetail(id : number) : Promise<TemplateDetailResponse> {
        const template = await this.template.getTemplate(id);
        return TemplateDetailResponse.of(template);
    }

    async createTemplate(dto : CreateTemplateRequest, user:User) {
        // 기존 letter 의 attachment 조회하기
        const letter = await this.letter.getLetter(dto.letterId);
        // attachment의 path 를 이용해 object 복사하기
        letter.letterAttachment.map((attachment) => {
            const [bucket, key] = attachment.attachment.attachmentPath.split('/');
            this.storage.copyObject({
              sourceBucket : bucket,
              sourceKey : key,
              destinationBucket : `tmp-${bucket}`,
              destinationKey : key,
            });
        });
        // template 생성하기
        // template attachment 생성하기
    }

    async deleteTemplate(id : number, user:User) : Promise<boolean> {
        await this.template.checkTemplateAuthor(id, user.id);
        const template = await this.template.getTemplate(id);
        template.templateAttachment.map((attachment) => {
            const [bucket, key] = attachment.attachment.attachmentPath.split('/');
            this.storage.deleteObject({
              bucket,
              key,
            });
        });
        await this.template.deleteTemplate(id);
        return true;
    }
}
