import { forwardRef, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CommentModule } from '../comment/comment.module';
import { MailService } from './mail.service';
import { UserModule } from '../user/user.module';
import { MailListener } from './mail.listener';
import { MailController } from './mail.controller';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: config.get<string>('GMAIL_ACCOUNT'),
            pass: config.get<string>('GMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        preview: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers : [MailController],
  providers: [MailService, MailListener],
  exports: [MailService],
})
export class MailModule {}