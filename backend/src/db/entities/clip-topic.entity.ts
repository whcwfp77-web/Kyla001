import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Clip } from './clip.entity';
import { Topic } from './topic.entity';

@Entity('clip_topics')
export class ClipTopic {
  @ApiProperty({ description: '片段ID' })
  @PrimaryColumn()
  clipId: string;

  @ApiProperty({ description: '主题ID' })
  @PrimaryColumn()
  topicId: string;

  @ManyToOne(() => Clip)
  @JoinColumn({ name: 'clipId' })
  clip: Clip;

  @ManyToOne(() => Topic)
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;
}
