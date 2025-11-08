import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Clip } from '../../db/entities/clip.entity';
import { Entry } from '../../db/entities/entry.entity';

export interface SearchParams {
  query: string;
  type?: string;
  language?: string;
  theme?: string;
  page: number;
  limit: number;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Clip)
    private clipRepository: Repository<Clip>,
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
  ) {}

  async search(params: SearchParams) {
    const { query, type, language, theme, page, limit } = params;
    const skip = (page - 1) * limit;

    // Keyword search (fallback when vector store is cold)
    const keywordQuery = this.clipRepository
      .createQueryBuilder('clip')
      .leftJoinAndSelect('clip.media', 'media')
      .leftJoinAndSelect('clip.entryClips', 'entryClips')
      .leftJoinAndSelect('entryClips.entry', 'entry')
      .where('clip.originalSubtitle ILIKE :query', { query: `%${query}%` })
      .orWhere('entry.term ILIKE :query', { query: `%${query}%` });

    if (language) {
      keywordQuery.andWhere('entry.language = :language', { language });
    }

    if (type) {
      keywordQuery.andWhere('clip.embedPolicy = :type', { type });
    }

    const [results, total] = await keywordQuery
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // TODO: Implement vector search fusion when embedding is available
    // const vectorResults = await this.vectorSearch(query, language);

    return {
      results: results.map((clip) => ({
        id: clip.id,
        entryTerm: clip.entryClips?.[0]?.entry?.term || '',
        language: clip.entryClips?.[0]?.entry?.language || '',
        mediaTitle: clip.media?.title || '',
        startTime: this.msToTimeString(clip.startTimeMs),
        endTime: this.msToTimeString(clip.endTimeMs),
        thumbnailUrl: clip.thumbnailUrl,
        embedPolicy: clip.embedPolicy,
        embedUrl: clip.embedUrl,
      })),
      total,
      page,
      limit,
    };
  }

  private msToTimeString(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
