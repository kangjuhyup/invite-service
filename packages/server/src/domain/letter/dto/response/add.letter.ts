import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddLetterResponse {
  @IsNotEmpty()
  @IsNumber()
  letterId: number;
}
