import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { TemplateFacade } from "./template.facade";
import { GetTemplatePageRequest } from "./dto/request/template.page";
import { UserAccessGuard } from "@app/jwt/guard/user.access.guard";
import { GetUser } from "@app/decorator/user.decorator";
import { User } from "@app/jwt/user";
import { ResponseValidationInterceptor } from "@app/interceptor/response.validation";
import { TemplateDetailResponse } from "./dto/response/template.detail";
import { GetTemplatePageResponse } from "./dto/response/template.page";
import { CreateTemplateRequest } from "./dto/request/create.template";

@Controller('template')
export class TemplateController {
    constructor(private readonly template: TemplateFacade) {}   

    @Get()
    @UseGuards(UserAccessGuard)
    @UseInterceptors(new ResponseValidationInterceptor(GetTemplatePageResponse))
    async getTemplates(
        @Query() dto: GetTemplatePageRequest,
        @GetUser() user: User,
    ) {
        return {
            result : true,
            data : await this.template.getTemplates(dto),
        }
    }

    @Get(':id')
    @UseGuards(UserAccessGuard)
    @UseInterceptors(new ResponseValidationInterceptor(TemplateDetailResponse))
    async getTemplate(
        @Param('id') id : string,
        @GetUser() user: User,
    ) {
        return {
            result : true,
            data : await this.template.getTemplateDetail(Number(id)),
        }
    }

    @Post()
    @UseGuards(UserAccessGuard)
    async createTemplate(
        @Body() dto : CreateTemplateRequest,
        @GetUser() user : User,
    ) {
        return {
            result : true,
            data : await this.template.createTemplate(dto,user),
        }
    }

    @Delete(':id')
    @UseGuards(UserAccessGuard)
    async deleteTemplate(
        @Param('id') id : string,
        @GetUser() user : User,
    ) {
        return {
            result : true,
            data : await this.template.deleteTemplate(Number(id),user),
        }
    }
}