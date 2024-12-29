import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { MailService } from './service/mail.service';
import { SessionService } from './service/session.service';
import { UserService } from '../user/user.service';
import { randomString } from '@app/util/random';
import { GoogleService } from '../google/google.service';

@Injectable()
export class AuthFacade {
  private logger = new Logger(AuthFacade.name);
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly sessionService: SessionService,
    private readonly googleService: GoogleService,
  ) {}

  async prepareSignUp(phone: string) {
    return await this.sessionService.generateSignupSession(phone);
  }

  async signUp(phone: string, pwd: string, mail?: string) {
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

  async signIn(email: string, pwd: string) {
    //TODO: 이미 로그인되었을 경우 기존 로그인 세션 제거
    const { userId, access, refresh } = await this.authService.signIn(
      email,
      pwd,
    );
    await this.sessionService.setSignInSession(userId, access, refresh);
    return {
      access,
      refresh,
    };
  }

  async signInWithGoogle(authCode: string) {
    const email = await this.googleService.getEmailFromCode(authCode);
    this.logger.debug(`email : ${JSON.stringify(email)}`);
    const user = await this.userService
      .getUser({ email })
      .catch(async (err) => {
        if (err instanceof UnauthorizedException) {
          return await this.userService.saveUser(email, randomString(10));
        }
        throw err;
      });
    return this.signIn(user.email, user.password);
  }
}
