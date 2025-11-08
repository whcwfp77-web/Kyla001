# SRS（间隔重复系统）实施手册

## 概述

间隔重复系统（Spaced Repetition System, SRS）是基于艾宾浩斯遗忘曲线的科学学习方法，通过在记忆即将衰退时复习来优化长期记忆。

---

## 算法选择：SM-2（SuperMemo 2）

我们采用SM-2算法的简化版本，间隔序列为：**1天 → 3天 → 7天 → 21天**

### 为什么选择SM-2？

- ✅ 简单易实现
- ✅ 经过广泛验证（Anki等应用使用）
- ✅ 适合初学者
- ✅ 不需要复杂的调优

---

## 核心参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| **initialInterval** | 首次复习间隔 | 1天 |
| **intervals** | 间隔序列 | [1, 3, 7, 21] |
| **easeFactor** | 简易因子（1.3-2.5） | 2.5 |
| **graduationThreshold** | 毕业阈值（完成次数） | 4 |

---

## 工作流程

### 1. 添加到复习队列

用户点击"添加到复习"按钮：

```typescript
// 前端调用
POST /api/v1/review/add
{
  "entryId": "uuid"
}

// 后端创建ReviewCard
{
  id: UUID,
  userId: currentUser.id,
  entryId: dto.entryId,
  interval: 1, // 首次1天
  nextReviewAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 明天
  reviewCount: 0,
  easeFactor: 2.5,
  lastReviewedAt: null
}
```

### 2. 获取到期卡片

用户打开"我的复习"页面：

```typescript
GET /api/v1/review/next

// 后端查询逻辑
SELECT * FROM ReviewCard 
WHERE userId = :userId 
  AND nextReviewAt <= NOW()
ORDER BY nextReviewAt ASC
LIMIT 1;
```

### 3. 完成复习

用户完成一张卡片复习：

```typescript
POST /api/v1/review/complete
{
  "cardId": "uuid",
  "rating": 4, // 1-5评分
  "timeSpent": 45 // 秒
}
```

### 4. 计算下次复习时间

根据评分更新间隔：

| 评分 | 说明 | 操作 |
|------|------|------|
| 1 | 完全忘记 | 重置为1天 |
| 2 | 模糊记得 | 重复当前间隔 |
| 3 | 有些困难 | 进入下一间隔 |
| 4 | 较为轻松 | 进入下一间隔 + 调整easeFactor |
| 5 | 非常轻松 | 进入下一间隔 + 大幅调整easeFactor |

---

## 算法实现

### TypeScript实现

```typescript
// srs.service.ts
export class SRSService {
  private readonly INTERVALS = [1, 3, 7, 21]; // 天数
  private readonly GRADUATION_THRESHOLD = 4;

  async completeReview(
    cardId: string,
    rating: number,
    timeSpent: number
  ): Promise<ReviewCard> {
    const card = await this.reviewCardRepository.findOne({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    // 更新复习次数
    card.reviewCount += 1;
    card.lastReviewedAt = new Date();

    // 计算新间隔
    const { newInterval, newEaseFactor } = this.calculateNextInterval(
      card.interval,
      card.reviewCount,
      card.easeFactor,
      rating
    );

    card.interval = newInterval;
    card.easeFactor = newEaseFactor;
    card.nextReviewAt = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);

    // 记录分析数据
    await this.analyticsService.logEvent({
      eventType: 'review_completed',
      properties: {
        cardId,
        rating,
        timeSpent,
        interval: newInterval
      }
    });

    return this.reviewCardRepository.save(card);
  }

  private calculateNextInterval(
    currentInterval: number,
    reviewCount: number,
    easeFactor: number,
    rating: number
  ): { newInterval: number; newEaseFactor: number } {
    let newInterval = currentInterval;
    let newEaseFactor = easeFactor;

    switch (rating) {
      case 1: // 完全忘记
        newInterval = this.INTERVALS[0]; // 重置为1天
        newEaseFactor = Math.max(1.3, easeFactor - 0.2);
        break;

      case 2: // 模糊记得
        newInterval = currentInterval; // 重复当前间隔
        newEaseFactor = Math.max(1.3, easeFactor - 0.15);
        break;

      case 3: // 有些困难
        newInterval = this.getNextInterval(currentInterval);
        break;

      case 4: // 较为轻松
        newInterval = this.getNextInterval(currentInterval);
        newEaseFactor = Math.min(2.5, easeFactor + 0.1);
        break;

      case 5: // 非常轻松
        newInterval = this.getNextInterval(currentInterval);
        newEaseFactor = Math.min(2.5, easeFactor + 0.15);
        // 额外奖励：跳过一个间隔
        if (reviewCount >= 2) {
          newInterval = this.getNextInterval(newInterval);
        }
        break;
    }

    // 毕业后使用easeFactor计算间隔
    if (reviewCount >= this.GRADUATION_THRESHOLD) {
      newInterval = Math.round(newInterval * newEaseFactor);
    }

    return { newInterval, newEaseFactor };
  }

  private getNextInterval(currentInterval: number): number {
    const currentIndex = this.INTERVALS.indexOf(currentInterval);
    
    if (currentIndex === -1) {
      // 已经毕业（超出预设间隔）
      return currentInterval;
    }
    
    if (currentIndex < this.INTERVALS.length - 1) {
      return this.INTERVALS[currentIndex + 1];
    }
    
    // 达到最大间隔（21天），继续使用21天
    return this.INTERVALS[this.INTERVALS.length - 1];
  }

  async getDueCards(userId: string, limit: number = 20): Promise<ReviewCard[]> {
    return this.reviewCardRepository.find({
      where: {
        userId,
        nextReviewAt: LessThanOrEqual(new Date())
      },
      order: {
        nextReviewAt: 'ASC'
      },
      take: limit,
      relations: ['entry', 'entry.clips']
    });
  }

  async getStats(userId: string): Promise<ReviewStats> {
    const allCards = await this.reviewCardRepository.find({ where: { userId } });
    
    const now = new Date();
    const dueCards = allCards.filter(c => c.nextReviewAt <= now);
    
    // 今日已复习
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reviewedToday = await this.reviewCardRepository.count({
      where: {
        userId,
        lastReviewedAt: MoreThanOrEqual(today)
      }
    });

    // 连续天数
    const streak = await this.calculateStreak(userId);

    // 准确率（最近100次复习）
    const recentReviews = await this.getRecentReviews(userId, 100);
    const accuracy = recentReviews.filter(r => r.rating >= 3).length / recentReviews.length || 0;

    // 间隔分布
    const intervalDistribution = allCards.reduce((acc, card) => {
      acc[card.interval] = (acc[card.interval] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalCards: allCards.length,
      dueToday: dueCards.length,
      reviewedToday,
      streak,
      accuracy: parseFloat(accuracy.toFixed(2)),
      intervalDistribution
    };
  }

  private async calculateStreak(userId: string): Promise<number> {
    // 查询连续复习天数
    const reviews = await this.reviewCardRepository
      .createQueryBuilder('card')
      .select('DATE(card.lastReviewedAt)', 'date')
      .where('card.userId = :userId', { userId })
      .andWhere('card.lastReviewedAt IS NOT NULL')
      .groupBy('DATE(card.lastReviewedAt)')
      .orderBy('DATE(card.lastReviewedAt)', 'DESC')
      .getRawMany();

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < reviews.length; i++) {
      const expectedDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      
      if (reviews[i].date === expectedDate) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private async getRecentReviews(userId: string, limit: number): Promise<any[]> {
    return this.reviewCardRepository.find({
      where: { userId, lastReviewedAt: Not(IsNull()) },
      order: { lastReviewedAt: 'DESC' },
      take: limit
    });
  }
}
```

---

## 数据库查询优化

### 索引策略

```sql
-- 高效查询到期卡片
CREATE INDEX idx_review_user_due ON ReviewCard(userId, nextReviewAt) 
WHERE nextReviewAt <= NOW();

-- 查询统计数据
CREATE INDEX idx_review_last_reviewed ON ReviewCard(userId, lastReviewedAt)
WHERE lastReviewedAt IS NOT NULL;

-- 间隔分布
CREATE INDEX idx_review_interval ON ReviewCard(userId, interval);
```

### 定时任务（可选）

每天凌晨2点发送复习提醒：

```typescript
// srs.cron.ts
@Cron('0 2 * * *') // 每天凌晨2点
async sendDailyReviewReminders() {
  const usersWithDueCards = await this.reviewCardRepository
    .createQueryBuilder('card')
    .select('DISTINCT card.userId', 'userId')
    .where('card.nextReviewAt <= NOW()')
    .getRawMany();

  for (const { userId } of usersWithDueCards) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user && user.email) {
      const dueCount = await this.reviewCardRepository.count({
        where: {
          userId,
          nextReviewAt: LessThanOrEqual(new Date())
        }
      });

      await this.emailService.send({
        to: user.email,
        subject: `你有 ${dueCount} 张卡片需要复习 🧠`,
        template: 'daily-review-reminder',
        context: { dueCount }
      });
    }
  }
}
```

---

## 前端UI设计

### 复习页面（/me/review）

```typescript
// ReviewPage.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

export const ReviewPage: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<ReviewCard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const { data: nextCard, isLoading } = useQuery({
    queryKey: ['review', 'next'],
    queryFn: () => fetch('/api/v1/review/next').then(r => r.json())
  });

  const completeMutation = useMutation({
    mutationFn: (data: { cardId: string; rating: number; timeSpent: number }) =>
      fetch('/api/v1/review/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      setShowAnswer(false);
      // 重新获取下一张卡片
      queryClient.invalidateQueries(['review', 'next']);
    }
  });

  const handleRating = (rating: number) => {
    if (!currentCard) return;
    
    completeMutation.mutate({
      cardId: currentCard.id,
      rating,
      timeSpent: 45 // 实际应计时
    });
  };

  useEffect(() => {
    if (nextCard) {
      setCurrentCard(nextCard.data);
    }
  }, [nextCard]);

  if (isLoading) return <div>加载中...</div>;
  if (!currentCard) return <div>🎉 太棒了！今天没有要复习的卡片了！</div>;

  return (
    <div className="review-page">
      <h1>每日复习</h1>
      
      {/* 进度条 */}
      <div className="progress-bar">
        <span>今日已复习：15 / 23</span>
      </div>

      {/* 卡片正面 */}
      <div className="flashcard">
        <h2>{currentCard.entry.term}</h2>
        <p className="pronunciation">{currentCard.entry.pronunciation}</p>
        
        {!showAnswer && (
          <button onClick={() => setShowAnswer(true)} className="show-answer-btn">
            显示答案
          </button>
        )}

        {/* 卡片背面 */}
        {showAnswer && (
          <div className="answer">
            <p className="meaning">{currentCard.entry.meaningSummary}</p>
            
            {/* 相关片段 */}
            <div className="related-clips">
              <h3>示例片段：</h3>
              {currentCard.entry.clips.slice(0, 2).map(clip => (
                <div key={clip.id} className="clip-preview">
                  <p>{clip.originalSubtitle}</p>
                  <p className="translation">{clip.translations.zh}</p>
                  <button onClick={() => playClip(clip.id)}>▶️ 播放</button>
                </div>
              ))}
            </div>

            {/* 评分按钮 */}
            <div className="rating-buttons">
              <button onClick={() => handleRating(1)} className="rating-1">
                😞 完全忘记
              </button>
              <button onClick={() => handleRating(2)} className="rating-2">
                😕 模糊记得
              </button>
              <button onClick={() => handleRating(3)} className="rating-3">
                😐 有些困难
              </button>
              <button onClick={() => handleRating(4)} className="rating-4">
                🙂 较为轻松
              </button>
              <button onClick={() => handleRating(5)} className="rating-5">
                😄 非常轻松
              </button>
            </div>

            {/* 间隔提示 */}
            <p className="interval-hint">
              当前间隔：{currentCard.interval}天 | 
              下次复习：{new Date(currentCard.nextReviewAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* 快捷键提示 */}
      <div className="keyboard-shortcuts">
        <p>快捷键：<kbd>Space</kbd> 显示答案 | <kbd>1-5</kbd> 评分</p>
      </div>
    </div>
  );
};
```

### 统计页面

```typescript
// ReviewStats.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const ReviewStats: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['review', 'stats'],
    queryFn: () => fetch('/api/v1/review/stats').then(r => r.json())
  });

  if (!stats) return <div>加载中...</div>;

  const intervalData = Object.entries(stats.data.intervalDistribution).map(
    ([interval, count]) => ({
      interval: `${interval}天`,
      count
    })
  );

  return (
    <div className="review-stats">
      <h2>学习统计</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>总卡片数</h3>
          <p className="stat-value">{stats.data.totalCards}</p>
        </div>
        
        <div className="stat-card">
          <h3>今日待复习</h3>
          <p className="stat-value">{stats.data.dueToday}</p>
        </div>
        
        <div className="stat-card">
          <h3>今日已复习</h3>
          <p className="stat-value">{stats.data.reviewedToday}</p>
        </div>
        
        <div className="stat-card">
          <h3>连续天数</h3>
          <p className="stat-value">{stats.data.streak} 🔥</p>
        </div>
        
        <div className="stat-card">
          <h3>准确率</h3>
          <p className="stat-value">{(stats.data.accuracy * 100).toFixed(0)}%</p>
        </div>
      </div>

      <h3>间隔分布</h3>
      <BarChart width={600} height={300} data={intervalData}>
        <XAxis dataKey="interval" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#4299e1" />
      </BarChart>
    </div>
  );
};
```

---

## 性能考虑

### 1. 批量查询优化

```typescript
// 一次性加载所有关联数据
const dueCards = await this.reviewCardRepository.find({
  where: { /* ... */ },
  relations: ['entry', 'entry.clips', 'entry.clips.media'],
  take: 20
});
```

### 2. 缓存策略

- **Redis缓存**：用户今日到期卡片列表（TTL: 1小时）
- **前端缓存**：React Query自动缓存查询结果

### 3. 分页加载

复习队列较大时分批加载：

```typescript
GET /api/v1/review/due?limit=20&offset=0
```

---

## 测试策略

### 单元测试

```typescript
// srs.service.spec.ts
describe('SRSService', () => {
  it('should reset interval to 1 day on rating 1', () => {
    const result = service.calculateNextInterval(7, 2, 2.5, 1);
    expect(result.newInterval).toBe(1);
    expect(result.newEaseFactor).toBe(2.3);
  });

  it('should advance to next interval on rating 4', () => {
    const result = service.calculateNextInterval(3, 1, 2.5, 4);
    expect(result.newInterval).toBe(7);
    expect(result.newEaseFactor).toBe(2.6);
  });

  it('should graduate after 4 reviews', () => {
    const result = service.calculateNextInterval(21, 4, 2.5, 4);
    expect(result.newInterval).toBe(Math.round(21 * 2.6)); // easeFactor生效
  });
});
```

### 集成测试

```typescript
// review.e2e-spec.ts
it('should complete a full review cycle', async () => {
  // 1. 添加卡片
  const addRes = await request(app.getHttpServer())
    .post('/api/v1/review/add')
    .send({ entryId: testEntry.id })
    .expect(201);

  // 2. 获取下一张卡片
  const nextRes = await request(app.getHttpServer())
    .get('/api/v1/review/next')
    .expect(200);
  
  expect(nextRes.body.data.cardId).toBe(addRes.body.data.cardId);

  // 3. 完成复习
  await request(app.getHttpServer())
    .post('/api/v1/review/complete')
    .send({ cardId: addRes.body.data.cardId, rating: 4, timeSpent: 30 })
    .expect(200);

  // 4. 验证下次复习时间
  const card = await reviewCardRepository.findOne({ where: { id: addRes.body.data.cardId } });
  expect(card.interval).toBe(3); // 进入下一间隔
});
```

---

## 常见问题

### Q: 为什么不使用Anki的完整算法？
A: Anki算法较复杂，需要更多参数调优。SM-2简化版更适合MVP阶段。

### Q: 用户可以自定义间隔吗？
A: Phase 2可以添加"高级设置"，让用户调整间隔序列。

### Q: 如何处理长时间未复习的卡片？
A: 超过30天未复习的卡片标记为"沉睡"，下次复习重置为1天间隔。

### Q: 如何防止用户作弊（快速点击"非常轻松"）？
A: 记录`timeSpent`，如果<3秒，降低easeFactor调整幅度。

---

**手册版本**: 1.0  
**最后更新**: 2025-11-08
