import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Clip } from './clip.entity';

export enum SourceType {
  EMBED = 'embed',
  EXTERNAL_REDIRECT = 'external_redirect',
  SELF_HOSTED = 'self_hosted',
}

@Entity('media')
export class Media {
  @ApiProperty({ description: '媒体ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '媒体标题' })
  @Column({ length: 500 })
  title: string;

  @ApiProperty({ description: '平台名称' })
  @Column({ length: 100 })
  platform: string;

  @ApiProperty({ description: '来源类型', enum: SourceType })
  @Column({
    type: 'enum',
    enum: SourceType,
  })
  sourceType: SourceType;

  @ApiProperty({ description: '嵌入策略配置' })
  @Column({ type: 'jsonb' })
  embedPolicy: {
    allowed: boolean;
    provider: string;
    restrictions: string[];
    embedUrl?: string;
    redirectUrl?: string;
  };

  @ApiProperty({ description: '合规说明' })
  @Column({ type: 'text' })
  complianceNotes: string;

  @ApiProperty({ description: '官方链接' })
  @Column({ type: 'text', nullable: true })
  officialUrl: string;

  @ApiProperty({ description: '主要语言' })
  @Column({ length: 10 })
  language: string;

  @ApiProperty({ description: '发布日期' })
  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @OneToMany(() => Clip, (clip) => clip.media)
  clips: Clip[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
