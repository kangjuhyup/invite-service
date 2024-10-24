import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class PrepareResponse {
  @ApiProperty({
    description: '썸네일 업로드 권한이 열려있는 url',
    example:
      'https://s3.ap-northeast-1.wasabisys.com/bucket/file.txt?AWSAccessKeyId=...',
  })
  @IsNotEmpty()
  @IsUrl()
  thumbnailUrl: string;

  @ApiProperty({
    description: '배경 업로드 권한이 열려있는 url',
    example:
      'https://s3.ap-northeast-1.wasabisys.com/bucket/file.txt?AWSAccessKeyId=...',
  })
  @IsNotEmpty()
  @IsUrl()
  backgroundUrl: string;

  @ApiProperty({
    description: '아이템 업로드 권한이 열려있는 url',
    example:
      '[https://s3.ap-northeast-1.wasabisys.com/bucket/file.txt?AWSAccessKeyId=...]',
  })
  @IsOptional()
  @IsArray()
  @IsUrl({},{each:true})
  componentUrls: string[];

  @ApiProperty({
    description: 'url 만료 기간',
    example: 60,
  })
  @IsNotEmpty()
  @IsNumber()
  expires: number;
}
