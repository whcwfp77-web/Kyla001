# API 契约文档

## 基础信息

- **Base URL**: `https://api.example.com/api/v1`
- **认证**: Bearer Token (JWT)
- **内容类型**: `application/json`

## 认证端点

### POST /auth/magic-link
请求魔法链接认证。

**请求体**:
```json
{
  "email": "user@example.com"
}
```

**响应**:
```json
{
  "message": "Magic link sent to email"
}
```

### POST /auth/verify
验证魔法链接 token。

**请求体**:
```json
{
  "token": "magic-link-token"
}
```

**响应**:
```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## 搜索端点

### GET /search
关键词 + 语义融合搜索。

**查询参数**:
- `query` (必需): 搜索查询
- `type`: 片段类型
- `language`: 语言代码
- `theme`: 主题标签
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)

**响应**:
```json
{
  "results": [
    {
      "id": "uuid",
      "entryTerm": "すみません",
      "language": "Japanese",
      "mediaTitle": "NHK Easy News",
      "startTime": "00:05:12",
      "endTime": "00:05:16",
      "thumbnailUrl": "https://...",
      "embedPolicy": "embed",
      "embedUrl": "https://..."
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

## 词条端点

### GET /entries/{id}
获取词条详情，包含片段和相关表达。

**响应**:
```json
{
  "id": "uuid",
  "term": "すみません",
  "language": "Japanese",
  "pronunciation": "sumimasen",
  "meaningSummary": "对不起；不好意思",
  "clips": [...],
  "relatedEntries": [...]
}
```

## 片段端点

### GET /clips/{id}
获取片段详情，包含元数据、字幕和嵌入策略。

**响应**:
```json
{
  "id": "uuid",
  "media": {
    "title": "NHK Easy News",
    "platform": "YouTube"
  },
  "startTimeMs": 312000,
  "endTimeMs": 316800,
  "originalSubtitle": "本当にすみませんでした。",
  "translations": {
    "zh-CN": "真是对不起。",
    "en-US": "I'm truly sorry."
  },
  "embedPolicy": "embed",
  "embedUrl": "https://..."
}
```

## 复习端点

### POST /review/add
添加片段到复习卡片组。

**请求体**:
```json
{
  "clipId": "uuid"
}
```

### GET /review/next
获取下一个到期的复习卡片。

**响应**:
```json
{
  "id": "uuid",
  "clip": {...},
  "dueDate": "2024-01-15T10:00:00Z"
}
```

### POST /review/complete
完成复习并更新间隔。

**请求体**:
```json
{
  "cardId": "uuid",
  "quality": 4
}
```

**质量评分**: 0-5 (0=完全忘记, 5=完美回忆)

## Shadow Lab 端点

### POST /shadow/record
记录 Shadow Lab 练习会话。

**请求体**:
```json
{
  "clipId": "uuid",
  "metrics": {
    "duration": 4.5,
    "pitchContour": [0.1, 0.2, ...],
    "waveformStats": {
      "peaks": [...],
      "valleys": [...]
    },
    "accuracy": 0.85
  }
}
```

## 建议端点

### POST /suggestions
提交内容建议。

**请求体**:
```json
{
  "entryTerm": "新しい言葉",
  "language": "Japanese",
  "mediaUrl": "https://...",
  "startTime": "00:10:30",
  "endTime": "00:10:35",
  "notes": "很好的例子"
}
```

### PATCH /suggestions/{id}
更新建议状态（仅管理员）。

**请求体**:
```json
{
  "status": "approved",
  "approvedClipId": "uuid"
}
```

## 管理员端点

### POST /admin/embed/reindex
队列向量嵌入作业（仅管理员）。

**请求体**:
```json
{
  "clipId": "uuid"
}
```

## 合规端点

### GET /compliance/policies
获取合规策略配置。

**响应**:
```json
{
  "embedWhitelist": ["youtube.com", "vimeo.com"],
  "auditEnabled": true
}
```

## 用户端点

### GET /user/me
获取当前用户信息。

**响应**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "user",
  "preferredLanguages": ["Japanese", "Korean"]
}
```

## 错误响应

所有错误遵循以下格式:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## 状态码

- `200`: 成功
- `201`: 创建成功
- `400`: 请求错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 未找到
- `500`: 服务器错误
