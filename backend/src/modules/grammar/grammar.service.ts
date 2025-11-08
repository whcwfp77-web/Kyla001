import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrammarPoint } from '../../db/entities';

@Injectable()
export class GrammarService {
  constructor(
    @InjectRepository(GrammarPoint)
    private grammarPointRepository: Repository<GrammarPoint>,
  ) {}

  async getGrammarPoint(slug: string) {
    // 模拟语法点数据
    return {
      slug,
      language: 'ja',
      title: 'Te-form + すみません',
      description: '使用て形+すみません表示道歉',
      examples: [
        {
          japanese: '遅れてすみません。',
          romaji: 'okurete sumimasen',
          translation: '对不起我迟到了。',
        },
      ],
      relatedClips: [
        {
          id: 'clip-uuid',
          originalSubtitle: '忘れてすみません。',
        },
      ],
      difficulty: 'N4',
      tags: ['apology', 'te-form', 'polite'],
    };
  }
}
