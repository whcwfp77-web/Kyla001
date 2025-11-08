# Language Learning Platform

一个现代化的语言学习平台，支持通过视频片段学习语言，包含 Shadow Lab、SRS 复习系统、语法透镜等功能。

## 架构概览

- **前端**: Next.js/React PWA，支持 SSR 和 SEO
- **后端**: NestJS + TypeScript，API-first 架构
- **服务**: ETL 和 embedding 作业服务
- **基础设施**: Docker、Terraform、CI/CD 管道
- **数据库**: PostgreSQL + pgvector（向量搜索）

## 核心功能

- 🔍 关键词 + 语义融合搜索
- 🎬 视频片段学习（支持多种媒体源）
- 🎤 Shadow Lab（跟读练习）
- 📚 SRS 间隔重复复习系统
- 📖 语法透镜（多语言语法映射）
- ✅ 内容合规管理（索引仅模式）
- 👥 用户建议和审核工作流

## 项目结构

```
language-learning-platform/
├── frontend/          # Next.js/React PWA 前端
├── backend/           # NestJS 后端 API
├── services/          # 独立服务（ETL、embedding）
├── infrastructure/    # IaC、Docker、CI/CD
└── docs/              # 架构文档、API 契约、合规清单
```

## 快速开始

### 前置要求

- Node.js 18+
- PostgreSQL 14+ with pgvector extension
- Redis 6+
- Docker & Docker Compose

### 开发环境设置

```bash
# 安装依赖
cd frontend && npm install
cd ../backend && npm install

# 启动数据库和 Redis
docker-compose up -d

# 运行数据库迁移
cd backend && npm run migration:run

# 启动开发服务器
# 终端 1: 后端
cd backend && npm run start:dev

# 终端 2: 前端
cd frontend && npm run dev
```

## 30 天交付计划

- **Week 1**: 基础架构和骨架
- **Week 2**: 内容管道和 Shadow Lab MVP
- **Week 3**: SRS 和语法透镜
- **Week 4**: 建议系统、管理和 SEO

详细计划请参阅 `docs/architecture.md`。

## 许可证

[待定]
