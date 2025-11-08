import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ComplianceService {
  constructor(private configService: ConfigService) {}

  getPolicies() {
    return {
      embedWhitelist: this.configService.get<string[]>('compliance.embedWhitelist'),
      auditEnabled: this.configService.get<boolean>('compliance.auditEnabled'),
    };
  }
}
