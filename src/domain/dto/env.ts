import { Transform } from 'class-transformer';
import { IsString, IsUrl, IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class Enviroments {
  // 애플리케이션 환경 설정
  @IsNotEmpty()
  @IsString()
  @IsIn(['development', 'production', 'test', 'local'])
  NODE_ENV: string;

  @IsNotEmpty()
  @IsString()
  WASABI_ACCESS_KEY: string;

  @IsNotEmpty()
  @IsString()
  WASABI_SECRET_KEY: string;

  @IsNotEmpty()
  @IsString()
  WASABI_REGION: string;

  @IsNotEmpty()
  @IsUrl()
  WASABI_ENDPOINT: string;

  @IsNotEmpty()
  @IsString()
  WASABI_SIGN_KEY: string;

  @IsNotEmpty()
  @IsString()
  THUMB_BUCKET: string;

  @IsNotEmpty()
  @IsString()
  BACKGROUND_BUCKET: string;

  @IsNotEmpty()
  @IsString()
  COMPONENT_BUCKET: string;

  @IsNotEmpty()
  @IsString()
  LETTER_BUCKET: string;

  @IsNotEmpty()
  @IsString()
  DB_TYPE: string;

  @IsNotEmpty()
  @IsString()
  DB_NAME: string;

  @IsNotEmpty()
  @IsString()
  DB_HOST: string;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  DB_PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_USER: string;

  @IsNotEmpty()
  @IsString()
  DB_PWD: string;

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  REDIS_PORT: number;

  @IsNotEmpty()
  @IsString()
  REDIS_PWD: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_EXPIRES: string;
}
