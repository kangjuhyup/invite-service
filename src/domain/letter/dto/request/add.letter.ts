import { ApiProperty } from '@nestjs/swagger';
import { LetterCategoryCode } from '@util/category';
import {
  IsBoolean,
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AddLetterRequest {
  @ApiProperty({
    description: 'Category of the letter',
    enum: LetterCategoryCode,
    example: LetterCategoryCode.ANNIVERSARY,
  })
  @IsDefined()
  @IsString()
  @IsIn(Object.values(LetterCategoryCode))
  category: LetterCategoryCode;

  @ApiProperty({
    description: 'Title of the letter',
    maxLength: 20,
    example: 'Sample Title',
  })
  @IsDefined()
  @IsString()
  @MaxLength(20)
  title: string;

  @ApiProperty({
    description: 'Body of the letter',
    maxLength: 255,
    example: 'This is a sample body text for the letter.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  body?: string;

  @ApiProperty({
    description: 'Indicates if comments are allowed',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  commentYn?: boolean;

  @ApiProperty({
    description: 'Indicates if attendance is required',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  attendYn?: boolean;
}
