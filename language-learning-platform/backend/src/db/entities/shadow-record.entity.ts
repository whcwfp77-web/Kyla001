import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Clip } from './clip.entity';

@Entity('shadow_records')
export class ShadowRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  clipId: string;

  @ManyToOne(() => Clip)
  @JoinColumn({ name: 'clip_id' })
  clip: Clip;

  @Column({ type: 'jsonb' })
  metrics: {
    duration: number;
    pitchContour?: number[];
    waveformStats?: {
      peaks: number[];
      valleys: number[];
    };
    accuracy?: number;
  };

  @Column({ type: 'text', nullable: true })
  audioUrl?: string;

  @CreateDateColumn()
  createdAt: Date;
}
