import { Module } from "@nestjs/common";
import { TemplateController } from "./template.controllert";
import { TemplateFacade } from "./template.facade";
import { TemplateService } from "./service/template.service";
import { StorageModule } from "@app/storage/storage.module";
import { LetterModule } from "../letter/letter.module";

const service = [TemplateService]

@Module({
    imports : [
        StorageModule,
        LetterModule,
    ],
    controllers: [TemplateController],
    providers: [TemplateFacade, ...service],
    exports: [...service]
})
export class TemplateModule {}