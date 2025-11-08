import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ComplianceService {
  constructor(private configService: ConfigService) {}

  async getPolicies() {
    const embedWhitelist = this.configService.get('EMBED_WHITELIST', 'youtube.com,youtu.be,vimeo.com,bilibili.com').split(',');
    
    return {
      embedWhitelist,
      copyrightPolicy: '我们仅索引和嵌入公开可用的内容，所有版权归原作者所有。本平台仅作为教育学习工具。',
      dmcaContact: this.configService.get('DMCA_EMAIL', 'dmca@example.com'),
      lastUpdated: '2025-11-01T00:00:00Z',
    };
  }
}
