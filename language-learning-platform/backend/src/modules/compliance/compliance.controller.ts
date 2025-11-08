import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';

@ApiTags('compliance')
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('policies')
  @ApiOperation({ summary: 'Get compliance policies' })
  async getPolicies() {
    return this.complianceService.getPolicies();
  }
}
