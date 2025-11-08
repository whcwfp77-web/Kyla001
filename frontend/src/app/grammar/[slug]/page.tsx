'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { GrammarLens } from '@/components/GrammarLens';

export default function GrammarPage({ params }: { params: { slug: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ['grammar', params.slug],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grammar/${params.slug}`);
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

  const grammar = data?.data;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            语言学习平台
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <GrammarLens grammar={grammar} />
      </div>
    </div>
  );
}
