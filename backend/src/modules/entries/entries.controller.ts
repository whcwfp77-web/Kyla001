import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { EntriesService } from './entries.service';

@ApiTags('entries')
@Controller('entries')
export class EntriesController {
  constructor(private entriesService: EntriesService) {}

  @Get(':id')
  @ApiOperation({ summary: '获取词条详情' })
  @ApiParam({ name: 'id', description: '词条ID' })
  async getEntry(@Param('id') id: string) {
    return this.entriesService.getEntry(id);
  }
}
