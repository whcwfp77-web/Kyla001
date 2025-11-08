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

@Entity('shadow_records')
@Index(['userId', 'recordedAt'])
export class ShadowRecord {
  @ApiProperty({ description: '记录ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户ID' })
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: '片段ID' })
  @Column()
  clipId: string;

  @ManyToOne(() => Clip)
  @JoinColumn({ name: 'clipId' })
  clip: Clip;

  @ApiProperty({ description: '录音时长（秒）' })
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  duration: number;

  @ApiProperty({ description: '尝试次数' })
  @Column({ type: 'int' })
  attemptNumber: number;

  @ApiProperty({ description: '匿名化波形统计' })
  @Column({ type: 'jsonb', nullable: true })
  waveformStats: {
    averageAmplitude?: number;
    peakAmplitude?: number;
    silenceDuration?: number;
    energyDistribution?: number[];
  };

  @ApiProperty({ description: '录音时间' })
  @CreateDateColumn()
  recordedAt: Date;
}
