import { Injectable } from '@nestjs/common';
import { SearchQueryDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  async search(query: SearchQueryDto) {
    const { q, language, type, limit = 20, offset = 0, mode = 'hybrid' } = query;

    // 模拟搜索结果
    const mockResults = [
      {
        id: 'entry-uuid-1',
        type: 'entry',
        term: 'すみません',
        pronunciation: 'sumimasen',
        meaningSummary: '对不起；不好意思',
        language: 'ja',
        clipCount: 15,
        relevanceScore: 0.95,
        thumbnail: 'https://cdn.example.com/placeholder.jpg',
      },
      {
        id: 'clip-uuid-1',
        type: 'clip',
        originalSubtitle: '本当にすみませんでした。',
        translations: {
          zh: '真是对不起。',
          en: "I'm truly sorry.",
        },
        mediaTitle: 'NHK Easy News',
        duration: 4.5,
        relevanceScore: 0.89,
        thumbnail: 'https://cdn.example.com/placeholder.jpg',
      },
      {
        id: 'entry-uuid-2',
        type: 'entry',
        term: '申し訳ありません',
        pronunciation: 'moushiwake arimasen',
        meaningSummary: '非常抱歉（更正式）',
        language: 'ja',
        clipCount: 8,
        relevanceScore: 0.82,
        thumbnail: 'https://cdn.example.com/placeholder.jpg',
      },
    ];

    return {
      data: mockResults,
      pagination: {
        total: 156,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: true,
      },
      meta: {
        searchMode: mode,
        processingTime: 45,
      },
    };
  }
}
