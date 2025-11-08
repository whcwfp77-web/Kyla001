import { useEffect, useRef, useState } from 'react';

interface MediaEmbedProps {
  embedUrl: string;
  embedPolicy: 'embed' | 'external_redirect' | 'self_hosted';
  startTime?: string;
  endTime?: string;
}

// MediaEmbed configuration matrix for compliance
const EMBED_CONFIG = {
  youtube: {
    embed: true,
    redirect: false,
    whitelist: ['youtube.com', 'youtu.be'],
  },
  vimeo: {
    embed: true,
    redirect: false,
    whitelist: ['vimeo.com'],
  },
  bilibili: {
    embed: false,
    redirect: true,
    whitelist: ['bilibili.com'],
  },
  default: {
    embed: false,
    redirect: true,
    whitelist: [],
  },
};

export default function MediaEmbed({
  embedUrl,
  embedPolicy,
  startTime,
  endTime,
}: MediaEmbedProps) {
  const [shouldEmbed, setShouldEmbed] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Enforce compliance: only embed if policy allows
    if (embedPolicy === 'external_redirect') {
      setRedirectUrl(embedUrl);
      setShouldEmbed(false);
      return;
    }

    if (embedPolicy === 'self_hosted') {
      // Self-hosted media - direct embed
      setShouldEmbed(true);
      return;
    }

    // Check whitelist for embed policy
    const url = new URL(embedUrl);
    const hostname = url.hostname.replace('www.', '');
    
    const config = Object.values(EMBED_CONFIG).find((c) =>
      c.whitelist.some((w) => hostname.includes(w))
    ) || EMBED_CONFIG.default;

    if (config.embed && embedPolicy === 'embed') {
      setShouldEmbed(true);
    } else {
      setRedirectUrl(embedUrl);
      setShouldEmbed(false);
    }
  }, [embedUrl, embedPolicy]);

  if (redirectUrl) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
        <p className="text-sm text-gray-600 mb-2">此内容需要跳转到外部平台</p>
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          查看视频
        </a>
      </div>
    );
  }

  if (!shouldEmbed) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500">
        媒体内容不可用
      </div>
    );
  }

  // Parse YouTube URL for embed
  const youtubeMatch = embedUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  );
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    const startSeconds = startTime ? parseTimeToSeconds(startTime) : undefined;
    const embedSrc = `https://www.youtube.com/embed/${videoId}${startSeconds ? `?start=${startSeconds}` : ''}`;

    return (
      <div ref={containerRef} className="relative w-full aspect-video">
        <iframe
          src={embedSrc}
          title="Video player"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500">
      不支持的媒体格式
    </div>
  );
}

function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}
