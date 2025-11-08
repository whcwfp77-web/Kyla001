import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClipsController } from './clips.controller';
import { ClipsService } from './clips.service';
import { Clip } from '../../db/entities/clip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clip])],
  controllers: [ClipsController],
  providers: [ClipsService],
  exports: [ClipsService],
})
export class ClipsModule {}
