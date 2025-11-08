# API 接口规范

## 基础信息

- **基础URL**: `/api/v1`
- **认证方式**: Bearer Token (JWT)
- **内容类型**: `application/json`
- **字符编码**: UTF-8
- **速率限制**: 100请求/分钟/IP，认证用户200请求/分钟

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": { /* 响应数据 */ },
  "meta": {
    "timestamp": "2025-11-08T10:30:00Z",
    "requestId": "uuid"
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "人类可读的错误信息",
    "details": { /* 额外的错误详情 */ }
  },
  "meta": {
    "timestamp": "2025-11-08T10:30:00Z",
    "requestId": "uuid"
  }
}
```

### 分页格式
```json
{
  "data": [ /* 数据数组 */ ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## 1. 认证模块

### 1.1 发送魔法链接

**POST** `/auth/magic-link`

发送无密码登录链接到用户邮箱。

**请求体**:
```json
{
  "email": "user@example.com",
  "redirectUrl": "https://app.example.com/auth/callback"
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "message": "魔法链接已发送到您的邮箱",
    "expiresIn": 900
  }
}
```

### 1.2 验证魔法链接

**POST** `/auth/verify`

验证魔法链接令牌并返回访问令牌。

**请求体**:
```json
{
  "token": "magic-link-token-here"
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

### 1.3 刷新令牌

**POST** `/auth/refresh`

使用刷新令牌获取新的访问令牌。

**请求体**:
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-access-token",
    "expiresIn": 900
  }
}
```

### 1.4 获取当前用户

**GET** `/user/me`

🔒 需要认证

**响应** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00Z",
    "lastLoginAt": "2025-11-08T10:00:00Z",
    "stats": {
      "reviewedCards": 150,
      "shadowLabSessions": 45,
      "contributedSuggestions": 12
    }
  }
}
```

---

## 2. 搜索模块

### 2.1 综合搜索

**GET** `/search`

混合关键词和语义搜索。

**查询参数**:
- `q` (string, required): 搜索关键词
- `language` (string, optional): 过滤语言 (en, ja, zh, ko)
- `type` (string, optional): 内容类型 (entry, clip, grammar)
- `theme` (string[], optional): 主题标签
- `limit` (number, optional): 每页数量 (默认20, 最大100)
- `offset` (number, optional): 偏移量 (默认0)
- `mode` (string, optional): 搜索模式 (keyword, semantic, hybrid) 默认hybrid

**示例请求**:
```
GET /api/v1/search?q=apology&language=ja&limit=10&offset=0&mode=hybrid
```

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "entry-uuid",
      "type": "entry",
      "term": "すみません",
      "pronunciation": "sumimasen",
      "meaningSummary": "对不起；不好意思",
      "language": "ja",
      "clipCount": 15,
      "relevanceScore": 0.95,
      "thumbnail": "https://cdn.example.com/thumbnails/entry-uuid.jpg"
    },
    {
      "id": "clip-uuid",
      "type": "clip",
      "originalSubtitle": "本当にすみませんでした。",
      "translations": {
        "zh": "真是对不起。",
        "en": "I'm truly sorry."
      },
      "mediaTitle": "NHK Easy News",
      "duration": 4.5,
      "relevanceScore": 0.89,
      "thumbnail": "https://cdn.example.com/thumbnails/clip-uuid.jpg"
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  },
  "meta": {
    "searchMode": "hybrid",
    "processingTime": 45
  }
}
```

---

## 3. 内容模块

### 3.1 获取词条详情

**GET** `/entries/{id}`

**路径参数**:
- `id` (string): 词条UUID

**响应** (200):
```json
{
  "success": true,
  "data": {
    "id": "entry-uuid",
    "term": "すみません",
    "language": "ja",
    "pronunciation": "sumimasen",
    "meaningSummary": "对不起；不好意思",
    "grammarLinks": ["jp-te-form-apology"],
    "examTopics": ["JLPT N4", "IELTS: Apology"],
    "clips": {
      "literal": [
        {
          "id": "clip-uuid-1",
          "originalSubtitle": "すみません。",
          "duration": 2.1,
          "mediaTitle": "Daily Conversation",
          "thumbnail": "https://cdn.example.com/..."
        }
      ],
      "polite": [
        {
          "id": "clip-uuid-2",
          "originalSubtitle": "本当にすみませんでした。",
          "duration": 4.5,
          "mediaTitle": "NHK Easy News",
          "thumbnail": "https://cdn.example.com/..."
        }
      ]
    },
    "relatedEntries": [
      {
        "id": "related-uuid",
        "term": "申し訳ありません",
        "relationship": "synonym"
      }
    ],
    "createdAt": "2025-10-01T00:00:00Z"
  }
}
```

### 3.2 获取片段详情

**GET** `/clips/{id}`

**路径参数**:
- `id` (string): 片段UUID

**响应** (200):
```json
{
  "success": true,
  "data": {
    "id": "clip-uuid",
    "mediaId": "media-uuid",
    "startTime": 312300,
    "endTime": 316800,
    "duration": 4.5,
    "originalSubtitle": "本当にすみませんでした。",
    "translations": {
      "zh": "真是对不起。",
      "en": "I'm truly sorry.",
      "ko": "정말 죄송합니다."
    },
    "emotionTags": ["Apology", "Formal"],
    "politenessLevel": "敬体",
    "contextSummary": "Anchor apologises for delay in broadcast",
    "shadowLabReady": true,
    "media": {
      "id": "media-uuid",
      "title": "NHK Easy News",
      "platform": "YouTube",
      "sourceType": "embed",
      "embedUrl": "https://www.youtube.com/watch?v=...&t=312",
      "embedPolicy": {
        "allowed": true,
        "provider": "youtube",
        "restrictions": []
      }
    },
    "relatedEntries": [
      {
        "id": "entry-uuid",
        "term": "すみません",
        "usageBucket": "polite"
      }
    ]
  }
}
```

---

## 4. 复习模块 (SRS)

### 4.1 添加到复习队列

**POST** `/review/add`

🔒 需要认证

**请求体**:
```json
{
  "entryId": "entry-uuid"
}
```

**响应** (201):
```json
{
  "success": true,
  "data": {
    "cardId": "review-card-uuid",
    "entryId": "entry-uuid",
    "nextReviewAt": "2025-11-09T10:00:00Z",
    "interval": 1
  }
}
```

### 4.2 获取下一个复习项

**GET** `/review/next`

🔒 需要认证

返回下一个到期的复习卡片。

**响应** (200):
```json
{
  "success": true,
  "data": {
    "cardId": "review-card-uuid",
    "entry": {
      "id": "entry-uuid",
      "term": "すみません",
      "pronunciation": "sumimasen",
      "meaningSummary": "对不起；不好意思"
    },
    "clips": [
      {
        "id": "clip-uuid",
        "originalSubtitle": "すみません。",
        "duration": 2.1
      }
    ],
    "interval": 3,
    "reviewCount": 2,
    "lastReviewedAt": "2025-11-05T10:00:00Z"
  }
}
```

### 4.3 完成复习

**POST** `/review/complete`

🔒 需要认证

**请求体**:
```json
{
  "cardId": "review-card-uuid",
  "rating": 4,
  "timeSpent": 45
}
```

- `rating` (1-5): 1=完全忘记, 5=轻松记起
- `timeSpent` (seconds): 复习用时

**响应** (200):
```json
{
  "success": true,
  "data": {
    "cardId": "review-card-uuid",
    "nextReviewAt": "2025-11-15T10:00:00Z",
    "interval": 7,
    "reviewCount": 3
  }
}
```

### 4.4 获取复习统计

**GET** `/review/stats`

🔒 需要认证

**响应** (200):
```json
{
  "success": true,
  "data": {
    "totalCards": 150,
    "dueToday": 12,
    "reviewedToday": 8,
    "streak": 15,
    "accuracy": 0.87,
    "intervalDistribution": {
      "1": 20,
      "3": 35,
      "7": 50,
      "21": 45
    }
  }
}
```

---

## 5. Shadow Lab 模块

### 5.1 提交录音

**POST** `/shadow/record`

🔒 需要认证

上传跟读录音（匿名化指标）。

**请求体** (multipart/form-data):
- `clipId` (string): 片段UUID
- `duration` (number): 录音时长（秒）
- `attemptNumber` (number): 尝试次数
- `audioFile` (file, optional): 录音文件（Blob）

**响应** (201):
```json
{
  "success": true,
  "data": {
    "recordId": "shadow-record-uuid",
    "clipId": "clip-uuid",
    "duration": 4.3,
    "attemptNumber": 2,
    "savedAt": "2025-11-08T10:30:00Z"
  }
}
```

### 5.2 获取跟读历史

**GET** `/shadow/history`

🔒 需要认证

**查询参数**:
- `limit` (number): 每页数量 (默认20)
- `offset` (number): 偏移量 (默认0)

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "recordId": "shadow-record-uuid",
      "clipId": "clip-uuid",
      "clipTitle": "NHK Easy News - Apology",
      "duration": 4.3,
      "attemptNumber": 2,
      "recordedAt": "2025-11-08T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## 6. 建议模块

### 6.1 提交内容建议

**POST** `/suggestions`

🔒 需要认证

**请求体**:
```json
{
  "type": "new_clip",
  "language": "ja",
  "content": {
    "term": "お疲れ様です",
    "mediaUrl": "https://youtube.com/watch?v=...",
    "startTime": "00:05:12",
    "endTime": "00:05:16",
    "subtitle": "お疲れ様です。",
    "translation": "辛苦了。",
    "notes": "职场常用问候语"
  }
}
```

**响应** (201):
```json
{
  "success": true,
  "data": {
    "suggestionId": "suggestion-uuid",
    "status": "pending",
    "submittedAt": "2025-11-08T10:30:00Z",
    "estimatedReviewTime": "1-3 days"
  }
}
```

### 6.2 获取建议列表（管理员）

**GET** `/suggestions`

🔒 需要管理员权限

**查询参数**:
- `status` (string): pending, approved, rejected
- `limit`, `offset`: 分页参数

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "suggestion-uuid",
      "userId": "user-uuid",
      "type": "new_clip",
      "status": "pending",
      "content": { /* ... */ },
      "submittedAt": "2025-11-08T10:30:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

### 6.3 审批建议（管理员）

**PATCH** `/suggestions/{id}`

🔒 需要管理员权限

**请求体**:
```json
{
  "status": "approved",
  "reviewNotes": "优质内容，已添加"
}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "suggestionId": "suggestion-uuid",
    "status": "approved",
    "clipId": "newly-created-clip-uuid",
    "reviewedBy": "admin-uuid",
    "reviewedAt": "2025-11-08T11:00:00Z"
  }
}
```

---

## 7. 语法与主题模块

### 7.1 获取语法点详情

**GET** `/grammar/{slug}`

**路径参数**:
- `slug` (string): 语法点标识符，如 `jp-te-form-apology`

**响应** (200):
```json
{
  "success": true,
  "data": {
    "slug": "jp-te-form-apology",
    "language": "ja",
    "title": "Te-form + すみません",
    "description": "使用て形+すみません表示道歉",
    "examples": [
      {
        "japanese": "遅れてすみません。",
        "romaji": "okurete sumimasen",
        "translation": "对不起我迟到了。"
      }
    ],
    "relatedClips": [
      {
        "id": "clip-uuid",
        "originalSubtitle": "忘れてすみません。"
      }
    ],
    "difficulty": "N4",
    "tags": ["apology", "te-form", "polite"]
  }
}
```

### 7.2 获取主题列表

**GET** `/topics`

**查询参数**:
- `language` (string, optional): 过滤语言

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "slug": "workplace-greetings",
      "title": "职场问候",
      "language": "ja",
      "clipCount": 32,
      "thumbnail": "https://cdn.example.com/topics/workplace.jpg"
    }
  ]
}
```

---

## 8. 合规模块

### 8.1 获取合规策略

**GET** `/compliance/policies`

**响应** (200):
```json
{
  "success": true,
  "data": {
    "embedWhitelist": [
      "youtube.com",
      "youtu.be",
      "vimeo.com",
      "bilibili.com"
    ],
    "copyrightPolicy": "我们仅索引和嵌入公开可用的内容...",
    "dmcaContact": "dmca@example.com",
    "lastUpdated": "2025-11-01T00:00:00Z"
  }
}
```

### 8.2 重新索引嵌入（管理员）

**POST** `/embed/reindex`

🔒 需要管理员权限

触发向量重新生成任务。

**请求体**:
```json
{
  "entityType": "entry",
  "entityIds": ["uuid1", "uuid2"]
}
```

**响应** (202):
```json
{
  "success": true,
  "data": {
    "jobId": "job-uuid",
    "status": "queued",
    "estimatedTime": "5-10 minutes"
  }
}
```

---

## 9. 分析模块

### 9.1 记录事件

**POST** `/analytics/events`

🔒 需要认证

**请求体**:
```json
{
  "eventType": "search_query",
  "properties": {
    "query": "apology",
    "resultsCount": 15,
    "clickedPosition": 2
  }
}
```

**响应** (201):
```json
{
  "success": true,
  "data": {
    "eventId": "event-uuid",
    "recorded": true
  }
}
```

---

## 错误代码

| 代码 | HTTP状态 | 说明 |
|------|----------|------|
| AUTH_REQUIRED | 401 | 需要认证 |
| INVALID_TOKEN | 401 | 令牌无效或过期 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| VALIDATION_ERROR | 400 | 请求参数验证失败 |
| RATE_LIMIT_EXCEEDED | 429 | 超过速率限制 |
| SERVER_ERROR | 500 | 服务器内部错误 |
| SERVICE_UNAVAILABLE | 503 | 服务暂时不可用 |

---

**文档版本**: 1.0  
**最后更新**: 2025-11-08
