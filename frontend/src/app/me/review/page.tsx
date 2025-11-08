'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { ReviewDrawer } from '@/components/ReviewDrawer';

export default function ReviewPage() {
  const [showAnswer, setShowAnswer] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['review', 'next'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/next`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.json();
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (rating: number) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          cardId: data?.data.cardId,
          rating,
          timeSpent: 45,
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      setShowAnswer(false);
      queryClient.invalidateQueries({ queryKey: ['review', 'next'] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const card = data?.data;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            语言学习平台
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {!card ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">太棒了！</h2>
            <p className="text-muted-foreground">今天没有要复习的卡片了！</p>
          </div>
        ) : (
          <ReviewDrawer
            card={card}
            showAnswer={showAnswer}
            onShowAnswer={() => setShowAnswer(true)}
            onRate={(rating) => completeMutation.mutate(rating)}
          />
        )}
      </div>
    </div>
  );
}
