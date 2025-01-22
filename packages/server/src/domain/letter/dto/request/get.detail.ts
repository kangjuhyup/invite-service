import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetLetterDetailRequest {
  @ApiProperty({ description: '초대장 ID', example: 1 })
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ description: '패스워드', example: '1234' })
  @Transform(({ value }) => String(value))
  @Type(() => String)
  @IsOptional()
  @IsString()
  password?: string;
}
