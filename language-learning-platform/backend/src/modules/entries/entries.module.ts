import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { Entry } from '../../db/entities/entry.entity';
import { Clip } from '../../db/entities/clip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entry, Clip])],
  controllers: [EntriesController],
  providers: [EntriesService],
  exports: [EntriesService],
})
export class EntriesModule {}
