import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Entry } from './entry.entity';
import { Clip } from './clip.entity';

@Entity('entry_clips')
export class EntryClip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  entryId: string;

  @ManyToOne(() => Entry)
  @JoinColumn({ name: 'entry_id' })
  entry: Entry;

  @Column({ type: 'uuid' })
  clipId: string;

  @ManyToOne(() => Clip)
  @JoinColumn({ name: 'clip_id' })
  clip: Clip;

  @CreateDateColumn()
  createdAt: Date;
}
