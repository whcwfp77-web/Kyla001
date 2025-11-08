import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';

@ApiTags('compliance')
@Controller('compliance')
export class ComplianceController {
  constructor(private complianceService: ComplianceService) {}

  @Get('policies')
  @ApiOperation({ summary: '获取合规策略' })
  async getPolicies() {
    return this.complianceService.getPolicies();
  }
}
