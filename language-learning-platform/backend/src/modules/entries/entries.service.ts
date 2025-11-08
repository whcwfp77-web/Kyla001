import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry } from '../../db/entities/entry.entity';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
  ) {}

  async findOne(id: string) {
    return this.entryRepository.findOne({
      where: { id },
      relations: ['entryClips', 'entryClips.clip', 'entryClips.clip.media', 'relatedEntries'],
    });
  }
}
