import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ClipsService } from './clips.service';

@ApiTags('clips')
@Controller('clips')
export class ClipsController {
  constructor(private clipsService: ClipsService) {}

  @Get(':id')
  @ApiOperation({ summary: '获取片段详情' })
  @ApiParam({ name: 'id', description: '片段ID' })
  async getClip(@Param('id') id: string) {
    return this.clipsService.getClip(id);
  }
}
