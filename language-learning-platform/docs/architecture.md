# 架构文档

## 概述

语言学习平台采用前后端分离的架构，支持通过视频片段学习语言，包含 Shadow Lab、SRS 复习系统、语法透镜等功能。

## 技术栈

### 前端
- **框架**: Next.js 14 (React 18)
- **样式**: Tailwind CSS
- **状态管理**: Zustand + React Query
- **国际化**: next-i18next
- **PWA**: Service Worker + Manifest

### 后端
- **框架**: NestJS (TypeScript)
- **数据库**: PostgreSQL 14+ with pgvector
- **缓存/队列**: Redis + Bull
- **ORM**: TypeORM
- **认证**: JWT + Magic Link

### 服务
- **内容摄取**: Node.js ETL 服务
- **向量生成**: Embedding Worker (批处理)

### 基础设施
- **容器化**: Docker + Docker Compose
- **IaC**: Terraform (可选)
- **CI/CD**: GitHub Actions / GitLab CI

## 架构原则

1. **SEO 优先**: 所有内容页面支持 SSR
2. **API-First**: 后端提供 RESTful API
3. **队列驱动**: 内容摄取和向量生成通过队列处理
4. **合规优先**: 媒体嵌入强制执行"索引仅"合规策略

## 核心模块

### 前端模块

- `pages/`: Next.js 页面路由
  - `index.tsx`: 首页
  - `search.tsx`: 搜索结果页
  - `entries/[id].tsx`: 词条详情页
  - `clips/[id].tsx`: 片段详情页
  - `grammar/[slug].tsx`: 语法点页面
  - `topics/[slug].tsx`: 主题页面
  - `me/review.tsx`: 复习页面
  - `admin/review.tsx`: 管理员审核页面

- `components/`: React 组件
  - `SearchBar`: 搜索栏
  - `ClipCard`: 片段卡片
  - `EntryTabs`: 词条标签页
  - `MediaEmbed`: 媒体嵌入组件（合规层）
  - `ShadowLab`: Shadow Lab UI
  - `ExpressionSwitcher`: 表达切换器
  - `GrammarLens`: 语法透镜
  - `ReviewDrawer`: 复习抽屉
  - `SuggestionForm`: 建议表单
  - `AdminQueue`: 管理员队列

- `lib/`: 工具库
  - `api.ts`: API 客户端
  - `i18n.ts`: 国际化工具
  - `accessibility.ts`: 无障碍工具

### 后端模块

- `modules/auth/`: 认证模块（Magic Link + OAuth）
- `modules/entries/`: 词条管理
- `modules/clips/`: 片段管理
- `modules/search/`: 搜索编排（关键词 + 向量融合）
- `modules/review/`: SRS 复习系统
- `modules/shadow/`: Shadow Lab 后端
- `modules/suggestions/`: 用户建议
- `modules/admin/`: 管理员功能
- `modules/analytics/`: 分析日志
- `modules/compliance/`: 合规审计

### 数据库实体

- `users`: 用户表
- `media`: 媒体源表
- `entries`: 词条表
- `clips`: 片段表（包含向量嵌入）
- `entry_clips`: 词条-片段关联表
- `review_cards`: SRS 复习卡片
- `shadow_records`: Shadow Lab 记录
- `suggestions`: 用户建议

## API 端点

详见 `api-contract.md`

## 部署架构

```
┌─────────────┐
│   CDN/Edge  │
└──────┬──────┘
       │
┌──────▼──────┐      ┌──────────────┐
│   Next.js   │◄────►│   NestJS     │
│   Frontend  │      │   Backend    │
└─────────────┘      └──────┬───────┘
                             │
                    ┌────────┴────────┐
                    │                 │
            ┌───────▼──────┐  ┌──────▼──────┐
            │  PostgreSQL  │  │    Redis    │
            │  + pgvector   │  │   + Bull    │
            └───────────────┘  └─────────────┘
```

## 安全考虑

- JWT token 过期时间: 7 天
- Magic Link 过期时间: 15 分钟
- 媒体嵌入白名单强制执行
- 内容审核工作流
- 合规审计日志

## 性能优化

- Next.js ISR (增量静态再生)
- Redis 缓存
- 向量搜索索引 (ivfflat)
- PWA 离线缓存
- 图片优化 (WebP/AVIF)

## 监控和日志

- 结构化日志
- 搜索和 Shadow Lab 指标仪表板
- SRS 调度器失败告警
- 合规审计报告
