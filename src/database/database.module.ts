import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'aws-sdk';
import { LetterDataSource } from './datasource/letter.datasource';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        await LetterDataSource.initialize();
        return LetterDataSource.options;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
