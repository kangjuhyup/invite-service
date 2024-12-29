import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetLetterPageRequest {
  @ApiProperty({
    description: '가져올 항목의 개수 (한 페이지당 항목 수)',
    example: 10,
  })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: '건너뛸 항목의 개수 (페이징을 위한 시작점)',
    example: 0,
    required: false,
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  skip?: number;
}
