import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum SearchMode {
  KEYWORD = 'keyword',
  SEMANTIC = 'semantic',
  HYBRID = 'hybrid',
}

export enum ContentType {
  ENTRY = 'entry',
  CLIP = 'clip',
  GRAMMAR = 'grammar',
}

export class SearchQueryDto {
  @ApiProperty({ description: '搜索关键词' })
  @IsString()
  q: string;

  @ApiProperty({ description: '语言过滤', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: '内容类型', required: false, enum: ContentType })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiProperty({ description: '每页数量', required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ description: '偏移量', required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiProperty({ description: '搜索模式', required: false, enum: SearchMode, default: SearchMode.HYBRID })
  @IsOptional()
  @IsEnum(SearchMode)
  mode?: SearchMode;
}
