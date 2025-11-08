# 数据字典

## 核心表结构

### users
用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| email | VARCHAR(255) | 邮箱（唯一） |
| name | VARCHAR(100) | 姓名 |
| role | VARCHAR(20) | 角色: user/admin/curator |
| preferred_languages | VARCHAR(10)[] | 偏好语言列表 |
| last_login_at | TIMESTAMP | 最后登录时间 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### media
媒体源表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | VARCHAR(255) | 媒体标题 |
| platform | VARCHAR(100) | 平台名称 |
| season_episode | VARCHAR(50) | 季/集信息 |
| publication_date | DATE | 发布日期 |
| media_type | VARCHAR(50) | 类型: embed/external_redirect/self_hosted |
| embed_url | TEXT | 嵌入 URL |
| compliance_notes | TEXT | 合规备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### entries
词条表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| term | VARCHAR(255) | 词条 |
| language | VARCHAR(10) | 语言代码 |
| pronunciation | VARCHAR(255) | 发音 |
| meaning_summary | TEXT | 含义摘要 |
| usage_bucket | VARCHAR(50) | 用法分类 |
| emotion_tags | TEXT[] | 情感标签 |
| politeness_level | VARCHAR(50) | 礼貌级别 |
| context_summary | TEXT | 上下文摘要 |
| srs_default_interval | INT | SRS 默认间隔（天） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### clips
片段表（包含向量嵌入）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| media_id | UUID | 媒体 ID（外键） |
| start_time_ms | INT | 开始时间（毫秒） |
| end_time_ms | INT | 结束时间（毫秒） |
| duration_sec | DECIMAL(5,2) | 持续时间（秒） |
| original_subtitle | TEXT | 原始字幕 |
| translations | JSONB | 翻译（多语言） |
| speakers | TEXT[] | 说话人列表 |
| thumbnail_url | TEXT | 缩略图 URL |
| embed_policy | VARCHAR(50) | 嵌入策略 |
| embed_url | TEXT | 嵌入 URL |
| redirect_url | TEXT | 重定向 URL |
| shadow_lab_ready | BOOLEAN | Shadow Lab 就绪 |
| replacement_variants | TEXT[] | 替代表达 |
| grammar_links | TEXT[] | 语法链接 |
| exam_topics | TEXT[] | 考试主题 |
| notes | TEXT | 备注 |
| ingest_source | VARCHAR(50) | 摄取来源 |
| review_status | VARCHAR(50) | 审核状态 |
| auditor | VARCHAR(255) | 审核人 |
| reviewed_at | TIMESTAMP | 审核时间 |
| embedding | vector(1536) | 向量嵌入 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### entry_clips
词条-片段关联表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| entry_id | UUID | 词条 ID（外键） |
| clip_id | UUID | 片段 ID（外键） |
| created_at | TIMESTAMP | 创建时间 |

### review_cards
SRS 复习卡片表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID（外键） |
| clip_id | UUID | 片段 ID（外键） |
| interval | INT | 间隔（天） |
| repetitions | INT | 重复次数 |
| ease_factor | DECIMAL(5,2) | 难度因子 |
| due_date | TIMESTAMP | 到期日期 |
| last_reviewed_at | TIMESTAMP | 最后复习时间 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### shadow_records
Shadow Lab 记录表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID（外键） |
| clip_id | UUID | 片段 ID（外键） |
| metrics | JSONB | 指标数据 |
| audio_url | TEXT | 音频 URL |
| created_at | TIMESTAMP | 创建时间 |

### suggestions
用户建议表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID（外键） |
| entry_term | VARCHAR(255) | 词条 |
| language | VARCHAR(10) | 语言代码 |
| media_url | TEXT | 媒体 URL |
| start_time | VARCHAR(20) | 开始时间 |
| end_time | VARCHAR(20) | 结束时间 |
| notes | TEXT | 备注 |
| status | VARCHAR(50) | 状态: pending/approved/rejected |
| approved_clip_id | UUID | 批准的片段 ID |
| reviewed_by | VARCHAR(255) | 审核人 |
| reviewed_at | TIMESTAMP | 审核时间 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 索引

- `idx_clips_media_id`: clips(media_id)
- `idx_clips_embed_policy`: clips(embed_policy)
- `idx_clips_review_status`: clips(review_status)
- `idx_entries_language`: entries(language)
- `idx_entries_term`: entries(term)
- `idx_review_cards_user_due`: review_cards(user_id, due_date)
- `idx_clips_embedding`: clips(embedding) - 向量相似度搜索索引

## 关系图

```
users ──┬── review_cards ── clips
        ├── shadow_records ── clips
        └── suggestions

media ── clips ── entry_clips ── entries
                          │
                          └── entry_relations ── entries
```
