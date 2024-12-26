import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class Letter {
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
}

class Comment {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  body: string;
}

export class GetLetterResponse {
  @ApiProperty({
    description: '초대장 ID',
  })
  @IsNotEmpty()
  @IsNumber()
  letterId: number;
  @ApiProperty({
    description: '배경 이미지 정보',
    type: Letter,
  })
  @ValidateNested()
  @Type(() => Letter)
  @IsNotEmpty()
  letter: Letter;

  @ApiProperty({
    description: '댓글 목록',
    type: Array<Comment>,
  })
  @ValidateNested({ each: true })
  @Type(() => Comment)
  @IsNotEmpty()
  comments: Array<Comment>;
}
