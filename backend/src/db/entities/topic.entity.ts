import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('topics')
@Index(['slug'], { unique: true })
export class Topic {
  @ApiProperty({ description: '主题ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'URL友好标识符' })
  @Column({ length: 200, unique: true })
  slug: string;

  @ApiProperty({ description: '标题' })
  @Column({ length: 500 })
  title: string;

  @ApiProperty({ description: '描述' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: '语言代码' })
  @Column({ length: 10 })
  language: string;

  @ApiProperty({ description: '缩略图URL' })
  @Column({ type: 'text', nullable: true })
  thumbnailUrl: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;
}
