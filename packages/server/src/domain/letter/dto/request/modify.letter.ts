import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class ModifyLetterRequest {
    @ApiProperty({
        description: 'Title of the letter',
        maxLength: 20,
        example: 'Sample Title',
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    title?: string;
    @ApiProperty({ description: 'Body of the letter' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    body?: string;
    @ApiProperty({ description: 'Indicates if comments are allowed' })
    @IsOptional()
    @IsBoolean()
    commentYn?: boolean;
    @ApiProperty({ description: 'Indicates if attendance is required' })
    @IsOptional()
    @IsBoolean()
    attendYn?: boolean;
    @ApiProperty({ description: 'Indicates if the letter is public' })
    @IsOptional()
    @IsBoolean()
    publicYn?: boolean;
}