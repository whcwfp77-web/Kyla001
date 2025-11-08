import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewCard } from '../../db/entities/review-card.entity';
import { Clip } from '../../db/entities/clip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewCard, Clip])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
