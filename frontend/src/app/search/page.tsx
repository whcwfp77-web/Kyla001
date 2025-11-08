'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '@/components/SearchBar';
import { ClipCard } from '@/components/ClipCard';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(query)}`);
      return res.json();
    },
    enabled: !!query,
  });

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

      {/* 搜索区域 */}
      <div className="border-b bg-white py-6">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={setQuery} />
        </div>
      </div>

      {/* 搜索结果 */}
      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        )}

        {data?.data && (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              找到 {data.pagination?.total || 0} 个结果（用时 {data.meta?.processingTime}ms）
            </div>

            <div className="grid grid-cols-1 gap-6">
              {data.data.map((item: any) => (
                item.type === 'entry' ? (
                  <div key={item.id} className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{item.term}</h3>
                        <p className="text-muted-foreground mb-2">{item.pronunciation}</p>
                        <p className="mb-4">{item.meaningSummary}</p>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-muted text-sm rounded">{item.language}</span>
                          <span className="px-2 py-1 bg-muted text-sm rounded">{item.clipCount} 个片段</span>
                        </div>
                      </div>
                      <Link
                        href={`/entries/${item.id}`}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        查看详情
                      </Link>
                    </div>
                  </div>
                ) : (
                  <ClipCard key={item.id} clip={item} />
                )
              ))}
            </div>

            {data.pagination?.hasMore && (
              <div className="text-center mt-8">
                <button className="px-6 py-2 border rounded-lg hover:bg-muted">
                  加载更多
                </button>
              </div>
            )}
          </>
        )}

        {!query && !data && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">输入关键词开始搜索</p>
          </div>
        )}
      </div>
    </div>
  );
}
