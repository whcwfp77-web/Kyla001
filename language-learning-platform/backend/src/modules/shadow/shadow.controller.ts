import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ShadowService } from './shadow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('shadow')
@Controller('shadow')
@UseGuards(JwtAuthGuard)
export class ShadowController {
  constructor(private readonly shadowService: ShadowService) {}

  @Post('record')
  @ApiOperation({ summary: 'Record shadow practice session' })
  async record(@Request() req, @Body() body: { clipId: string; metrics: any }) {
    return this.shadowService.record(req.user.sub, body.clipId, body.metrics);
  }
}
