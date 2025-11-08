import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('embed/reindex')
  @ApiOperation({ summary: 'Queue embedding job for clip (admin only)' })
  async reindexEmbed(@Request() req, @Body('clipId') clipId: string) {
    return this.adminService.queueEmbeddingJob(req.user.sub, clipId);
  }
}
