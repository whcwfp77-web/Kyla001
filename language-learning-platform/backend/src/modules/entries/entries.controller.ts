import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EntriesService } from './entries.service';

@ApiTags('entries')
@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get entry by ID with clips and related entries' })
  async getEntry(@Param('id') id: string) {
    const entry = await this.entriesService.findOne(id);
    if (!entry) {
      throw new NotFoundException(`Entry with ID ${id} not found`);
    }
    return entry;
  }
}
