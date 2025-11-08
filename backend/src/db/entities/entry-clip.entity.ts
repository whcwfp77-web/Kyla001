import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Entry } from './entry.entity';
import { Clip } from './clip.entity';
import { User } from './user.entity';

export enum UsageBucket {
  LITERAL = 'literal',
  METAPHOR = 'metaphor',
  SLANG = 'slang',
  POLITE = 'polite',
  DIALECT = 'dialect',
}

@Entity('entry_clips')
export class EntryClip {
  @ApiProperty({ description: '词条ID' })
  @PrimaryColumn()
  entryId: string;

  @ApiProperty({ description: '片段ID' })
  @PrimaryColumn()
  clipId: string;

  @ApiProperty({ description: '用法分类' })
  @PrimaryColumn({
    type: 'enum',
    enum: UsageBucket,
  })
  usageBucket: UsageBucket;

  @ManyToOne(() => Entry, (entry) => entry.entryClips)
  @JoinColumn({ name: 'entryId' })
  entry: Entry;

  @ManyToOne(() => Clip, (clip) => clip.entryClips)
  @JoinColumn({ name: 'clipId' })
  clip: Clip;

  @ApiProperty({ description: '相关性评分' })
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  relevanceScore: number;

  @ApiProperty({ description: '创建者ID' })
  @Column({ nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;
}
