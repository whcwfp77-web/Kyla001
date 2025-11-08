# Shadow Lab 规范

## 概述

Shadow Lab 是一个跟读练习功能，允许用户播放视频片段，静音后跟读，然后录制自己的发音进行对比。

## 核心流程

1. **播放**: 用户播放原始视频片段（带字幕）
2. **静音**: 用户点击静音按钮，视频继续播放但无声音
3. **跟读**: 用户跟随视频节奏跟读
4. **录制**: 用户录制自己的发音
5. **回放**: 播放用户录音与原始音频对比
6. **保存**: 保存练习记录和指标

## UI 组件

### ShadowLab 组件

- 视频播放器（支持时间戳跳转）
- 字幕显示（高对比度，符合无障碍标准）
- 波形可视化
- 录音控制（开始/停止/回放）
- 指标显示（准确度、音调轮廓）

## 数据模型

### ShadowRecord

```typescript
{
  id: string;
  userId: string;
  clipId: string;
  metrics: {
    duration: number;
    pitchContour?: number[];
    waveformStats?: {
      peaks: number[];
      valleys: number[];
    };
    accuracy?: number;
  };
  audioUrl?: string;
  createdAt: Date;
}
```

## API 端点

### POST /api/v1/shadow/record

记录 Shadow Lab 练习会话。

**请求体**:
```json
{
  "clipId": "uuid",
  "metrics": {
    "duration": 4.5,
    "pitchContour": [0.1, 0.2, 0.15, ...],
    "waveformStats": {
      "peaks": [0.8, 0.9, 0.7, ...],
      "valleys": [0.2, 0.1, 0.3, ...]
    },
    "accuracy": 0.85
  }
}
```

## 性能要求

- 录音延迟: < 100ms
- 波形渲染: < 50ms
- 音频上传: 后台异步处理

## 隐私和安全

- 波形统计数据匿名化（采样前100个点）
- 音频文件存储在安全对象存储中
- 用户数据不包含可识别信息

## 浏览器支持

- Chrome/Edge: 完全支持
- Firefox: 完全支持
- Safari: 需要用户手势启动录音
- 移动端: iOS Safari 需要特殊处理

## 无障碍支持

- 键盘导航支持
- 屏幕阅读器兼容
- 字幕高对比度显示
- ARIA 标签完整
