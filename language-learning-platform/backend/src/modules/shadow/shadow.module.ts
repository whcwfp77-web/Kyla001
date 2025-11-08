import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShadowController } from './shadow.controller';
import { ShadowService } from './shadow.service';
import { ShadowRecord } from '../../db/entities/shadow-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShadowRecord])],
  controllers: [ShadowController],
  providers: [ShadowService],
  exports: [ShadowService],
})
export class ShadowModule {}
