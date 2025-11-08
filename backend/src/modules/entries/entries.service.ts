import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry } from '../../db/entities';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
  ) {}

  async getEntry(id: string) {
    // 模拟数据（第一周返回fixture）
    const mockEntry = {
      id: id,
      term: 'すみません',
      language: 'ja',
      pronunciation: 'sumimasen',
      meaningSummary: '对不起；不好意思',
      grammarLinks: ['jp-te-form-apology'],
      examTopics: ['JLPT N4', 'IELTS: Apology'],
      clips: {
        literal: [
          {
            id: 'clip-uuid-1',
            originalSubtitle: 'すみません。',
            duration: 2.1,
            mediaTitle: 'Daily Conversation',
            thumbnail: 'https://cdn.example.com/placeholder.jpg',
          },
        ],
        polite: [
          {
            id: 'clip-uuid-2',
            originalSubtitle: '本当にすみませんでした。',
            duration: 4.5,
            mediaTitle: 'NHK Easy News',
            thumbnail: 'https://cdn.example.com/placeholder.jpg',
          },
        ],
      },
      relatedEntries: [
        {
          id: 'related-uuid',
          term: '申し訳ありません',
          relationship: 'synonym',
        },
      ],
      createdAt: '2025-10-01T00:00:00Z',
    };

    return mockEntry;
  }
}
