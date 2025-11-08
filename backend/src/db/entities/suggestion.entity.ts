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
import { Clip } from './clip.entity';

export enum SuggestionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('suggestions')
@Index(['status', 'submittedAt'])
export class Suggestion {
  @ApiProperty({ description: '建议ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '提交者ID' })
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: '关联片段ID（审批后创建）' })
  @Column({ nullable: true })
  clipId: string;

  @ManyToOne(() => Clip, { nullable: true })
  @JoinColumn({ name: 'clipId' })
  clip: Clip;

  @ApiProperty({ description: '状态', enum: SuggestionStatus })
  @Column({
    type: 'enum',
    enum: SuggestionStatus,
    default: SuggestionStatus.PENDING,
  })
  status: SuggestionStatus;

  @ApiProperty({ description: '建议类型' })
  @Column({ length: 50 })
  type: string;

  @ApiProperty({ description: '建议内容' })
  @Column({ type: 'jsonb' })
  content: Record<string, any>;

  @ApiProperty({ description: '提交时间' })
  @CreateDateColumn()
  submittedAt: Date;

  @ApiProperty({ description: '审核者ID' })
  @Column({ nullable: true })
  reviewedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewedBy' })
  reviewer: User;

  @ApiProperty({ description: '审核时间' })
  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @ApiProperty({ description: '审核备注' })
  @Column({ type: 'text', nullable: true })
  reviewNotes: string;
}
