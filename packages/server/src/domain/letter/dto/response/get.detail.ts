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
import { LetterEntity } from '@app/database/entity/letter';
import { LetterAttachmentEntity } from '@app/database/entity/letter.attachment';
import { LetterAttachmentCode } from '@app/util/attachment';

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

  static of(letterAttachment: LetterAttachmentEntity) {
    const bg = new Background();
    bg.path = letterAttachment.attachment.attachmentPath;
    bg.width = letterAttachment.width;
    bg.height = letterAttachment.height;
    return bg;
  }
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

  static of(letterAttachment: LetterAttachmentEntity) {
    const img = new Image();
    img.path = letterAttachment.attachment.attachmentPath;
    img.width = letterAttachment.width;
    img.height = letterAttachment.height;
    img.x = letterAttachment.x;
    img.y = letterAttachment.y;
    img.z = letterAttachment.z;
    img.ang = letterAttachment.angle;
    return img;
  }
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

  static of(letter: LetterEntity) {
    const response = new GetLetterDetailResponse();
    response.title = letter.title;
    response.body = letter.body;
    response.background = Background.of(
      letter.letterAttachment.find(
        (la) => la.attachmentCode === LetterAttachmentCode.BACKGROUND,
      ),
    );
    response.components = letter.letterAttachment
      .filter((la) => la.attachmentCode === LetterAttachmentCode.COMPONENT)
      .map((la) => Image.of(la));
    return response;
  }
}
