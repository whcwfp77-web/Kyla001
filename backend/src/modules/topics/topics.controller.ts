import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TopicsService } from './topics.service';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(private topicsService: TopicsService) {}

  @Get()
  @ApiOperation({ summary: '获取主题列表' })
  async getTopics(@Query('language') language?: string) {
    return this.topicsService.getTopics(language);
  }
}
