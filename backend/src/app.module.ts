import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// 模块
import { AuthModule } from './modules/auth/auth.module';
import { EntriesModule } from './modules/entries/entries.module';
import { ClipsModule } from './modules/clips/clips.module';
import { SearchModule } from './modules/search/search.module';
import { ReviewModule } from './modules/review/review.module';
import { ShadowModule } from './modules/shadow/shadow.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { GrammarModule } from './modules/grammar/grammar.module';
import { TopicsModule } from './modules/topics/topics.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';

// 通用模块
import { HealthModule } from './common/health/health.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', false),
        logging: configService.get('DB_LOGGING', false),
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),

    // 定时任务模块
    ScheduleModule.forRoot(),

    // 功能模块
    HealthModule,
    AuthModule,
    EntriesModule,
    ClipsModule,
    SearchModule,
    ReviewModule,
    ShadowModule,
    SuggestionsModule,
    GrammarModule,
    TopicsModule,
    ComplianceModule,
    AnalyticsModule,
    AdminModule,
  ],
  providers: [
    // 全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // 全局响应转换拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // 全局日志拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
