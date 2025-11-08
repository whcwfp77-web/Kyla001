import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShadowController } from './shadow.controller';
import { ShadowService } from './shadow.service';
import { ShadowRecord } from '../../db/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ShadowRecord])],
  controllers: [ShadowController],
  providers: [ShadowService],
})
export class ShadowModule {}
