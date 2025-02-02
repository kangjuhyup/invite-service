import { Injectable, Logger } from '@nestjs/common';
import { TemplateService } from './service/template.service';
import { GetTemplatePageRequest } from './dto/request/template.page';
import { GetTemplatePageResponse } from './dto/response/template.page';
import { TemplateDetailResponse } from './dto/response/template.detail';
import { User } from '@app/jwt/user';
import { StorageService } from '@app/storage/storage.service';
import { CreateTemplateRequest } from './dto/request/create.template';
import { LetterService } from '../letter/service/letter.service';
import { InsertTemplateTransaction } from './transaction/insert.transaction';

@Injectable()
export class TemplateFacade {

    private readonly logger = new Logger(TemplateFacade.name);

    constructor(
        private readonly letter : LetterService,
        private readonly template: TemplateService,
        private readonly storage : StorageService,
        private readonly insertTemplateTransaction: InsertTemplateTransaction
    ) {}

    async getTemplates(
        { startAt, limit }: GetTemplatePageRequest,
    ) : Promise<GetTemplatePageResponse> {
        const { totalCount, entities } = await this.template.getTemplates({ startAt, limit });
        this.logger.debug(`getTemplates run : ${JSON.stringify({ totalCount, entities })}`);
        return GetTemplatePageResponse.of(
            totalCount,
            limit,
            startAt,
            entities,
        );
    }

    async getTemplateDetail(id : number) : Promise<TemplateDetailResponse> {
        const template = await this.template.getTemplate(id);
        this.logger.debug(`getTemplateDetail run : ${JSON.stringify(template)}`);
        return TemplateDetailResponse.of(template);
    }

    async createTemplate(dto : CreateTemplateRequest, user:User) {
        this.logger.debug(`createTemplate run : ${JSON.stringify(dto)}`);
        await this.letter.checkLetterAuthor(dto.letterId, user);
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
        return await this.insertTemplateTransaction.run({
            letterEntity : letter,
        })
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
