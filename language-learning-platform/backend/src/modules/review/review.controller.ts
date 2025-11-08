import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('review')
@Controller('review')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add clip to review deck' })
  async addToReview(@Request() req, @Body('clipId') clipId: string) {
    return this.reviewService.addToReview(req.user.sub, clipId);
  }

  @Get('next')
  @ApiOperation({ summary: 'Get next review card due' })
  async getNextReview(@Request() req) {
    return this.reviewService.getNextReview(req.user.sub);
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete review with quality rating' })
  async completeReview(
    @Request() req,
    @Body('cardId') cardId: string,
    @Body('quality') quality: number,
  ) {
    return this.reviewService.completeReview(req.user.sub, cardId, quality);
  }
}
