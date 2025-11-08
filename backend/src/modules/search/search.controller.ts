import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: '综合搜索（关键词+语义）' })
  @ApiQuery({ name: 'q', description: '搜索关键词', required: true })
  @ApiQuery({ name: 'language', description: '语言过滤', required: false })
  @ApiQuery({ name: 'type', description: '内容类型', required: false })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false })
  @ApiQuery({ name: 'offset', description: '偏移量', required: false })
  @ApiQuery({ name: 'mode', description: '搜索模式', required: false })
  async search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query);
  }
}
