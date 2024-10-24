import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LetterDataSource } from './datasource/letter.datasource';
import { Enviroments } from '@app/domain/dto/env';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config:ConfigService) => {

        const env = plainToInstance(Enviroments,process.env, {
            enableImplicitConversion : true,
        });
        const ds = LetterDataSource({ 
            type: env.DB_TYPE,
            host: env.DB_HOST,
            port: env.DB_PORT,
            database: env.DB_NAME,
            username: env.DB_USER,
            password: env.DB_PWD,
            synchronize : false,
        })
        await ds.initialize(); 
        return ds.options;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
