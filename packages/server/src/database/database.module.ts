import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LetterDataSource } from './datasource/letter.datasource';
import { Enviroments } from 'packages/server/src/domain/dto/env';
import { plainToInstance } from 'class-transformer';
import { LetterRepository } from './repository/letter';
import { UserRepository } from './repository/user';
import { LetterEntity } from './entity/letter';
import { UserEntity } from './entity/user';
import { LetterAttachmentEntity } from './entity/letter.attachment';
import { AttachmentEntity } from './entity/attachment';
import { AttachmentRepository } from './repository/attachment';

const repositories = [LetterRepository, AttachmentRepository, UserRepository];

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
      UserEntity,
      LetterEntity,
      LetterAttachmentEntity,
      AttachmentEntity,
    ]),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class DatabaseModule {}
