import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clip } from '../../db/entities';

@Injectable()
export class ClipsService {
  constructor(
    @InjectRepository(Clip)
    private clipRepository: Repository<Clip>,
  ) {}

  async getClip(id: string) {
    // 模拟数据
    const mockClip = {
      id: id,
      mediaId: 'media-uuid',
      startTime: 312300,
      endTime: 316800,
      duration: 4.5,
      originalSubtitle: '本当にすみませんでした。',
      translations: {
        zh: '真是对不起。',
        en: "I'm truly sorry.",
        ko: '정말 죄송합니다.',
      },
      emotionTags: ['Apology', 'Formal'],
      politenessLevel: '敬体',
      contextSummary: 'Anchor apologises for delay in broadcast',
      shadowLabReady: true,
      media: {
        id: 'media-uuid',
        title: 'NHK Easy News',
        platform: 'YouTube',
        sourceType: 'embed',
        embedUrl: 'https://www.youtube.com/embed/example?start=312',
        embedPolicy: {
          allowed: true,
          provider: 'youtube',
          restrictions: [],
        },
      },
      relatedEntries: [
        {
          id: 'entry-uuid',
          term: 'すみません',
          usageBucket: 'polite',
        },
      ],
    };

    return mockClip;
  }
}
