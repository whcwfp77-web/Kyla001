import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { WinstonLogger } from './common/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: new WinstonLogger(),
    },
  );

  const configService = app.get(ConfigService);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 安全头
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    credentials: true,
  });

  // 全局前缀
  const apiVersion = configService.get('API_VERSION', 'v1');
  app.setGlobalPrefix(`api/${apiVersion}`);

  // Swagger文档
  const config = new DocumentBuilder()
    .setTitle('语言学习平台API')
    .setDescription('通过真实媒体片段学习语言的API接口')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', '认证模块')
    .addTag('search', '搜索模块')
    .addTag('entries', '词条模块')
    .addTag('clips', '片段模块')
    .addTag('review', '复习模块（SRS）')
    .addTag('shadow', 'Shadow Lab模块')
    .addTag('suggestions', '建议模块')
    .addTag('grammar', '语法模块')
    .addTag('topics', '主题模块')
    .addTag('compliance', '合规模块')
    .addTag('analytics', '分析模块')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get('PORT', 3001);
  await app.listen(port, '0.0.0.0');

  console.log(`
    🚀 应用已启动！
    📚 API文档: http://localhost:${port}/api/docs
    🔗 健康检查: http://localhost:${port}/api/${apiVersion}/health
    🌍 环境: ${configService.get('NODE_ENV')}
  `);
}

bootstrap();
