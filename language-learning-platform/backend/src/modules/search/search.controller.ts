import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search clips with keyword and semantic fusion' })
  @ApiQuery({ name: 'query', required: true })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'language', required: false })
  @ApiQuery({ name: 'theme', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Query('query') query: string,
    @Query('type') type?: string,
    @Query('language') language?: string,
    @Query('theme') theme?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.search({
      query,
      type,
      language,
      theme,
      page: page || 1,
      limit: limit || 20,
    });
  }
}
