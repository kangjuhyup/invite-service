import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SendVerifyCodePayload } from "./dto/send.verify.code";
import { VerifyCodePayload } from "./dto/verify.code";
import { MailService } from "./mail.service";
import { EventType } from "@app/util/event";
import { UserNotExistGuard } from "@app/jwt/guard/user.exist.guard";

@Controller('mail')
@ApiTags('Mail')
export class MailController {
    constructor(
        private readonly mailService: MailService,
        private readonly eventEmitter: EventEmitter2,
    ) {}
    @ApiOperation({
        summary: '인증 코드 전송',
        description: '이메일로 인증 코드를 전송합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '인증 코드 전송 성공',
    })
    @Get('verify')
    @UseGuards(UserNotExistGuard)
    getVerifyCode(@Query('email') email: string) {
        // 이벤트 발행
        this.eventEmitter.emit(EventType.SEND_VERIFY_CODE, { email });
        return {
            result: true,
            data : '인증 코드가 전송되었습니다.',
        };
    }

    @ApiOperation({
        summary: '인증 코드 확인',
        description: '입력한 인증 코드를 확인합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '인증 코드 확인 성공',
    })
    @Post('verify')
    async verifyCode(@Body() payload: VerifyCodePayload) {
        const isVerified = await this.mailService.verifyCode(payload);
        return {
            result: isVerified,
            data: isVerified ? '인증이 완료되었습니다.' : '인증에 실패했습니다.',
        };
    }
}