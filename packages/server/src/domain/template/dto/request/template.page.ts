import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max } from 'class-validator';

export class GetTemplatePageRequest {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  startAt?: number;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  limit: number;
}
