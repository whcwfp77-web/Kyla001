import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async reindexEmbeddings(entityType: string, entityIds: string[]) {
    // 模拟触发向量重新生成任务
    return {
      jobId: 'job-uuid',
      status: 'queued',
      estimatedTime: '5-10 minutes',
    };
  }
}
