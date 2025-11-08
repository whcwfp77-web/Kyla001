import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Clip } from './clip.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  platform: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  seasonEpisode?: string;

  @Column({ type: 'date', nullable: true })
  publicationDate?: Date;

  @Column({ type: 'varchar', length: 50 })
  mediaType: 'embed' | 'external_redirect' | 'self_hosted';

  @Column({ type: 'text', nullable: true })
  embedUrl?: string;

  @Column({ type: 'text', nullable: true })
  complianceNotes?: string;

  @OneToMany(() => Clip, (clip) => clip.media)
  clips: Clip[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
