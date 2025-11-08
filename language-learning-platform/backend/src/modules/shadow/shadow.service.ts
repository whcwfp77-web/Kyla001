import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShadowRecord } from '../../db/entities/shadow-record.entity';

@Injectable()
export class ShadowService {
  constructor(
    @InjectRepository(ShadowRecord)
    private shadowRecordRepository: Repository<ShadowRecord>,
  ) {}

  async record(userId: string, clipId: string, metrics: any) {
    // Anonymize waveform stats if needed
    const anonymizedMetrics = {
      ...metrics,
      waveformStats: metrics.waveformStats
        ? {
            peaks: metrics.waveformStats.peaks?.slice(0, 100), // Sample
            valleys: metrics.waveformStats.valleys?.slice(0, 100),
          }
        : undefined,
    };

    const record = this.shadowRecordRepository.create({
      userId,
      clipId,
      metrics: anonymizedMetrics,
    });

    return this.shadowRecordRepository.save(record);
  }
}
