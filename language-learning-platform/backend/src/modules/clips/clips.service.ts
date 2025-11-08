import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clip } from '../../db/entities/clip.entity';

@Injectable()
export class ClipsService {
  constructor(
    @InjectRepository(Clip)
    private clipRepository: Repository<Clip>,
  ) {}

  async findOne(id: string) {
    return this.clipRepository.findOne({
      where: { id },
      relations: ['media', 'entryClips', 'entryClips.entry'],
    });
  }
}
