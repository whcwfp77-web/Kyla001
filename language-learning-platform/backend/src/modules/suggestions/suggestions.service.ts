import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suggestion } from '../../db/entities/suggestion.entity';
import { User } from '../../db/entities/user.entity';

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectRepository(Suggestion)
    private suggestionRepository: Repository<Suggestion>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: string, data: any) {
    const suggestion = this.suggestionRepository.create({
      userId,
      ...data,
      status: 'pending',
    });
    return this.suggestionRepository.save(suggestion);
  }

  async update(userId: string, id: string, data: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const suggestion = await this.suggestionRepository.findOne({
      where: { id },
    });
    if (!suggestion) {
      throw new Error('Suggestion not found');
    }

    Object.assign(suggestion, data);
    suggestion.reviewedBy = user.email;
    suggestion.reviewedAt = new Date();

    return this.suggestionRepository.save(suggestion);
  }
}
