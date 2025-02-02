import { Module } from "@nestjs/common";
import { TemplateController } from "./template.controllert";
import { TemplateFacade } from "./template.facade";
import { TemplateService } from "./service/template.service";
import { StorageModule } from "@app/storage/storage.module";
import { LetterModule } from "../letter/letter.module";
import { InsertTemplateTransaction } from "./transaction/insert.transaction";

const service = [TemplateService]
const transactions = [
    InsertTemplateTransaction,
]
@Module({
    imports : [
        StorageModule,
        LetterModule,
    ],
    controllers: [TemplateController],
    providers: [TemplateFacade, ...service, ...transactions],
    exports: [...service]
})
export class TemplateModule {}