import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Clip } from './clip.entity';

@Entity('review_cards')
export class ReviewCard {
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

  @Column({ type: 'int', default: 0 })
  interval: number; // days

  @Column({ type: 'int', default: 0 })
  repetitions: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.5 })
  easeFactor: number;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastReviewedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
