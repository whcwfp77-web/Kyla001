'use client';

import { useState } from 'react';
import { ClipCard } from './ClipCard';

interface EntryTabsProps {
  clips: {
    [key: string]: Array<any>;
  };
}

export function EntryTabs({ clips }: EntryTabsProps) {
  const tabs = Object.keys(clips || {});
  const [activeTab, setActiveTab] = useState(tabs[0] || 'literal');

  if (!clips || tabs.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">暂无片段</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">片段示例</h2>
      
      {/* 标签页 */}
      <div className="flex gap-2 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab} ({clips[tab]?.length || 0})
          </button>
        ))}
      </div>

      {/* 内容 */}
      <div className="space-y-4">
        {clips[activeTab]?.map((clip: any) => (
          <ClipCard key={clip.id} clip={clip} />
        ))}
      </div>
    </div>
  );
}
