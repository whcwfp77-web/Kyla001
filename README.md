# 语言学习平台 🌍📚

通过真实媒体片段学习语言的现代化平台。

## ✨ 核心功能

- 🔍 **智能搜索** - 关键词 + 语义搜索混合
- 📖 **词条学习** - 真实语境中的词汇和短语
- 🎬 **片段播放** - 嵌入式媒体播放（符合版权）
- 🗣️ **Shadow Lab** - 跟读实验室，提升发音
- 🧠 **SRS复习** - 间隔重复系统，优化记忆
- 📝 **用户贡献** - 社区建议和内容审核
- 📊 **学习分析** - 个性化进度跟踪

## 🏗️ 技术架构

### 前端
- **框架**: Next.js 14 (App Router)
- **UI库**: React 18 + Tailwind CSS + shadcn/ui
- **状态管理**: React Query + Zustand
- **PWA**: next-pwa（离线支持）

### 后端
- **框架**: NestJS + Fastify
- **ORM**: TypeORM
- **数据库**: PostgreSQL 15 + pgvector
- **缓存**: Redis 7
- **对象存储**: MinIO (S3兼容)

### 基础设施
- **容器化**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana（待实施）

## 🚀 快速开始

### 先决条件

- Node.js 20+
- Docker & Docker Compose
- Git

### 安装步骤

1. **克隆仓库**

```bash
git clone <repository-url>
cd workspace
```

2. **配置环境变量**

```bash
# 后端
cp backend/.env.example backend/.env

# 前端
cp frontend/.env.example frontend/.env
```

3. **启动所有服务**

```bash
docker-compose up -d
```

这将启动：
- PostgreSQL (端口 5432)
- Redis (端口 6379)
- MinIO (端口 9000, 控制台 9001)
- 后端API (端口 3001)
- 前端应用 (端口 3000)

4. **运行数据库迁移**

```bash
cd backend
npm install
npm run migration:run
```

5. **（可选）填充种子数据**

```bash
npm run seed
```

6. **访问应用**

- 前端: http://localhost:3000
- 后端API文档: http://localhost:3001/api/docs
- MinIO控制台: http://localhost:9001

## 📁 项目结构

```
/workspace
├── backend/                 # NestJS后端
│   ├── src/
│   │   ├── modules/        # 功能模块
│   │   ├── db/             # 数据库实体和迁移
│   │   ├── common/         # 通用工具
│   │   ├── config/         # 配置文件
│   │   └── main.ts         # 应用入口
│   └── package.json
├── frontend/                # Next.js前端
│   ├── src/
│   │   ├── app/            # App Router页面
│   │   ├── components/     # React组件
│   │   └── lib/            # 工具库
│   └── package.json
├── services/                # 后台服务
│   ├── clip-ingest/        # 字幕摄取
│   └── embedding-worker/   # 向量生成
├── infrastructure/          # 基础设施
│   ├── docker/             # Docker配置
│   └── terraform/          # IaC脚本
├── docs/                    # 文档
│   ├── architecture.md     # 架构文档
│   ├── api-contract.md     # API规范
│   ├── data-dictionary.md  # 数据字典
│   ├── compliance-checklist.md  # 合规清单
│   ├── shadow-lab-spec.md  # Shadow Lab规范
│   └── srs-playbook.md     # SRS实施手册
└── docker-compose.yml       # 服务编排
```

## 🛠️ 开发

### 后端开发

```bash
cd backend
npm install
npm run start:dev   # 开发模式（热重载）
npm run test        # 运行测试
npm run lint        # 代码检查
```

### 前端开发

```bash
cd frontend
npm install
npm run dev         # 开发模式
npm run build       # 生产构建
npm run test        # 运行测试
```

### 数据库管理

```bash
# 生成迁移文件
npm run migration:generate -- src/db/migrations/MigrationName

# 运行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert
```

## 📚 API文档

完整的API文档可在应用运行时访问：

http://localhost:3001/api/docs

主要端点：
- `POST /auth/magic-link` - 发送登录链接
- `GET /search` - 综合搜索
- `GET /entries/{id}` - 词条详情
- `GET /clips/{id}` - 片段详情
- `POST /review/add` - 添加到复习队列
- `GET /review/next` - 获取下一个复习项
- `POST /shadow/record` - 提交跟读录音

详见 [docs/api-contract.md](./docs/api-contract.md)

## 🧪 测试

### 后端测试

```bash
cd backend
npm run test              # 单元测试
npm run test:e2e          # 端到端测试
npm run test:cov          # 测试覆盖率
```

### 前端测试

```bash
cd frontend
npm run test              # Jest单元测试
npm run test:e2e          # Playwright E2E测试
```

## 📈 30天交付计划

- ✅ **第1周**: 基础架构、认证、数据库模式
- 🔄 **第2周**: 内容管道、Shadow Lab MVP
- 📅 **第3周**: SRS系统、语法透镜
- 📅 **第4周**: 建议系统、SEO、向量搜索

详见 [项目计划](./docs/architecture.md#30-Day-Delivery-Schedule)

## 🔒 安全与合规

- ✅ JWT认证 + 魔法链接
- ✅ HTTPS强制
- ✅ CORS配置
- ✅ 速率限制
- ✅ SQL注入防护
- ✅ XSS防护
- ✅ GDPR合规

详见 [docs/compliance-checklist.md](./docs/compliance-checklist.md)

## 🤝 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)（待创建）

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

## 📞 联系

- **技术支持**: tech@example.com
- **版权问题**: dmca@example.com
- **隐私咨询**: privacy@example.com

---

**版本**: 1.0.0  
**最后更新**: 2025-11-08
