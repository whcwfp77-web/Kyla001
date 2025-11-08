interface ReviewDrawerProps {
  card: {
    entry: {
      term: string;
      pronunciation: string;
      meaningSummary: string;
    };
    clips: Array<{
      id: string;
      originalSubtitle: string;
      duration: number;
    }>;
    interval: number;
    reviewCount: number;
  };
  showAnswer: boolean;
  onShowAnswer: () => void;
  onRate: (rating: number) => void;
}

export function ReviewDrawer({ card, showAnswer, onShowAnswer, onRate }: ReviewDrawerProps) {
  return (
    <div className="bg-card p-8 rounded-lg border">
      {/* 正面 */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">{card.entry.term}</h2>
        <p className="text-xl text-muted-foreground">{card.entry.pronunciation}</p>
      </div>

      {!showAnswer ? (
        <div className="text-center">
          <button
            onClick={onShowAnswer}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            显示答案
          </button>
        </div>
      ) : (
        <>
          {/* 背面 */}
          <div className="mb-8">
            <p className="text-lg mb-6">{card.entry.meaningSummary}</p>

            {/* 示例片段 */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold">示例片段：</h3>
              {card.clips.slice(0, 2).map((clip) => (
                <div key={clip.id} className="p-4 bg-muted rounded-lg">
                  <p>{clip.originalSubtitle}</p>
                  <button className="text-primary mt-2">▶️ 播放</button>
                </div>
              ))}
            </div>
          </div>

          {/* 评分按钮 */}
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => onRate(1)}
              className="py-3 border rounded-lg hover:bg-red-50 hover:border-red-500"
            >
              😞<br />完全忘记
            </button>
            <button
              onClick={() => onRate(2)}
              className="py-3 border rounded-lg hover:bg-orange-50 hover:border-orange-500"
            >
              😕<br />模糊记得
            </button>
            <button
              onClick={() => onRate(3)}
              className="py-3 border rounded-lg hover:bg-yellow-50 hover:border-yellow-500"
            >
              😐<br />有些困难
            </button>
            <button
              onClick={() => onRate(4)}
              className="py-3 border rounded-lg hover:bg-green-50 hover:border-green-500"
            >
              🙂<br />较为轻松
            </button>
            <button
              onClick={() => onRate(5)}
              className="py-3 border rounded-lg hover:bg-blue-50 hover:border-blue-500"
            >
              😄<br />非常轻松
            </button>
          </div>

          <div className="text-center mt-4 text-sm text-muted-foreground">
            当前间隔：{card.interval}天 | 复习次数：{card.reviewCount}
          </div>
        </>
      )}
    </div>
  );
}
