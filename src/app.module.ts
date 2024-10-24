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
  DatabaseModule,
].filter(Boolean);

@Module({
  imports: [...routers, ...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
