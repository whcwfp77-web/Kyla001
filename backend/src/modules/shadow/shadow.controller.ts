import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../db/entities';
import { ShadowService } from './shadow.service';

@ApiTags('shadow')
@Controller('shadow')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShadowController {
  constructor(private shadowService: ShadowService) {}

  @Post('record')
  @ApiOperation({ summary: '提交跟读录音' })
  async recordShadow(
    @Body() body: { clipId: string; duration: number; attemptNumber: number },
    @CurrentUser() user: User,
  ) {
    return this.shadowService.recordShadow(user.id, body);
  }

  @Get('history')
  @ApiOperation({ summary: '获取跟读历史' })
  async getHistory(
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @CurrentUser() user: User,
  ) {
    return this.shadowService.getHistory(user.id, limit, offset);
  }
}
