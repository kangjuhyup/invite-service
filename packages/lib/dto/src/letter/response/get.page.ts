import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LetterCategoryCode } from '@lib/util';

class LetterPageItem {
  @ApiProperty({
    description: '초대장 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '초대장 제목',
    example: '생일파티 초대',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '카테고리',
    example: LetterCategoryCode.ANNIVERSARY,
    enum: Object.values(LetterCategoryCode),
  })
  @IsNotEmpty()
  @IsIn(Object.values(LetterCategoryCode))
  category: LetterCategoryCode;

  @ApiProperty({
    description: '썸네일 이미지 경로',
    example: 'https://s3.ap-northeast-1.wasabisys.com/thm/00001',
  })
  @IsNotEmpty()
  @IsString()
  thumbnail: string;
}

export class GetLetterPageResponse {
  @ApiProperty({
    description: '초대장 총 개수',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: '초대장 정보 목록',
    type: [LetterPageItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LetterPageItem)
  items: LetterPageItem[];
}
