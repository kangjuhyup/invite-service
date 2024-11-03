// dto/prepare-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumberString,
} from 'class-validator';

export class MetaDefault {
  @ApiProperty({ description: 'Width of the object', example: 1920 })
  @IsNotEmpty()
  @IsNumberString()
  width: string;

  @ApiProperty({ description: 'Height of the object', example: 1080 })
  @IsNotEmpty()
  @IsNumberString()
  height: string;
}

export class MetaDetail extends MetaDefault {
  @ApiProperty({
    description: 'X coordinate of the object',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  x?: string;

  @ApiProperty({
    description: 'Y coordinate of the object',
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  y?: string;

  @ApiProperty({
    description: 'Z coordinate of the object',
    example: 200,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  z?: string;

  @ApiProperty({
    description: 'Rotation angle of the object',
    example: 45,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  angle?: string;
}

export class PrepareRequest {
  @ApiProperty({ description: 'Thumbnail metadata', type: MetaDefault })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MetaDefault)
  thumbnailMeta: MetaDefault;

  @ApiProperty({ description: 'Letter metadata', type: MetaDefault })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MetaDefault)
  letterMeta: MetaDefault;

  @ApiProperty({ description: 'Background metadata', type: MetaDefault })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MetaDefault)
  backgroundMeta: MetaDefault;

  @ApiProperty({ description: 'Component metadata', type: [MetaDetail] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MetaDetail)
  @IsArray()
  componentMetas: MetaDetail[];
}
