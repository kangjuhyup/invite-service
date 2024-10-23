import { IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class Enviroments {
  @IsString()
  @IsNotEmpty()
  WASABI_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  WASABI_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  WASABI_REGION: string;

  @IsUrl()
  @IsNotEmpty()
  WASABI_ENDPOINT: string;

  @IsString()
  @IsNotEmpty()
  THUMB_BUCKET: string;

  @IsString()
  @IsNotEmpty()
  BACKGROUND_BUCKET: string;

  @IsString()
  @IsNotEmpty()
  COMPONENT_BUCKET: string;

  @IsString()
  @IsNotEmpty()
  LETTER_BUCKET: string;
}
