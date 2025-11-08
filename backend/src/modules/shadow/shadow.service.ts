import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShadowRecord } from '../../db/entities';

@Injectable()
export class ShadowService {
  constructor(
    @InjectRepository(ShadowRecord)
    private shadowRecordRepository: Repository<ShadowRecord>,
  ) {}

  async recordShadow(userId: string, data: { clipId: string; duration: number; attemptNumber: number }) {
    // 模拟保存录音记录
    return {
      recordId: 'shadow-record-uuid',
      clipId: data.clipId,
      duration: data.duration,
      attemptNumber: data.attemptNumber,
      savedAt: new Date().toISOString(),
    };
  }

  async getHistory(userId: string, limit: number, offset: number) {
    // 模拟历史记录
    return {
      data: [
        {
          recordId: 'shadow-record-uuid',
          clipId: 'clip-uuid',
          clipTitle: 'NHK Easy News - Apology',
          duration: 4.3,
          attemptNumber: 2,
          recordedAt: '2025-11-08T10:30:00Z',
        },
      ],
      pagination: {
        total: 45,
        limit,
        offset,
        hasMore: true,
      },
    };
  }
}
