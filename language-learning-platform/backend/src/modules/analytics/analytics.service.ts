import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async logEvent(event: string, data: any) {
    // TODO: Implement analytics logging
    console.log(`Analytics event: ${event}`, data);
  }
}
