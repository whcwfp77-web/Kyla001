import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../../db/entities';
import { SuggestionsService } from './suggestions.service';

@ApiTags('suggestions')
@Controller('suggestions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SuggestionsController {
  constructor(private suggestionsService: SuggestionsService) {}

  @Post()
  @ApiOperation({ summary: '提交内容建议' })
  async createSuggestion(
    @Body() body: { type: string; language: string; content: any },
    @CurrentUser() user: User,
  ) {
    return this.suggestionsService.createSuggestion(user.id, body);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: '获取建议列表（管理员）' })
  async getSuggestions(
    @Query('status') status?: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return this.suggestionsService.getSuggestions(status, limit, offset);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: '审批建议（管理员）' })
  async reviewSuggestion(
    @Param('id') id: string,
    @Body() body: { status: string; reviewNotes: string },
    @CurrentUser() user: User,
  ) {
    return this.suggestionsService.reviewSuggestion(id, user.id, body);
  }
}
