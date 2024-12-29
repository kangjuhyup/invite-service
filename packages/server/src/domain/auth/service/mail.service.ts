import {
  BadRequestException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as Imap from 'node-imap';

export class MailService implements OnModuleDestroy, OnModuleInit {
  private logger = new Logger(MailService.name);
  private imap;

  constructor() {
    this.imap = new Imap({
      user: 'fog0510@gmail.com',
      password: 'aswc gpfo djix skbv',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { servername: 'imap.gmail.com' },
    });
  }

  onModuleInit() {
    this.imap.once('ready', () => {
      this.openInbox('INBOX')
        .then(() => this.logger.log('INBOX 열기 성공'))
        .catch((err) => this.logger.error(`INBOX 열기 실패: ${err.message}`));
    });

    this.imap.once('error', (err) => {
      this.logger.error('IMAP 연결 오류:', err.message);
    });

    this.imap.connect();
  }

  onModuleDestroy() {
    this.imap.end();
  }

  private openInbox(boxName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(boxName, true, (err) => {
        if (err) reject(new Error(err.message));
        else resolve();
      });
    });
  }

  getEmails(session: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.imap.search(['ALL', ['BODY', session]], (err, mails) => {
        if (err) reject(new Error(err.message));
        else resolve(mails);
      });
    });
  }

  getPhoneFromEmail(mails) {
    return new Promise((resolve, reject) => {
      const fetch = this.imap.fetch(mails, { bodies: 'HEADER' });
      fetch.on('message', (msg) => {
        msg.on('body', (stream) => {
          let buffer = '';
          stream.on('data', (chunk) => {
            buffer += chunk.toString('utf8');
          });

          stream.once('end', () => {
            const fromAddress = Imap.parseHeader(buffer, false).from[0];
            const fromPhone = fromAddress.substring(
              fromAddress.indexOf('<0') + 1,
              fromAddress.indexOf('@'),
            );
            const fromDomain = fromAddress.substring(
              fromAddress.indexOf('@') + 1,
              fromAddress.indexOf('m>') + 1,
            );

            if (
              fromDomain === 'vmms.nate.com' ||
              fromDomain === 'ktfmms.magicn.com' ||
              fromDomain === 'lguplus.com'
            ) {
              resolve(fromPhone);
            } else {
              reject(new BadRequestException(`Invalid domain : ${fromDomain}`));
            }
          });
        });
      });

      fetch.once('error', (err) => reject(err));
    });
  }
}
