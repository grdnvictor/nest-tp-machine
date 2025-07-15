import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Le Petit Prince' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Antoine de Saint-Exupéry' })
  @IsString()
  author: string;

  @ApiPropertyOptional({ example: '9782070408504' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ example: 'Fiction' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ example: 'Un conte poétique et philosophique...' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AddToCollectionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  bookId: number;

  @ApiProperty({ enum: BookStatus, example: BookStatus.TO_READ })
  @IsEnum(BookStatus)
  status: BookStatus;

  @ApiPropertyOptional({ example: 4, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 'Un livre magnifique!' })
  @IsOptional()
  @IsString()
  review?: string;
}

export class UpdateUserBookDto {
  @ApiPropertyOptional({ enum: BookStatus })
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  review?: string;
}