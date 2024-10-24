import { Transform } from 'class-transformer';
import { IsNumber, Max } from 'class-validator';

export class PrepareRequest {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Max(10)
  componentCount: number;
}
