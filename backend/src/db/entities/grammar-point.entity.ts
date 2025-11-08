import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('grammar_points')
@Index(['slug'], { unique: true })
export class GrammarPoint {
  @ApiProperty({ description: '语法点ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'URL友好标识符' })
  @Column({ length: 200, unique: true })
  slug: string;

  @ApiProperty({ description: '语言代码' })
  @Column({ length: 10 })
  language: string;

  @ApiProperty({ description: '标题' })
  @Column({ length: 500 })
  title: string;

  @ApiProperty({ description: '详细说明' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: '示例数组' })
  @Column({ type: 'jsonb' })
  examples: Array<{
    [key: string]: string;
    translation: string;
  }>;

  @ApiProperty({ description: '难度级别' })
  @Column({ length: 20, nullable: true })
  difficulty: string;

  @ApiProperty({ description: '标签' })
  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
