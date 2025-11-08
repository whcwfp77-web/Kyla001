import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Entry } from './entry.entity';

@Entity('review_cards')
@Index(['userId', 'nextReviewAt'])
export class ReviewCard {
  @ApiProperty({ description: '卡片ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户ID' })
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: '词条ID' })
  @Column()
  entryId: string;

  @ManyToOne(() => Entry)
  @JoinColumn({ name: 'entryId' })
  entry: Entry;

  @ApiProperty({ description: '复习间隔（天数）' })
  @Column({ type: 'int', default: 1 })
  interval: number;

  @ApiProperty({ description: '下次复习时间' })
  @Column({ type: 'timestamp' })
  nextReviewAt: Date;

  @ApiProperty({ description: '复习次数' })
  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @ApiProperty({ description: '最后复习时间' })
  @Column({ type: 'timestamp', nullable: true })
  lastReviewedAt: Date;

  @ApiProperty({ description: '简易因子（SM-2算法）' })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 2.5 })
  easeFactor: number;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;
}
