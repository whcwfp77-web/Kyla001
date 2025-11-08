'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AdminQueueProps {
  suggestions: Array<{
    id: string;
    type: string;
    content: any;
    submittedAt: string;
  }>;
}

export function AdminQueue({ suggestions }: AdminQueueProps) {
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suggestions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          status,
          reviewNotes: status === 'approved' ? '审批通过' : '不符合要求',
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">没有待审核的建议</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <div key={suggestion.id} className="p-6 border rounded-lg bg-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="px-2 py-1 bg-muted text-sm rounded">{suggestion.type}</span>
              <p className="text-sm text-muted-foreground mt-2">
                提交时间：{new Date(suggestion.submittedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => reviewMutation.mutate({ id: suggestion.id, status: 'approved' })}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                ✓ 批准
              </button>
              <button
                onClick={() => reviewMutation.mutate({ id: suggestion.id, status: 'rejected' })}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                ✗ 拒绝
              </button>
            </div>
          </div>
          
          <pre className="bg-muted p-4 rounded-lg overflow-auto">
            {JSON.stringify(suggestion.content, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}
