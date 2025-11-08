import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionsService } from './suggestions.service';
import { Suggestion } from '../../db/entities/suggestion.entity';
import { User } from '../../db/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Suggestion, User])],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}
