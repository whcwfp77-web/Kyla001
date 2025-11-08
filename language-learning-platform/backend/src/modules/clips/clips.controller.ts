import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClipsService } from './clips.service';

@ApiTags('clips')
@Controller('clips')
export class ClipsController {
  constructor(private readonly clipsService: ClipsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get clip by ID with metadata and embed policy' })
  async getClip(@Param('id') id: string) {
    const clip = await this.clipsService.findOne(id);
    if (!clip) {
      throw new NotFoundException(`Clip with ID ${id} not found`);
    }
    return clip;
  }
}
