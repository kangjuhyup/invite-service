import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LetterModule } from './domain/letter/letter.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { Enviroments } from './domain/dto/env';
import { validateSync } from 'class-validator';
import { RedisClientModule } from './redis/redis.module';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';

export const routers = [
  AuthModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET'),
      expiresIn: config.get<string>('JWT_EXPIRES'),
    }),
    inject: [ConfigService],
  }),
  UserModule,
  LetterModule,
];

export const modules = [
  ConfigModule.forRoot({
    isGlobal: true,
    validate: (config) => {
      const validatedConfig = plainToClass(Enviroments, config, {
        enableImplicitConversion: true,
      });
      const errors = validateSync(validatedConfig);
      if (errors.length > 0) {
        errors.map((err) => {
          console.error(err);
        });
      }

      return validatedConfig;
    },
  }),
  StorageModule,
  DatabaseModule,
  RedisClientModule.forRootAsync({
    project: 'invite-service',
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => {
      return {
        host: config.get<string>('REDIS_HOST'),
        port: config.get<number>('REDIS_PORT'),
        password: config.get<string>('REDIS_PWD'),
      };
    },
    inject: [ConfigService],
  }),
].filter(Boolean);

@Module({
  imports: [...routers, ...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
