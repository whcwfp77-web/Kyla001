import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GrammarService } from './grammar.service';

@ApiTags('grammar')
@Controller('grammar')
export class GrammarController {
  constructor(private grammarService: GrammarService) {}

  @Get(':slug')
  @ApiOperation({ summary: '获取语法点详情' })
  async getGrammarPoint(@Param('slug') slug: string) {
    return this.grammarService.getGrammarPoint(slug);
  }
}
