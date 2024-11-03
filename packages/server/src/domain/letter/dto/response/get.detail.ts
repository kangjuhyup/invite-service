import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class Background {
  @ApiProperty({
    description: '배경 이미지 경로',
    example: 'https://example.com/bg.png',
  })
  @IsNotEmpty()
  @IsString()
  path: string;

  @ApiProperty({
    description: '배경 이미지 너비',
    example: 800,
  })
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @ApiProperty({
    description: '배경 이미지 높이',
    example: 1600,
  })
  @IsNotEmpty()
  @IsNumber()
  height: number;
}

class Image {
  @ApiProperty({
    description: '이미지 경로',
    example: 'https://example.com/img.png',
  })
  @IsNotEmpty()
  @IsString()
  path: string;

  @ApiProperty({
    description: '이미지 너비',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @ApiProperty({
    description: '이미지 높이',
    example: 80,
  })
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @ApiProperty({
    description: '이미지의 X 좌표',
    example: 200,
  })
  @IsNotEmpty()
  @IsNumber()
  x: number;

  @ApiProperty({
    description: '이미지의 Y 좌표',
    example: 800,
  })
  @IsNotEmpty()
  @IsNumber()
  y: number;

  @ApiProperty({
    description: '이미지의 Z 레이어',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  z: number;

  @ApiProperty({
    description: '이미지의 기울기',
    example: 90,
  })
  @IsOptional()
  @IsNumber()
  ang: number;
}

class Text {
  @ApiProperty({
    description: '텍스트 본문',
    example: 'MOCK',
  })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    description: '텍스트 크기',
    example: 18,
  })
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @ApiProperty({
    description: '텍스트의 X 좌표',
    example: 200,
  })
  @IsNotEmpty()
  @IsNumber()
  x: number;

  @ApiProperty({
    description: '텍스트의 Y 좌표',
    example: 600,
  })
  @IsNotEmpty()
  @IsNumber()
  y: number;
}

export class GetLetterDetailResponse {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    description: '배경 이미지 정보',
    type: Background,
  })
  @ValidateNested()
  @Type(() => Background)
  @IsNotEmpty()
  background: Background;

  @ApiPropertyOptional({
    description: '이미지 정보 배열',
    type: [Image],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  components?: Image[];

  @ApiPropertyOptional({
    description: '텍스트 정보 배열',
    type: [Text],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Text)
  text?: Text[];
}
