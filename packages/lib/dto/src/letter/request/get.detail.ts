import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetLetterDetailRequest {
  @ApiProperty({ description: '초대장 ID', example: 1 })
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
