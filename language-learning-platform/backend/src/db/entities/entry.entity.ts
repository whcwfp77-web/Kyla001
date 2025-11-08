import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Clip } from './clip.entity';
import { EntryClip } from './entry-clip.entity';

@Entity('entries')
export class Entry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  term: string;

  @Column({ type: 'varchar', length: 10 })
  language: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pronunciation?: string;

  @Column({ type: 'text' })
  meaningSummary: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  usageBucket?: string;

  @Column({ type: 'text', array: true, default: [] })
  emotionTags: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  politenessLevel?: string;

  @Column({ type: 'text', nullable: true })
  contextSummary?: string;

  @Column({ type: 'int', default: 3 })
  srsDefaultInterval: number;

  @OneToMany(() => EntryClip, (entryClip) => entryClip.entry)
  entryClips: EntryClip[];

  @ManyToMany(() => Entry)
  @JoinTable({
    name: 'entry_relations',
    joinColumn: { name: 'entry_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'related_entry_id', referencedColumnName: 'id' },
  })
  relatedEntries: Entry[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
