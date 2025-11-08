# Shadow Lab 跟读实验室 - 功能规范

## 概述

Shadow Lab（跟读实验室）是一个互动式语音练习模块，帮助用户通过模仿原生说话者来提高发音和语调。

---

## 核心功能

### 1. 播放原音 → 静音 → 录制 → 对比回放

**工作流程**：

```
┌─────────────┐
│ 1. 播放原音 │ 用户听片段（带字幕）
└──────┬──────┘
       │
┌──────▼──────┐
│ 2. 静音播放 │ 再次播放但无声（挑战模式）
└──────┬──────┘
       │
┌──────▼──────┐
│ 3. 开始录音 │ 用户跟读并录制自己的声音
└──────┬──────┘
       │
┌──────▼──────┐
│ 4. 回放对比 │ 播放录音 + 显示波形对比
└──────┬──────┘
       │
┌──────▼──────┐
│ 5. 再试一次 │ 返回步骤1（或标记完成）
└─────────────┘
```

---

## 用户界面设计

### 主界面布局

```
┌─────────────────────────────────────────────────────┐
│  Shadow Lab                         [X 关闭]        │
├─────────────────────────────────────────────────────┤
│                                                       │
│  🎬 NHK Easy News - Apology Scene                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━ 00:05:12 - 00:05:17   │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │  原文：本当にすみませんでした。              │    │
│  │  拼音：hontō ni sumimasen deshita             │    │
│  │  翻译：真是对不起。                           │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │                                               │    │
│  │    [播放原音波形]                             │    │
│  │    ▁▃▅▇█▇▅▃▁▁▃▅▇▅▃▁                        │    │
│  │                                               │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│         [▶️ 播放原音]  [🔇 静音播放]              │
│         [🎙️ 开始录音]  [🔄 重新录制]              │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │  你的录音：                                   │    │
│  │  ▁▂▄▆█▆▄▂▁▁▂▄▆▄▂▁                        │    │
│  │                      [▶️ 播放我的录音]       │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  尝试次数：3    录音时长：4.3秒                     │
│                                                       │
│  [✅ 完成练习]  [💾 保存到我的复习]                │
└─────────────────────────────────────────────────────┘
```

### 视觉状态指示

| 状态 | UI显示 |
|------|--------|
| 播放原音 | 波形动画 + 绿色进度条 |
| 静音播放 | 字幕闪烁 + 倒计时 |
| 录音中 | 红色录音按钮脉冲 + 实时波形 |
| 回放中 | 蓝色进度条 + 对比波形 |

---

## 技术实现

### 前端（React组件）

#### 1. 音频播放器

```typescript
// useAudioPlayer.ts
import { useRef, useState } from 'react';

export const useAudioPlayer = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const play = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const playMuted = () => {
    if (audioRef.current) {
      audioRef.current.muted = true;
      play();
    }
  };

  return { audioRef, isPlaying, currentTime, play, pause, playMuted };
};
```

#### 2. 录音器

```typescript
// useAudioRecorder.ts
import { useState, useRef } from 'react';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);
      chunksRef.current = [];
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
  };

  return { isRecording, audioBlob, startRecording, stopRecording };
};
```

#### 3. 波形可视化

使用 **WaveSurfer.js** 或自定义Canvas：

```typescript
// WaveformVisualizer.tsx
import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface Props {
  audioUrl: string;
  waveColor?: string;
  progressColor?: string;
}

export const WaveformVisualizer: React.FC<Props> = ({
  audioUrl,
  waveColor = '#4299e1',
  progressColor = '#2b6cb0'
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor,
        progressColor,
        height: 80,
        responsive: true,
        normalize: true
      });

      wavesurferRef.current.load(audioUrl);
    }

    return () => wavesurferRef.current?.destroy();
  }, [audioUrl]);

  return <div ref={waveformRef} />;
};
```

#### 4. ShadowLab主组件

```typescript
// ShadowLab.tsx
import React, { useState } from 'react';
import { useAudioPlayer } from './useAudioPlayer';
import { useAudioRecorder } from './useAudioRecorder';
import { WaveformVisualizer } from './WaveformVisualizer';

interface Props {
  clip: {
    id: string;
    embedUrl: string;
    originalSubtitle: string;
    translations: { zh: string };
    pronunciation: string;
  };
}

export const ShadowLab: React.FC<Props> = ({ clip }) => {
  const [step, setStep] = useState<'play' | 'muted' | 'record' | 'playback'>('play');
  const [attemptCount, setAttemptCount] = useState(0);
  
  const originalAudio = useAudioPlayer(clip.embedUrl);
  const recorder = useAudioRecorder();

  const handlePlayOriginal = () => {
    originalAudio.play();
    setStep('play');
  };

  const handlePlayMuted = () => {
    originalAudio.playMuted();
    setStep('muted');
    // 静音播放结束后自动进入录音模式
    setTimeout(() => {
      setStep('record');
    }, 5000); // 假设片段5秒
  };

  const handleStartRecording = async () => {
    await recorder.startRecording();
    setAttemptCount(prev => prev + 1);
  };

  const handleStopRecording = () => {
    recorder.stopRecording();
    setStep('playback');
  };

  const handleSaveRecord = async () => {
    if (!recorder.audioBlob) return;

    const formData = new FormData();
    formData.append('clipId', clip.id);
    formData.append('duration', '4.5'); // 从audioBlob计算
    formData.append('attemptNumber', attemptCount.toString());
    formData.append('audioFile', recorder.audioBlob);

    await fetch('/api/v1/shadow/record', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    alert('录音已保存！');
  };

  return (
    <div className="shadow-lab">
      <h2>Shadow Lab</h2>
      
      {/* 片段信息 */}
      <div className="clip-info">
        <p><strong>原文：</strong>{clip.originalSubtitle}</p>
        <p><strong>拼音：</strong>{clip.pronunciation}</p>
        <p><strong>翻译：</strong>{clip.translations.zh}</p>
      </div>

      {/* 原音波形 */}
      <WaveformVisualizer audioUrl={clip.embedUrl} />

      {/* 控制按钮 */}
      <div className="controls">
        <button onClick={handlePlayOriginal} disabled={recorder.isRecording}>
          ▶️ 播放原音
        </button>
        <button onClick={handlePlayMuted} disabled={recorder.isRecording}>
          🔇 静音播放
        </button>
        {step === 'record' && !recorder.isRecording && (
          <button onClick={handleStartRecording}>
            🎙️ 开始录音
          </button>
        )}
        {recorder.isRecording && (
          <button onClick={handleStopRecording}>
            ⏹️ 停止录音
          </button>
        )}
      </div>

      {/* 用户录音波形 */}
      {recorder.audioBlob && (
        <div className="user-recording">
          <h3>你的录音：</h3>
          <WaveformVisualizer 
            audioUrl={URL.createObjectURL(recorder.audioBlob)} 
            waveColor="#f56565"
            progressColor="#c53030"
          />
          <audio controls src={URL.createObjectURL(recorder.audioBlob)} />
        </div>
      )}

      {/* 统计信息 */}
      <p>尝试次数：{attemptCount}</p>

      {/* 保存按钮 */}
      {recorder.audioBlob && (
        <button onClick={handleSaveRecord} className="save-btn">
          💾 保存到我的复习
        </button>
      )}
    </div>
  );
};
```

---

## 后端API

### POST /api/v1/shadow/record

**请求**（multipart/form-data）：
```
clipId: "uuid"
duration: 4.5
attemptNumber: 2
audioFile: Blob (可选)
```

**后端处理逻辑**：

```typescript
// shadow.controller.ts
@Post('record')
@UseGuards(JwtAuthGuard)
async recordShadow(
  @Body() dto: RecordShadowDto,
  @UploadedFile() audioFile: Express.Multer.File,
  @CurrentUser() user: User
) {
  // 1. 验证clipId存在
  const clip = await this.clipsService.findOne(dto.clipId);
  if (!clip || !clip.shadowLabReady) {
    throw new BadRequestException('Clip not available for Shadow Lab');
  }

  // 2. 可选：处理音频文件（提取波形统计）
  let waveformStats = null;
  if (audioFile) {
    waveformStats = await this.audioProcessor.extractWaveformStats(audioFile);
    // 不存储原始音频，仅存储匿名化统计数据
  }

  // 3. 创建ShadowRecord
  const record = await this.shadowRecordRepository.save({
    userId: user.id,
    clipId: dto.clipId,
    duration: dto.duration,
    attemptNumber: dto.attemptNumber,
    waveformStats,
    recordedAt: new Date()
  });

  return {
    success: true,
    data: {
      recordId: record.id,
      clipId: record.clipId,
      duration: record.duration,
      attemptNumber: record.attemptNumber,
      savedAt: record.recordedAt
    }
  };
}
```

**波形统计提取（伪代码）**：

```typescript
// audioProcessor.service.ts
import * as WaveformData from 'waveform-data';

async extractWaveformStats(audioFile: Express.Multer.File) {
  // 使用ffmpeg转换为WAV
  const wavBuffer = await this.convertToWav(audioFile.buffer);
  
  // 提取波形数据
  const waveform = WaveformData.create(wavBuffer);
  const channel = waveform.channel(0);
  
  // 计算统计
  const samples = channel.min_array();
  const averageAmplitude = samples.reduce((a, b) => a + Math.abs(b), 0) / samples.length;
  const peakAmplitude = Math.max(...samples.map(Math.abs));
  
  // 检测静音段
  const silenceThreshold = 0.02;
  const silentSamples = samples.filter(s => Math.abs(s) < silenceThreshold).length;
  const silenceDuration = (silentSamples / samples.length) * waveform.duration;

  return {
    averageAmplitude: parseFloat(averageAmplitude.toFixed(2)),
    peakAmplitude: parseFloat(peakAmplitude.toFixed(2)),
    silenceDuration: parseFloat(silenceDuration.toFixed(2)),
    energyDistribution: this.calculateEnergyDistribution(samples)
  };
}

private calculateEnergyDistribution(samples: number[]): number[] {
  // 分成5段，计算每段能量
  const segmentSize = Math.floor(samples.length / 5);
  const distribution = [];
  
  for (let i = 0; i < 5; i++) {
    const segment = samples.slice(i * segmentSize, (i + 1) * segmentSize);
    const energy = segment.reduce((sum, s) => sum + s * s, 0) / segment.length;
    distribution.push(parseFloat(energy.toFixed(2)));
  }
  
  return distribution;
}
```

---

## 隐私保护

### ❌ 不存储的内容
- 原始音频文件（太大且有隐私风险）
- 语音转文本（可能识别身份）
- 频谱图完整数据

### ✅ 仅存储的内容
- 录音时长
- 尝试次数
- 匿名化波形统计（平均振幅、峰值、静音时长）
- 能量分布（5个数值）

这些数据无法还原原始语音，仅用于学习分析。

---

## 性能优化

### 1. 音频预加载
```typescript
// 在Clip详情页加载时预加载音频
useEffect(() => {
  if (clip.shadowLabReady) {
    const audio = new Audio(clip.embedUrl);
    audio.preload = 'auto';
  }
}, [clip]);
```

### 2. 波形缓存
- 首次加载时生成波形数据并缓存到localStorage
- 后续访问直接加载缓存

### 3. 录音压缩
- 使用WebM Opus编码（高压缩比）
- 采样率：16kHz（语音足够）
- 比特率：32kbps

---

## 可访问性

- [ ] 键盘快捷键：
  - `Space` - 播放/暂停
  - `R` - 开始录音
  - `S` - 停止录音
  - `M` - 静音播放
- [ ] 屏幕阅读器：所有按钮有`aria-label`
- [ ] 视觉反馈：录音状态用颜色+图标双重指示
- [ ] 字幕始终可见

---

## 未来增强功能（Phase 2+）

1. **音高对比**（日语语调）
   - 显示原音和录音的音高曲线
   - 高亮差异较大的部分

2. **AI评分**
   - 集成语音识别API（Azure Speech/Google Cloud Speech）
   - 发音准确度评分（1-100）
   - 语调相似度评分

3. **社区分享**（可选）
   - 用户可选择分享录音到社区
   - 点赞和评论功能

4. **对战模式**
   - 两位用户同时跟读同一片段
   - 实时PK，AI自动评判

5. **进度徽章**
   - 完成100次跟读：🏅 跟读新手
   - 完成1000次：🏆 跟读大师

---

**规范版本**: 1.0  
**最后更新**: 2025-11-08
