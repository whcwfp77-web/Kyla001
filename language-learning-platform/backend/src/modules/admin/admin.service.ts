import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async queueEmbeddingJob(userId: string, clipId: string) {
    // TODO: Queue embedding job in Bull
    return { message: 'Embedding job queued', clipId };
  }
}
