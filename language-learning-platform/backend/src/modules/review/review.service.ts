import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { ReviewCard } from '../../db/entities/review-card.entity';
import { Clip } from '../../db/entities/clip.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewCard)
    private reviewCardRepository: Repository<ReviewCard>,
    @InjectRepository(Clip)
    private clipRepository: Repository<Clip>,
  ) {}

  async addToReview(userId: string, clipId: string) {
    const clip = await this.clipRepository.findOne({ where: { id: clipId } });
    if (!clip) {
      throw new Error('Clip not found');
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + clip.srsDefaultInterval || 3);

    const reviewCard = this.reviewCardRepository.create({
      userId,
      clipId,
      dueDate,
      interval: clip.srsDefaultInterval || 3,
    });

    return this.reviewCardRepository.save(reviewCard);
  }

  async getNextReview(userId: string) {
    const now = new Date();
    const card = await this.reviewCardRepository.findOne({
      where: {
        userId,
        dueDate: LessThanOrEqual(now),
      },
      relations: ['clip', 'clip.media'],
      order: {
        dueDate: 'ASC',
      },
    });

    return card;
  }

  async completeReview(userId: string, cardId: string, quality: number) {
    const card = await this.reviewCardRepository.findOne({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new Error('Review card not found');
    }

    // SRS algorithm (simplified SM-2)
    if (quality >= 3) {
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }
      card.repetitions += 1;
    } else {
      card.repetitions = 0;
      card.interval = 1;
    }

    // Update ease factor
    card.easeFactor = Math.max(
      1.3,
      card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    );

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + card.interval);
    card.dueDate = dueDate;
    card.lastReviewedAt = new Date();

    return this.reviewCardRepository.save(card);
  }
}
