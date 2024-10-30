import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Max } from 'class-validator';

export class PrepareRequest {
  @ApiProperty({
    description: '아이템 개수 ( 이미지, 텍스트 모두 )',
    example: 10,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Max(10)
  componentCount: number;
}
