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
import { User } from './user.entity';
import { EntryClip } from './entry-clip.entity';

@Entity('entries')
export class Entry {
  @ApiProperty({ description: '词条ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '词条内容' })
  @Column({ length: 500 })
  term: string;

  @ApiProperty({ description: '语言代码' })
  @Column({ length: 10 })
  language: string;

  @ApiProperty({ description: '发音标注' })
  @Column({ type: 'text', nullable: true })
  pronunciation: string;

  @ApiProperty({ description: '含义摘要' })
  @Column({ type: 'text' })
  meaningSummary: string;

  @ApiProperty({ description: '关联语法点slug数组' })
  @Column({ type: 'text', array: true, nullable: true })
  grammarLinks: string[];

  @ApiProperty({ description: '考试主题标签' })
  @Column({ type: 'text', array: true, nullable: true })
  examTopics: string[];

  @ApiProperty({ description: '难度级别' })
  @Column({ length: 20, nullable: true })
  difficulty: string;

  @ApiProperty({ description: '语义向量' })
  @Column({ type: 'vector', length: 1536, nullable: true })
  embedding: number[];

  @ApiProperty({ description: '创建者ID' })
  @Column({ nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => EntryClip, (entryClip) => entryClip.entry)
  entryClips: EntryClip[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
