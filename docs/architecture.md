# 语言学习平台 - 架构文档

## 系统概述

本平台是一个现代化的语言学习系统，通过真实媒体片段帮助用户在语境中学习语言。

## 架构原则

1. **API优先设计** - 后端提供RESTful API，支持多客户端
2. **服务端渲染** - Next.js SSR确保SEO优化和快速首屏加载
3. **渐进式Web应用** - PWA支持离线学习和安装
4. **队列驱动** - 异步处理内容摄取和向量化
5. **仅索引策略** - 严格遵守版权，仅嵌入或链接外部内容

## 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **UI库**: React 18
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: React Query + Zustand
- **PWA**: next-pwa

### 后端
- **框架**: NestJS (TypeScript)
- **HTTP服务器**: Fastify
- **ORM**: TypeORM
- **验证**: class-validator
- **API文档**: Swagger/OpenAPI

### 数据存储
- **主数据库**: PostgreSQL 15 + pgvector
- **缓存/会话**: Redis 7
- **对象存储**: AWS S3 / MinIO
- **搜索**: PostgreSQL全文搜索 + 向量搜索混合

### 基础设施
- **容器化**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana
- **日志**: Winston + ELK Stack (可选)

## 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                      用户界面层                          │
│  Next.js SSR + PWA (SEO优化、离线支持、响应式)           │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS/REST
┌─────────────────▼───────────────────────────────────────┐
│                     API网关层                            │
│  NestJS + Fastify (认证、限流、日志、CORS)               │
└─────┬───────────────────────────┬───────────────────────┘
      │                           │
      │ 业务逻辑                   │ 后台任务
┌─────▼────────────┐      ┌───────▼────────────┐
│  核心API服务      │      │   后台服务队列      │
│ • 搜索编排        │      │ • 字幕解析          │
│ • 内容管理        │      │ • 向量生成          │
│ • SRS调度         │      │ • SRS调度任务       │
│ • 用户管理        │      │ • 内容审核          │
│ • 建议工作流      │      │                     │
└─────┬────────────┘      └───────┬────────────┘
      │                           │
      │                           │
┌─────▼───────────────────────────▼────────────┐
│              数据持久层                       │
│ • PostgreSQL (主数据 + pgvector)             │
│ • Redis (缓存 + 队列)                        │
│ • S3/MinIO (媒体存储)                        │
└──────────────────────────────────────────────┘
```

## 核心模块

### 1. 认证与授权 (Auth Module)
- 魔法链接登录（无密码）
- OAuth集成（Google、GitHub等）
- JWT会话管理
- 基于角色的访问控制（RBAC）：用户、审核员、管理员

### 2. 内容模块 (Content Module)
- **Entry（条目）**: 核心词汇/语法点
- **Media（媒体）**: 来源元数据
- **Clip（片段）**: 时间戳片段
- **EntryClip（关联）**: 多对多关系

### 3. 搜索模块 (Search Module)
- 关键词搜索（PostgreSQL全文搜索）
- 语义搜索（pgvector + OpenAI embeddings）
- 混合排名算法
- 过滤器：语言、类型、主题、难度

### 4. 复习模块 (Review Module)
- 间隔重复系统（SRS）：1天、3天、7天、21天
- 个性化复习队列
- 进度跟踪和分析

### 5. Shadow Lab（跟读实验室）
- 音频录制（Web Audio API）
- 波形可视化
- 录音回放对比
- 匿名化指标收集（时长、尝试次数）

### 6. 建议系统 (Suggestion Module)
- 用户提交内容建议
- 审核工作流（待审核 → 审批 → 发布）
- 自动片段创建
- 贡献者积分系统

### 7. 合规层 (Compliance Layer)
- 媒体嵌入策略矩阵
- 白名单主机管理
- 审计日志
- 重定向生成器（外部内容）

## 数据模型

### 核心实体

```typescript
// User - 用户
{
  id: UUID
  email: string
  role: 'user' | 'moderator' | 'admin'
  createdAt: Date
  lastLoginAt: Date
}

// Entry - 词条
{
  id: UUID
  term: string
  language: string
  pronunciation: string
  meaningSummary: string
  grammarLinks: string[]
  examTopics: string[]
  createdAt: Date
}

// Media - 媒体来源
{
  id: UUID
  title: string
  platform: string
  sourceType: 'embed' | 'external_redirect' | 'self_hosted'
  embedPolicy: JSON
  complianceNotes: string
}

// Clip - 片段
{
  id: UUID
  mediaId: UUID
  startTime: number (ms)
  endTime: number (ms)
  originalSubtitle: string
  translations: JSON
  emotionTags: string[]
  politenessLevel: string
  shadowLabReady: boolean
}

// EntryClip - 关联表
{
  entryId: UUID
  clipId: UUID
  usageBucket: 'literal' | 'metaphor' | 'slang' | 'polite' | 'dialect'
}

// ReviewCard - SRS卡片
{
  id: UUID
  userId: UUID
  entryId: UUID
  interval: number (days)
  nextReviewAt: Date
  reviewCount: number
  lastReviewedAt: Date
}

// Suggestion - 用户建议
{
  id: UUID
  userId: UUID
  clipId: UUID (nullable)
  status: 'pending' | 'approved' | 'rejected'
  content: JSON
  submittedAt: Date
  reviewedBy: UUID (nullable)
  reviewedAt: Date (nullable)
}
```

## API设计原则

1. **版本化**: `/api/v1/...`
2. **RESTful**: 使用标准HTTP动词
3. **分页**: 默认`limit=20`, `offset=0`
4. **错误处理**: 统一错误响应格式
5. **速率限制**: 每IP每分钟100请求
6. **CORS**: 配置允许的源

## 安全考虑

1. **认证**: JWT令牌（15分钟过期）+ 刷新令牌（7天）
2. **授权**: 基于角色的中间件
3. **输入验证**: 所有用户输入通过DTO验证
4. **SQL注入防护**: 使用参数化查询（TypeORM）
5. **XSS防护**: React自动转义 + CSP头
6. **CSRF**: SameSite cookies
7. **速率限制**: Redis + 滑动窗口算法
8. **敏感数据**: 环境变量 + secrets管理

## 性能优化

1. **SSR**: 关键页面服务端渲染
2. **ISR**: 增量静态再生成（Entry、Grammar页面）
3. **CDN**: 静态资源通过CloudFlare
4. **数据库索引**: 搜索字段、外键
5. **缓存策略**:
   - Redis: 热门搜索结果（5分钟TTL）
   - Browser: 静态资源（7天）
   - API: 条目详情（60秒）
6. **懒加载**: 组件和路由代码分割
7. **图片优化**: Next.js Image组件 + WebP

## 监控与可观测性

1. **日志**: 结构化JSON日志 + 日志级别
2. **指标**: 
   - 请求延迟（P50, P95, P99）
   - 错误率
   - 搜索查询性能
   - SRS调度成功率
3. **追踪**: OpenTelemetry（可选）
4. **告警**: 
   - API错误率 > 1%
   - 响应时间 > 2秒
   - 数据库连接池耗尽
   - SRS调度失败

## 部署策略

1. **环境**: dev, staging, production
2. **容器编排**: Docker Compose (dev) / Kubernetes (prod)
3. **CI/CD流程**:
   - 提交 → 运行测试 → 构建镜像 → 推送镜像 → 部署
4. **蓝绿部署**: 最小停机时间
5. **回滚策略**: 保留最近3个版本
6. **数据库迁移**: 向后兼容 + 手动审核

## 合规与版权

### 媒体处理策略

| sourceType | 存储方式 | 播放方式 | 风险等级 |
|------------|----------|----------|----------|
| embed | 仅存储URL | iframe/embed | 低 |
| external_redirect | 仅存储URL | 重定向到原站 | 低 |
| self_hosted | S3存储 | 直接播放 | 需版权证明 |

### 审计要求

- 每个Clip必须记录`embedPolicy`
- 每日审计报告：无合规主机检查
- 版权声明页面：归属和免责声明
- DMCA流程：24小时响应机制

## 扩展性考虑

1. **水平扩展**: 无状态API服务器
2. **数据库分片**: 按语言分片（未来）
3. **微服务拆分**: 搜索、SRS、建议可独立服务
4. **CDN**: 全球分发静态内容
5. **读写分离**: PostgreSQL主从复制

## 技术债务与改进

1. ✅ MVP: PostgreSQL全文搜索
2. 🔄 Phase 2: 专用向量数据库（Pinecone/Weaviate）
3. 🔄 Phase 3: 实时协作功能（WebSocket）
4. 📋 Phase 4: 移动原生应用
5. 📋 Phase 5: AI辅助内容标注

---

**文档版本**: 1.0  
**最后更新**: 2025-11-08  
**负责人**: 架构团队
