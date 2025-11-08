import Link from 'next/link';
import Image from 'next/image';
import MediaEmbed from './MediaEmbed';

interface ClipCardProps {
  clip: {
    id: string;
    entryTerm: string;
    language: string;
    mediaTitle: string;
    startTime: string;
    endTime: string;
    thumbnailUrl?: string;
    embedPolicy: string;
    embedUrl?: string;
  };
}

export default function ClipCard({ clip }: ClipCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {clip.thumbnailUrl && (
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={clip.thumbnailUrl}
            alt={clip.entryTerm}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/entries/${clip.id}`} className="hover:text-primary-600">
            {clip.entryTerm}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 mb-2">{clip.mediaTitle}</p>
        <p className="text-xs text-gray-500">
          {clip.startTime} - {clip.endTime}
        </p>
        
        {clip.embedUrl && (
          <div className="mt-4">
            <MediaEmbed
              embedUrl={clip.embedUrl}
              embedPolicy={clip.embedPolicy}
              startTime={clip.startTime}
            />
          </div>
        )}
      </div>
    </div>
  );
}
