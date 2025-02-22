import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { verifyTemplate } from './template/verify.template';
import { ConfigService } from '@nestjs/config';
import { RedisClientService } from '../../redis/redis.client.service';
import { SendVerifyCodePayload } from './dto/send.verify.code';
import { VerifyCodePayload } from './dto/verify.code';
import { randomNumber, randomString } from '@app/util/random';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  private readonly SERVICE_NAME = 'mail';
  private readonly VERIFY_TTL = 180; // 3분

  constructor(
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
    private readonly redisClient: RedisClientService,
  ) {}

  /**
   * 인증코드 전송
   */
  async sendVerifyCode({email} : SendVerifyCodePayload) {
    try {
      const key = this.getVerifyKey(email);
      if(await this.redisClient.get(key)) {
        throw new BadRequestException('인증메일이 이미 전송되었습니다.');
      }

      // 인증코드 생성
      const verificationCode = randomNumber(5);
      
      // 이메일 템플릿 생성
      const html = verifyTemplate({
        code: verificationCode,
        expireMinutes: 3, // 3분 후 만료
      });

      // 이메일 전송
      await this.mailer.sendMail({
        to: email,
        subject: '[Invite] 이메일 인증코드',
        html,
      });

      // Redis에 인증코드 저장
      
      await this.redisClient.set(key, verificationCode, this.VERIFY_TTL);

      return true;
    } catch (error) {
      this.logger.error(`인증코드 전송 실패: ${error.message}`);
      throw new BadRequestException('인증코드 전송에 실패했습니다.');
    }
  }

  async verifyCode({email, code}: VerifyCodePayload) {
    try {
      const key = this.getVerifyKey(email);
      const savedCode = await this.redisClient.get<string>(key);
      this.logger.debug(`savedCode : ${savedCode} , code : ${code}`);    
      if (!savedCode) {
        throw new BadRequestException('인증코드가 만료되었습니다.');
      }

      if (savedCode !== code) {
        throw new BadRequestException('인증코드가 일치하지 않습니다.');
      }

      await this.redisClient.set(key, 'verified', this.VERIFY_TTL)
      return true;
    } catch (error) {
      this.logger.error(`인증코드 확인 실패: ${error.message}`);
      throw error;
    }
  }

getVerifyKey(email: string): string {
    return this.redisClient.generateKey(this.SERVICE_NAME, `verify:${email}`);
  }
}