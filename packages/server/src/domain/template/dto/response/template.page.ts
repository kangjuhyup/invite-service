import { TemplateEntity } from "@app/database/entity/template/template";
import { LetterAttachmentCode } from "@app/util/attachment";
import { LetterCategoryCode } from "@app/util/category";

class TemplatePageItem {

    templateId : number;
    title : string;
    category : LetterCategoryCode;
    userId : string;
    thumbnailUrl : string;
    forkCount : number;
    viewCount : number;

    static of(template: TemplateEntity) {
        const item = new TemplatePageItem();
        item.templateId = template.templateId;
        item.userId = template.userId;
        item.title = template.title;
        item.category = template.category;
        item.thumbnailUrl = template.templateAttachment.find((attachment) => attachment.attachmentCode === LetterAttachmentCode.THUMBNAIL)?.attachment.attachmentPath;    
        item.forkCount = template.templateTotal.forkCount;
        item.viewCount = template.templateTotal.viewCount;    
        return item;
    }

}

export class GetTemplatePageResponse {
    totalCount : number;
    limit: number;
    startAt : number;
    templates : TemplatePageItem[]

    static of(
        totalCount: number,
        limit: number,
        startAt: number,
        templates: TemplateEntity[],
    ) {
        const response = new GetTemplatePageResponse();
        response.totalCount = totalCount;
        response.limit = limit;
        response.startAt = startAt;
        response.templates = templates.map((template) => TemplatePageItem.of(template));
        return response;
    }
}