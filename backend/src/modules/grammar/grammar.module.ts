import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrammarController } from './grammar.controller';
import { GrammarService } from './grammar.service';
import { GrammarPoint } from '../../db/entities';

@Module({
  imports: [TypeOrmModule.forFeature([GrammarPoint])],
  controllers: [GrammarController],
  providers: [GrammarService],
})
export class GrammarModule {}
