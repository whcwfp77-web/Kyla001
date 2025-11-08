import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suggestion } from '../../db/entities';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectRepository(Suggestion)
    private suggestionRepository: Repository<Suggestion>,
  ) {}

  async createSuggestion(userId: string, data: { type: string; language: string; content: any }) {
    // 模拟创建建议
    return {
      suggestionId: 'suggestion-uuid',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      estimatedReviewTime: '1-3 days',
    };
  }

  async getSuggestions(status?: string, limit: number = 20, offset: number = 0) {
    // 模拟建议列表
    return {
      data: [
        {
          id: 'suggestion-uuid',
          userId: 'user-uuid',
          type: 'new_clip',
          status: 'pending',
          content: {
            term: 'お疲れ様です',
            mediaUrl: 'https://youtube.com/watch?v=...',
          },
          submittedAt: '2025-11-08T10:30:00Z',
        },
      ],
      pagination: {
        total: 10,
        limit,
        offset,
        hasMore: false,
      },
    };
  }

  async reviewSuggestion(id: string, reviewerId: string, data: { status: string; reviewNotes: string }) {
    // 模拟审批
    return {
      suggestionId: id,
      status: data.status,
      clipId: data.status === 'approved' ? 'newly-created-clip-uuid' : null,
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString(),
    };
  }
}
