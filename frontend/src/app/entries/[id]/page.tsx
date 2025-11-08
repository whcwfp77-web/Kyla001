'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ClipCard } from '@/components/ClipCard';
import { EntryTabs } from '@/components/EntryTabs';

export default function EntryPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ['entry', params.id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entries/${params.id}`);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const entry = data?.data;

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            语言学习平台
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* 词条信息 */}
        <div className="bg-card p-8 rounded-lg border mb-8">
          <h1 className="text-4xl font-bold mb-4">{entry.term}</h1>
          <p className="text-xl text-muted-foreground mb-4">{entry.pronunciation}</p>
          <p className="text-lg mb-6">{entry.meaningSummary}</p>
          
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-muted rounded">{entry.language}</span>
            {entry.examTopics?.map((topic: string) => (
              <span key={topic} className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                {topic}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              添加到复习
            </button>
          </div>
        </div>

        {/* 片段标签页 */}
        <EntryTabs clips={entry.clips} />

        {/* 相关词条 */}
        {entry.relatedEntries && entry.relatedEntries.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">相关词条</h2>
            <div className="flex gap-4 flex-wrap">
              {entry.relatedEntries.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/entries/${related.id}`}
                  className="px-4 py-2 border rounded-lg hover:border-primary hover:text-primary"
                >
                  {related.term} ({related.relationship})
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
