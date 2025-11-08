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

@Entity('analytics_events')
@Index(['eventType', 'occurredAt'])
@Index(['userId', 'occurredAt'])
export class AnalyticsEvent {
  @ApiProperty({ description: '事件ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户ID（可匿名）' })
  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: '事件类型' })
  @Column({ length: 100 })
  eventType: string;

  @ApiProperty({ description: '事件属性' })
  @Column({ type: 'jsonb', nullable: true })
  properties: Record<string, any>;

  @ApiProperty({ description: '发生时间' })
  @CreateDateColumn()
  occurredAt: Date;

  @ApiProperty({ description: '会话ID' })
  @Column({ length: 100, nullable: true })
  sessionId: string;
}
