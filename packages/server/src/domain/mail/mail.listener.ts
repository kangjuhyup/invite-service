import { Injectable } from "@nestjs/common";
import { MailService } from "./mail.service";
import { OnEvent } from "@nestjs/event-emitter";
import { EventType } from "@app/util/event";
import { SendVerifyCodePayload } from "./dto/send.verify.code";

@Injectable()
export class MailListener {
  constructor(private readonly mailService: MailService) {}
  
  @OnEvent(EventType.SEND_VERIFY_CODE)
  handleSendVerifyCode(payload: SendVerifyCodePayload) {
    this.mailService.sendVerifyCode(payload);
  }

}