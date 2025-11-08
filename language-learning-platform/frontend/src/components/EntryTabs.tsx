import { useState } from 'react';
import ClipCard from './ClipCard';

interface EntryTabsProps {
  entry: {
    clips: any[];
    relatedEntries: any[];
  };
}

export default function EntryTabs({ entry }: EntryTabsProps) {
  const [activeTab, setActiveTab] = useState<'clips' | 'related'>('clips');

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('clips')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'clips'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            视频片段 ({entry.clips?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('related')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'related'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            相关表达 ({entry.relatedEntries?.length || 0})
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'clips' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entry.clips?.map((clip) => (
              <ClipCard key={clip.id} clip={clip} />
            ))}
          </div>
        )}

        {activeTab === 'related' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entry.relatedEntries?.map((related) => (
              <div
                key={related.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <h3 className="font-semibold">{related.term}</h3>
                <p className="text-sm text-gray-600">{related.meaningSummary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
