import { UserAccessGuard } from "@app/jwt/guard/user.access.guard";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @UseGuards(UserAccessGuard)
    @Get()
    async getMyProfile(
        @Req() request : Request
    ) {
        const user = request.user as { id: string}
        return { result : true, data : await this.userService.getUser({
            userId : user.id
        })} 
    }
}