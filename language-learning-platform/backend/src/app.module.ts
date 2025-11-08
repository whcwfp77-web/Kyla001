import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { EntriesModule } from './modules/entries/entries.module';
import { ClipsModule } from './modules/clips/clips.module';
import { SearchModule } from './modules/search/search.module';
import { ReviewModule } from './modules/review/review.module';
import { ShadowModule } from './modules/shadow/shadow.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { UserModule } from './modules/user/user.module';
import { config } from './config/env.schema';
import { TypeOrmConfigService } from './db/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    AuthModule,
    EntriesModule,
    ClipsModule,
    SearchModule,
    ReviewModule,
    ShadowModule,
    SuggestionsModule,
    AdminModule,
    AnalyticsModule,
    ComplianceModule,
    UserModule,
  ],
})
export class AppModule {}
