import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LetterEntity } from '@app/database/entity/letter/letter';
import { LetterAttachmentEntity } from '@app/database/entity/letter/letter.attachment';
import { LetterAttachmentCode } from '@app/util/attachment';
import { AttachmentEntity } from '@app/database/entity/attachment/attachment';

export class Background {
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

  static of(attachment: AttachmentEntity) {
    const bg = new Background();
    bg.path = attachment.attachmentPath;
    bg.width = attachment.metadata.width;
    bg.height = attachment.metadata.height;
    return bg;
  }
}

export class Component {
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
  @IsString()
  x: string;

  @ApiProperty({
    description: '이미지의 Y 좌표',
    example: 800,
  })
  @IsNotEmpty()
  @IsString()
  y: string;

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
  @IsString()
  ang: string;

  @ApiProperty({
    description: '텍스트 폰트 종류',
    example: 'Arial',
    required: false,
  })
  @IsOptional()
  @IsString()
  font?: string;
  @ApiProperty({
    description: '텍스트 색상',
    example: 'rgb(255, 0, 0)',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: '텍스트 볼드 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  bold?: boolean;

  static of(attachment: AttachmentEntity) {
    const img = new Component();
    img.path = attachment.attachmentPath;
    img.width = attachment.metadata.width;
    img.height = attachment.metadata.height;
    img.x = attachment.metadata.x;
    img.y = attachment.metadata.y;
    img.z = attachment.metadata.z;
    img.ang = attachment.metadata.angle;
    img.font = attachment.metadata.font
      ? decodeURIComponent(attachment.metadata.font)
      : undefined;
    img.color = attachment.metadata.color;
    img.bold = attachment.metadata.bold;
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
    type: [Component],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Component)
  components?: Component[];

  static of(letter: LetterEntity) {
    const response = new GetLetterDetailResponse();
    response.title = letter.title;
    response.body = letter.body;
    response.background = Background.of(
      letter.letterAttachment.find(
        (la) => la.attachmentCode === LetterAttachmentCode.BACKGROUND,
      )?.attachment,
    );
    response.components = letter.letterAttachment
      .filter((la) => la.attachmentCode === LetterAttachmentCode.COMPONENT)
      .map((la) => Component.of(la.attachment));
    return response;
  }
}
