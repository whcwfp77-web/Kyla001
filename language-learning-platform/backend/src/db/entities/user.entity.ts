import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ReviewCard } from './review-card.entity';
import { ShadowRecord } from './shadow-record.entity';
import { Suggestion } from './suggestion.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  CURATOR = 'curator',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 20, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'varchar', length: 10, array: true, default: [] })
  preferredLanguages: string[];

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @OneToMany(() => ReviewCard, (reviewCard) => reviewCard.user)
  reviewCards: ReviewCard[];

  @OneToMany(() => ShadowRecord, (shadowRecord) => shadowRecord.user)
  shadowRecords: ShadowRecord[];

  @OneToMany(() => Suggestion, (suggestion) => suggestion.user)
  suggestions: Suggestion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
