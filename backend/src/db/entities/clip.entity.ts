import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Media } from './media.entity';
import { User } from './user.entity';
import { EntryClip } from './entry-clip.entity';

@Entity('clips')
export class Clip {
  @ApiProperty({ description: '片段ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '所属媒体ID' })
  @Column()
  mediaId: string;

  @ManyToOne(() => Media, (media) => media.clips)
  @JoinColumn({ name: 'mediaId' })
  media: Media;

  @ApiProperty({ description: '开始时间（毫秒）' })
  @Column({ type: 'int' })
  startTime: number;

  @ApiProperty({ description: '结束时间（毫秒）' })
  @Column({ type: 'int' })
  endTime: number;

  @ApiProperty({ description: '时长（秒）' })
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  duration: number;

  @ApiProperty({ description: '原文字幕' })
  @Column({ type: 'text' })
  originalSubtitle: string;

  @ApiProperty({ description: '多语言翻译' })
  @Column({ type: 'jsonb' })
  translations: {
    zh?: string;
    en?: string;
    ko?: string;
    ja?: string;
  };

  @ApiProperty({ description: '情感标签' })
  @Column({ type: 'text', array: true, nullable: true })
  emotionTags: string[];

  @ApiProperty({ description: '礼貌程度' })
  @Column({ length: 50, nullable: true })
  politenessLevel: string;

  @ApiProperty({ description: '场景描述' })
  @Column({ type: 'text', nullable: true })
  contextSummary: string;

  @ApiProperty({ description: '说话者名称' })
  @Column({ type: 'text', array: true, nullable: true })
  speakers: string[];

  @ApiProperty({ description: '是否适合跟读' })
  @Column({ default: false })
  shadowLabReady: boolean;

  @ApiProperty({ description: '缩略图URL' })
  @Column({ type: 'text', nullable: true })
  thumbnailUrl: string;

  @ApiProperty({ description: '语义向量' })
  @Column({ type: 'vector', length: 1536, nullable: true })
  embedding: number[];

  @ApiProperty({ description: '创建者ID' })
  @Column({ nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => EntryClip, (entryClip) => entryClip.clip)
  entryClips: EntryClip[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
