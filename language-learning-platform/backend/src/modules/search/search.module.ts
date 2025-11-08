import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Clip } from '../../db/entities/clip.entity';
import { Entry } from '../../db/entities/entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clip, Entry])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
