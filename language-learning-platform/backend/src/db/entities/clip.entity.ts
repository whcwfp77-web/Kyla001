import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Media } from './media.entity';
import { EntryClip } from './entry-clip.entity';
import { ReviewCard } from './review-card.entity';
import { ShadowRecord } from './shadow-record.entity';

@Entity('clips')
export class Clip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  mediaId: string;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @Column({ type: 'int' })
  startTimeMs: number;

  @Column({ type: 'int' })
  endTimeMs: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  durationSec: number;

  @Column({ type: 'text' })
  originalSubtitle: string;

  @Column({ type: 'jsonb', nullable: true })
  translations?: Record<string, string>;

  @Column({ type: 'text', array: true, default: [] })
  speakers: string[];

  @Column({ type: 'text', nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'varchar', length: 50, default: 'embed' })
  embedPolicy: 'embed' | 'external_redirect' | 'self_hosted';

  @Column({ type: 'text', nullable: true })
  embedUrl?: string;

  @Column({ type: 'text', nullable: true })
  redirectUrl?: string;

  @Column({ type: 'boolean', default: false })
  shadowLabReady: boolean;

  @Column({ type: 'text', array: true, default: [] })
  replacementVariants: string[];

  @Column({ type: 'text', array: true, default: [] })
  grammarLinks: string[];

  @Column({ type: 'text', array: true, default: [] })
  examTopics: string[];

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 50, default: 'manual' })
  ingestSource: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  reviewStatus: 'pending' | 'approved' | 'flagged';

  @Column({ type: 'varchar', length: 255, nullable: true })
  auditor?: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'vector', dimension: 1536, nullable: true })
  embedding?: number[];

  @OneToMany(() => EntryClip, (entryClip) => entryClip.clip)
  entryClips: EntryClip[];

  @OneToMany(() => ReviewCard, (reviewCard) => reviewCard.clip)
  reviewCards: ReviewCard[];

  @OneToMany(() => ShadowRecord, (shadowRecord) => shadowRecord.clip)
  shadowRecords: ShadowRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
