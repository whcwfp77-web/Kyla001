import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from '../../db/entities';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
  ) {}

  async getTopics(language?: string) {
    // 模拟主题列表
    return {
      data: [
        {
          slug: 'workplace-greetings',
          title: '职场问候',
          language: 'ja',
          clipCount: 32,
          thumbnail: 'https://cdn.example.com/topics/workplace.jpg',
        },
        {
          slug: 'daily-conversation',
          title: '日常对话',
          language: 'ja',
          clipCount: 45,
          thumbnail: 'https://cdn.example.com/topics/daily.jpg',
        },
      ],
    };
  }
}
