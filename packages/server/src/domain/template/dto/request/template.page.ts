import { LetterCategoryCode } from '@app/util/category';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max } from 'class-validator';

export class GetTemplatePageRequest {
  @ApiProperty({
    description : '시작 점 탬플릿ID',
    default : 0,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  startAt?: number;

  @ApiProperty({
    description : '개수',
    default : 10,
  })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  limit: number;

  @ApiProperty({
    description: '카테고리',
    enum: Object.values(LetterCategoryCode),
  })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(LetterCategoryCode))
  category? : LetterCategoryCode

  @ApiProperty()
  @IsOptional()
  @IsString()
  title? : string;

  @ApiProperty({
    description : '사용자 ID'
  })
  @IsOptional()
  @IsUUID()
  userId? : string;
}
