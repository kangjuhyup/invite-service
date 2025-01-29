import { TemplateEntity } from "@app/database/entity/template/template";
import { LetterAttachmentCode } from "@app/util/attachment";

class TemplatePageItem {

    #templateId : number;
    #userId : string;
    #thumbnailUrl : string;

    static of(template: TemplateEntity) {
        const item = new TemplatePageItem();
        item.#templateId = template.templateId;
        item.#userId = template.userId;
        item.#thumbnailUrl = template.templateAttachment.find((attachment) => attachment.attachmentCode === LetterAttachmentCode.THUMBNAIL)?.attachment[0].path;        
        return item;
    }

}

export class GetTemplatePageResponse {
    #totalCount : number;
    #limit: number;
    #startAt : number;
    #templates : TemplatePageItem[]

    static of(
        totalCount: number,
        limit: number,
        startAt: number,
        templates: TemplateEntity[],
    ) {
        const response = new GetTemplatePageResponse();
        response.#totalCount = totalCount;
        response.#limit = limit;
        response.#startAt = startAt;
        response.#templates = templates.map((template) => TemplatePageItem.of(template));
        return response;
    }
}