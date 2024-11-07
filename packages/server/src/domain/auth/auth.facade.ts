import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { MailService } from './service/mail.service';
import { SessionService } from './service/session.service';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly sessionService: SessionService,
  ) {}

  async prepareSignUp(phone: string) {
    return await this.sessionService.generateSignupSession(phone);
  }

  async signUp(phone: string, pwd: string) {
    const session = await this.sessionService.getSignupSession(phone);
    const mails = await this.mailService.getEmails(session);
    if (mails.length === 0)
      throw new ForbiddenException('인증메일이 전달되지 않았습니다.');
    const mailPhone = await this.mailService.getPhoneFromEmail(mails);
    if (phone !== mailPhone)
      throw new UnauthorizedException('휴대폰번호가 일치하지 않습니다.');
    return await this.authService.signUp(phone, pwd);
  }

  async resign(refreshToken: string) {
    return await this.authService.resign(refreshToken);
  }

  async signIn(phone: string, pwd: string) {
    //TODO: 이미 로그인되었을 경우 기존 로그인 세션 제거
    const { userId, access, refresh } = await this.authService.signIn(
      phone,
      pwd,
    );
    await this.sessionService.setSignInSession(userId, access, refresh);
    return {
      access,
      refresh,
    };
  }
}
