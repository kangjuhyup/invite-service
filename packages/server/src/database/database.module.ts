import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { LetterRepository } from './repository/letter';
import { UserRepository } from './repository/user';
import { LetterEntity } from './entity/letter/letter';
import { UserEntity } from './entity/user/user';
import { LetterAttachmentEntity } from './entity/letter/letter.attachment';
import { AttachmentEntity } from './entity/attachment/attachment';
import { AttachmentRepository } from './repository/attachment';
import { Enviroments } from '@app/domain/dto/env';
import { LetterCommentEntity } from './entity/letter/letter.comment';
import { UserAttachmentEntity } from './entity/user/user.attachment';
import { TemplateEntity } from './entity/template/template';
import { TemplateAttachmentEntity } from './entity/template/template.attachment';
import { MetadataEntity } from './entity/attachment/metadata';
import { TemplateRepository } from './repository/template';
import { LetterDataSource } from './datasource/letter.datasource';
import { LetterTotalEntity } from './entity/letter/letter.total';
import { TemplateTotalEntity } from './entity/template/template.total';

const repositories = [LetterRepository, AttachmentRepository, UserRepository, TemplateRepository];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const env = plainToInstance(Enviroments, process.env, {
          enableImplicitConversion: true,
        });
        const ds = LetterDataSource({
          type: env.DB_TYPE,
          host: env.DB_HOST,
          port: env.DB_PORT,
          database: env.DB_NAME,
          username: env.DB_USER,
          password: env.DB_PWD,
          synchronize: false,
        });
        await ds.initialize();
        return ds.options;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      AttachmentEntity,
      MetadataEntity,
      UserEntity,
      UserAttachmentEntity,
      LetterEntity,
      LetterAttachmentEntity,
      LetterCommentEntity,
      LetterTotalEntity,
      TemplateEntity,
      TemplateAttachmentEntity,
      TemplateTotalEntity,
    ]),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class DatabaseModule {}
