'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { AdminQueue } from '@/components/AdminQueue';

export default function AdminReviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['suggestions', 'pending'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suggestions?status=pending`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            语言学习平台 - 管理后台
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">待审核建议</h1>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <AdminQueue suggestions={data?.data || []} />
        )}
      </div>
    </div>
  );
}
