# 数据字典

## 概述

本文档定义了语言学习平台的所有数据实体、字段、关系和约束。

---

## 1. User（用户表）

**用途**: 存储用户账户信息和认证数据

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 用户邮箱 |
| role | ENUM | NOT NULL, DEFAULT 'user' | 角色：user, moderator, admin |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |
| lastLoginAt | TIMESTAMP | NULL | 最后登录时间 |
| isActive | BOOLEAN | NOT NULL, DEFAULT true | 账户是否激活 |
| metadata | JSONB | NULL | 额外元数据（偏好设置等） |

**索引**:
- `idx_user_email` ON (email)
- `idx_user_role` ON (role)

---

## 2. Entry（词条表）

**用途**: 存储核心学习词汇、短语和语法点

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| term | VARCHAR(500) | NOT NULL | 词条内容 |
| language | VARCHAR(10) | NOT NULL | 语言代码（ISO 639-1） |
| pronunciation | TEXT | NULL | 发音标注（假名/音标） |
| meaningSummary | TEXT | NOT NULL | 含义摘要 |
| grammarLinks | TEXT[] | NULL | 关联语法点slug数组 |
| examTopics | TEXT[] | NULL | 考试主题标签 |
| difficulty | VARCHAR(20) | NULL | 难度级别（N5, N4, IELTS 6.0等） |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |
| updatedAt | TIMESTAMP | NOT NULL | 更新时间 |
| createdBy | UUID | FK -> User.id | 创建者 |
| embedding | VECTOR(1536) | NULL | 语义向量（OpenAI ada-002） |

**索引**:
- `idx_entry_language` ON (language)
- `idx_entry_term_gin` GIN ON (to_tsvector('simple', term))
- `idx_entry_embedding_ivfflat` IVFFlat ON (embedding) USING ivfflat

**全文搜索**:
- `tsv_entry_search` GIN索引，包含 term + meaningSummary

---

## 3. Media（媒体来源表）

**用途**: 存储媒体来源的元数据

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| title | VARCHAR(500) | NOT NULL | 媒体标题 |
| platform | VARCHAR(100) | NOT NULL | 平台名称（YouTube, Netflix等） |
| sourceType | ENUM | NOT NULL | 类型：embed, external_redirect, self_hosted |
| embedPolicy | JSONB | NOT NULL | 嵌入策略配置 |
| complianceNotes | TEXT | NOT NULL | 合规说明（版权、许可等） |
| officialUrl | TEXT | NULL | 官方链接 |
| language | VARCHAR(10) | NOT NULL | 主要语言 |
| releaseDate | DATE | NULL | 发布日期 |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |
| updatedAt | TIMESTAMP | NOT NULL | 更新时间 |

**索引**:
- `idx_media_platform` ON (platform)
- `idx_media_source_type` ON (sourceType)

**embedPolicy JSON结构**:
```json
{
  "allowed": true,
  "provider": "youtube",
  "restrictions": [],
  "embedUrl": "https://youtube.com/embed/...",
  "redirectUrl": "https://youtube.com/watch?v=..."
}
```

---

## 4. Clip（片段表）

**用途**: 存储具体的时间戳片段

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| mediaId | UUID | FK -> Media.id, NOT NULL | 所属媒体 |
| startTime | INTEGER | NOT NULL | 开始时间（毫秒） |
| endTime | INTEGER | NOT NULL | 结束时间（毫秒） |
| duration | DECIMAL(10,3) | NOT NULL, COMPUTED | 时长（秒），自动计算 |
| originalSubtitle | TEXT | NOT NULL | 原文字幕 |
| translations | JSONB | NOT NULL | 多语言翻译 |
| emotionTags | TEXT[] | NULL | 情感标签 |
| politenessLevel | VARCHAR(50) | NULL | 礼貌程度 |
| contextSummary | TEXT | NULL | 场景描述 |
| speakers | TEXT[] | NULL | 说话者名称 |
| shadowLabReady | BOOLEAN | NOT NULL, DEFAULT false | 是否适合跟读 |
| thumbnailUrl | TEXT | NULL | 缩略图URL |
| embedding | VECTOR(1536) | NULL | 语义向量 |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |
| updatedAt | TIMESTAMP | NOT NULL | 更新时间 |
| createdBy | UUID | FK -> User.id | 创建者 |

**索引**:
- `idx_clip_media_id` ON (mediaId)
- `idx_clip_shadow_ready` ON (shadowLabReady)
- `idx_clip_embedding_ivfflat` IVFFlat ON (embedding)

**约束**:
- CHECK: `endTime > startTime`
- CHECK: `duration > 0 AND duration <= 30` (最长30秒)

**translations JSON结构**:
```json
{
  "zh": "中文翻译",
  "en": "English translation",
  "ko": "한국어 번역"
}
```

---

## 5. EntryClip（词条-片段关联表）

**用途**: 多对多关系，连接词条和片段

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| entryId | UUID | FK -> Entry.id, NOT NULL | 词条ID |
| clipId | UUID | FK -> Clip.id, NOT NULL | 片段ID |
| usageBucket | ENUM | NOT NULL | 用法分类：literal, metaphor, slang, polite, dialect |
| relevanceScore | DECIMAL(3,2) | NULL | 相关性评分（0-1） |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |
| createdBy | UUID | FK -> User.id | 创建者 |

**主键**:
- PK: (entryId, clipId, usageBucket)

**索引**:
- `idx_entryclip_entry` ON (entryId)
- `idx_entryclip_clip` ON (clipId)
- `idx_entryclip_bucket` ON (usageBucket)

---

## 6. ReviewCard（复习卡片表）

**用途**: SRS间隔重复系统的复习调度

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| userId | UUID | FK -> User.id, NOT NULL | 用户ID |
| entryId | UUID | FK -> Entry.id, NOT NULL | 词条ID |
| interval | INTEGER | NOT NULL, DEFAULT 1 | 复习间隔（天数） |
| nextReviewAt | TIMESTAMP | NOT NULL | 下次复习时间 |
| reviewCount | INTEGER | NOT NULL, DEFAULT 0 | 复习次数 |
| lastReviewedAt | TIMESTAMP | NULL | 最后复习时间 |
| easeFactor | DECIMAL(3,2) | NOT NULL, DEFAULT 2.5 | 简易因子（SM-2算法） |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |

**索引**:
- `idx_review_user_due` ON (userId, nextReviewAt) WHERE nextReviewAt <= NOW()
- `idx_review_entry` ON (entryId)

**唯一约束**:
- UNIQUE: (userId, entryId)

---

## 7. Suggestion（用户建议表）

**用途**: 存储用户提交的内容建议

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| userId | UUID | FK -> User.id, NOT NULL | 提交者ID |
| clipId | UUID | FK -> Clip.id, NULL | 关联片段（审批后创建） |
| status | ENUM | NOT NULL, DEFAULT 'pending' | 状态：pending, approved, rejected |
| type | VARCHAR(50) | NOT NULL | 建议类型：new_clip, correction, translation |
| content | JSONB | NOT NULL | 建议内容 |
| submittedAt | TIMESTAMP | NOT NULL | 提交时间 |
| reviewedBy | UUID | FK -> User.id, NULL | 审核者ID |
| reviewedAt | TIMESTAMP | NULL | 审核时间 |
| reviewNotes | TEXT | NULL | 审核备注 |

**索引**:
- `idx_suggestion_status` ON (status)
- `idx_suggestion_user` ON (userId)
- `idx_suggestion_submitted` ON (submittedAt DESC)

**content JSON结构示例**:
```json
{
  "term": "お疲れ様です",
  "mediaUrl": "https://youtube.com/watch?v=...",
  "startTime": "00:05:12",
  "endTime": "00:05:16",
  "subtitle": "お疲れ様です。",
  "translation": "辛苦了。",
  "notes": "职场常用问候语"
}
```

---

## 8. ShadowRecord（跟读记录表）

**用途**: 存储用户跟读练习的匿名化指标

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| userId | UUID | FK -> User.id, NOT NULL | 用户ID |
| clipId | UUID | FK -> Clip.id, NOT NULL | 片段ID |
| duration | DECIMAL(10,3) | NOT NULL | 录音时长（秒） |
| attemptNumber | INTEGER | NOT NULL | 尝试次数 |
| recordedAt | TIMESTAMP | NOT NULL | 录音时间 |
| waveformStats | JSONB | NULL | 匿名化波形统计 |

**索引**:
- `idx_shadow_user` ON (userId)
- `idx_shadow_clip` ON (clipId)
- `idx_shadow_recorded` ON (recordedAt DESC)

**waveformStats JSON结构**:
```json
{
  "averageAmplitude": 0.45,
  "peakAmplitude": 0.89,
  "silenceDuration": 0.3,
  "energyDistribution": [0.2, 0.5, 0.8, 0.6, 0.3]
}
```

---

## 9. GrammarPoint（语法点表）

**用途**: 存储语法规则和解释

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| slug | VARCHAR(200) | UNIQUE, NOT NULL | URL友好标识符 |
| language | VARCHAR(10) | NOT NULL | 语言代码 |
| title | VARCHAR(500) | NOT NULL | 标题 |
| description | TEXT | NOT NULL | 详细说明 |
| examples | JSONB | NOT NULL | 示例数组 |
| difficulty | VARCHAR(20) | NULL | 难度级别 |
| tags | TEXT[] | NULL | 标签 |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |
| updatedAt | TIMESTAMP | NOT NULL | 更新时间 |

**索引**:
- `idx_grammar_slug` ON (slug)
- `idx_grammar_language` ON (language)

---

## 10. Topic（主题表）

**用途**: 内容主题分类

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| slug | VARCHAR(200) | UNIQUE, NOT NULL | URL友好标识符 |
| title | VARCHAR(500) | NOT NULL | 标题 |
| description | TEXT | NULL | 描述 |
| language | VARCHAR(10) | NOT NULL | 语言代码 |
| thumbnailUrl | TEXT | NULL | 缩略图 |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |

**索引**:
- `idx_topic_slug` ON (slug)
- `idx_topic_language` ON (language)

---

## 11. ClipTopic（片段-主题关联表）

**用途**: 多对多关系，连接片段和主题

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| clipId | UUID | FK -> Clip.id, NOT NULL | 片段ID |
| topicId | UUID | FK -> Topic.id, NOT NULL | 主题ID |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |

**主键**:
- PK: (clipId, topicId)

---

## 12. AnalyticsEvent（分析事件表）

**用途**: 记录用户行为事件

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| userId | UUID | FK -> User.id, NULL | 用户ID（可匿名） |
| eventType | VARCHAR(100) | NOT NULL | 事件类型 |
| properties | JSONB | NULL | 事件属性 |
| occurredAt | TIMESTAMP | NOT NULL | 发生时间 |
| sessionId | VARCHAR(100) | NULL | 会话ID |

**索引**:
- `idx_analytics_event_type` ON (eventType)
- `idx_analytics_occurred` ON (occurredAt DESC)
- `idx_analytics_user` ON (userId) WHERE userId IS NOT NULL

**常见事件类型**:
- `search_query`
- `clip_viewed`
- `shadow_lab_session`
- `review_completed`
- `suggestion_submitted`

---

## 关系图

```
User ──┬── 1:N ──> ReviewCard
       ├── 1:N ──> Suggestion
       ├── 1:N ──> ShadowRecord
       ├── 1:N ──> AnalyticsEvent
       └── 1:N ──> Entry (createdBy)

Entry ──┬── N:M ──> Clip (via EntryClip)
        └── 1:N ──> ReviewCard

Media ──── 1:N ──> Clip

Clip ──┬── N:M ──> Entry (via EntryClip)
       ├── N:M ──> Topic (via ClipTopic)
       ├── 1:N ──> Suggestion
       └── 1:N ──> ShadowRecord

Topic ──── N:M ──> Clip (via ClipTopic)
```

---

## 枚举类型

### UserRole
- `user` - 普通用户
- `moderator` - 审核员
- `admin` - 管理员

### SourceType
- `embed` - 允许嵌入（iframe）
- `external_redirect` - 重定向到外部站点
- `self_hosted` - 自托管内容

### UsageBucket
- `literal` - 字面意思
- `metaphor` - 隐喻用法
- `slang` - 俚语
- `polite` - 礼貌/正式
- `dialect` - 方言

### SuggestionStatus
- `pending` - 待审核
- `approved` - 已批准
- `rejected` - 已拒绝

---

## 数据完整性规则

1. **级联删除**:
   - 删除User时，匿名化其创建的内容（不删除Entry/Clip）
   - 删除Entry时，删除关联的ReviewCard
   - 删除Media时，删除关联的Clip
   - 删除Clip时，删除EntryClip关联

2. **外键约束**:
   - 所有FK字段必须引用存在的记录
   - ON DELETE CASCADE/SET NULL根据业务逻辑配置

3. **CHECK约束**:
   - Clip.duration: 3秒 <= duration <= 30秒
   - ReviewCard.interval: >= 1天
   - ReviewCard.easeFactor: 1.3 <= easeFactor <= 2.5

4. **NOT NULL规则**:
   - 核心字段（term, originalSubtitle等）不能为空
   - 可选字段（pronunciation, notes等）允许NULL

---

## 数据保留策略

- **AnalyticsEvent**: 保留90天后归档
- **ShadowRecord**: 永久保留（匿名化）
- **Suggestion**: 已处理的建议保留1年
- **用户数据**: 账户删除后30天完全清除

---

**文档版本**: 1.0  
**最后更新**: 2025-11-08
