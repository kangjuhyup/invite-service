import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LetterModule } from './domain/letter/letter.module';
import { ConfigModule } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { Enviroments } from './domain/dto/env';
import { validateSync } from 'class-validator';
import { StorageModule } from '@storage/storage.module';
import { DatabaseModule } from '@database/database.module';

const routers = [LetterModule];

const modules = [
  ConfigModule.forRoot({
    isGlobal: true,
    validate: (config) => {
      const validatedConfig = plainToClass(Enviroments, config, {
        enableImplicitConversion: true,
      });
      const errors = validateSync(validatedConfig);
      if (errors.length > 0) {
        throw new Error(errors.toString());
      }
      return validatedConfig;
    },
  }),
  StorageModule,
  //TODO : 운영환경 데이터베이스 세팅 완료 후 운영환경에서도 모듈 주입
  process.env.NODE_ENV !== 'production ' && DatabaseModule,
].filter(Boolean);

@Module({
  imports: [...routers, ...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
