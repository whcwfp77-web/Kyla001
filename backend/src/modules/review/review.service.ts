import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewCard } from '../../db/entities';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewCard)
    private reviewCardRepository: Repository<ReviewCard>,
  ) {}

  async addCard(userId: string, entryId: string) {
    // 模拟添加卡片
    return {
      cardId: 'review-card-uuid',
      entryId,
      nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      interval: 1,
    };
  }

  async getNext(userId: string) {
    // 模拟获取下一张卡片
    return {
      cardId: 'review-card-uuid',
      entry: {
        id: 'entry-uuid',
        term: 'すみません',
        pronunciation: 'sumimasen',
        meaningSummary: '对不起；不好意思',
      },
      clips: [
        {
          id: 'clip-uuid',
          originalSubtitle: 'すみません。',
          duration: 2.1,
        },
      ],
      interval: 3,
      reviewCount: 2,
      lastReviewedAt: '2025-11-05T10:00:00Z',
    };
  }

  async completeReview(cardId: string, rating: number, timeSpent: number) {
    // 模拟完成复习
    const newInterval = rating >= 3 ? 7 : 3;
    return {
      cardId,
      nextReviewAt: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString(),
      interval: newInterval,
      reviewCount: 3,
    };
  }

  async getStats(userId: string) {
    // 模拟统计数据
    return {
      totalCards: 150,
      dueToday: 12,
      reviewedToday: 8,
      streak: 15,
      accuracy: 0.87,
      intervalDistribution: {
        '1': 20,
        '3': 35,
        '7': 50,
        '21': 45,
      },
    };
  }
}
