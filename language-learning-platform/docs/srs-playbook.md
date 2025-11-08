# SRS (间隔重复系统) 操作手册

## 概述

SRS (Spaced Repetition System) 是一个基于科学记忆曲线的复习系统，帮助用户高效记忆语言学习内容。

## 算法: SM-2

我们使用简化的 SM-2 算法：

### 参数

- `interval`: 复习间隔（天）
- `repetitions`: 重复次数
- `easeFactor`: 难度因子（默认 2.5）

### 质量评分

- `0`: 完全忘记
- `1`: 错误回忆
- `2`: 困难回忆
- `3`: 困难但正确
- `4`: 容易回忆
- `5`: 完美回忆

### 算法逻辑

```typescript
if (quality >= 3) {
  if (repetitions === 0) {
    interval = 1;
  } else if (repetitions === 1) {
    interval = 6;
  } else {
    interval = Math.round(interval * easeFactor);
  }
  repetitions += 1;
} else {
  repetitions = 0;
  interval = 1;
}

// 更新难度因子
easeFactor = Math.max(
  1.3,
  easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
);
```

## 默认间隔

- 新卡片: 3 天
- 首次复习: 1 天
- 第二次复习: 6 天
- 后续: 根据 easeFactor 递增

## 调度器

### 每日任务

1. 查询所有到期的复习卡片 (`dueDate <= NOW()`)
2. 按到期时间排序
3. 返回下一个到期的卡片

### 完成复习后

1. 根据质量评分更新 `interval` 和 `repetitions`
2. 更新 `easeFactor`
3. 计算新的 `dueDate = NOW() + interval days`
4. 更新 `lastReviewedAt`

## API 端点

### GET /api/v1/review/next

获取下一个到期的复习卡片。

**响应**:
```json
{
  "id": "uuid",
  "clip": {
    "id": "uuid",
    "originalSubtitle": "...",
    "translations": {...}
  },
  "dueDate": "2024-01-15T10:00:00Z",
  "interval": 3,
  "repetitions": 2
}
```

### POST /api/v1/review/complete

完成复习并更新间隔。

**请求体**:
```json
{
  "cardId": "uuid",
  "quality": 4
}
```

## 用户体验

### 复习界面

1. 显示视频片段（可播放）
2. 显示字幕
3. 用户回忆后选择质量评分
4. 提交后显示正确答案
5. 自动加载下一个卡片

### 统计信息

- 今日复习数量
- 到期卡片数量
- 学习连续天数
- 总体准确率

## 性能优化

- 使用索引 `idx_review_cards_user_due` 快速查询
- 批量更新到期日期
- 缓存用户统计信息

## 监控

- SRS 调度器失败告警
- 复习完成率指标
- 平均间隔时间统计
