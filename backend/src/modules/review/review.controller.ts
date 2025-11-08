import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../db/entities';
import { ReviewService } from './review.service';

@ApiTags('review')
@Controller('review')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('add')
  @ApiOperation({ summary: '添加到复习队列' })
  async addCard(@Body() body: { entryId: string }, @CurrentUser() user: User) {
    return this.reviewService.addCard(user.id, body.entryId);
  }

  @Get('next')
  @ApiOperation({ summary: '获取下一个复习项' })
  async getNext(@CurrentUser() user: User) {
    return this.reviewService.getNext(user.id);
  }

  @Post('complete')
  @ApiOperation({ summary: '完成复习' })
  async completeReview(
    @Body() body: { cardId: string; rating: number; timeSpent: number },
    @CurrentUser() user: User,
  ) {
    return this.reviewService.completeReview(body.cardId, body.rating, body.timeSpent);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取复习统计' })
  async getStats(@CurrentUser() user: User) {
    return this.reviewService.getStats(user.id);
  }
}
