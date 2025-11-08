import Link from 'next/link';

interface ClipCardProps {
  clip: {
    id: string;
    originalSubtitle: string;
    translations?: {
      zh?: string;
      en?: string;
    };
    mediaTitle?: string;
    duration?: number;
    thumbnail?: string;
  };
}

export function ClipCard({ clip }: ClipCardProps) {
  return (
    <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {clip.thumbnail && (
          <div className="flex-shrink-0">
            <img
              src={clip.thumbnail}
              alt={clip.mediaTitle}
              className="w-32 h-24 object-cover rounded"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-2">{clip.mediaTitle}</div>
          <p className="text-lg mb-2">{clip.originalSubtitle}</p>
          {clip.translations?.zh && (
            <p className="text-muted-foreground mb-2">{clip.translations.zh}</p>
          )}
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">{clip.duration}秒</span>
            <Link
              href={`/clips/${clip.id}`}
              className="text-primary hover:underline"
            >
              查看详情
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
