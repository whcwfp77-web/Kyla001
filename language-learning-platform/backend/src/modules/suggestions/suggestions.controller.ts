import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SuggestionsService } from './suggestions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('suggestions')
@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit a suggestion' })
  async submit(@Request() req, @Body() data: any) {
    return this.suggestionsService.create(req.user.sub, data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update suggestion (admin only)' })
  async update(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.suggestionsService.update(req.user.sub, id, data);
  }
}
