import { TemplateEntity } from "@app/database/entity/template/template";
import { Background, Component } from "@app/domain/letter/dto/response/get.detail";
import { LetterAttachmentCode } from "@app/util/attachment";

export class TemplateDetailResponse {
    templateId : number;
    userId : string;

    background : Background;

    components : Component[]

    static of(template: TemplateEntity) {
        const response = new TemplateDetailResponse();
        response.templateId = template.templateId;
        response.userId = template.userId;
        response.background = Background.of(
            template.templateAttachment.find(
                (la) => la.attachmentCode === LetterAttachmentCode.BACKGROUND,
            )?.attachment,
        );
        response.components = template.templateAttachment
            .filter((la) => la.attachmentCode === LetterAttachmentCode.COMPONENT)
            .map((la) => Component.of(la.attachment));
        return response;   
    }
}