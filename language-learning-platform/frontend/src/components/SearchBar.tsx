import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Search } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
}

export default function SearchBar({ initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push({
        pathname: '/search',
        query: { q: query.trim() },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索词汇、短语或语法点..."
          className="w-full px-4 py-3 pl-12 pr-4 text-lg border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
          aria-label="搜索"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          搜索
        </button>
      </div>
    </form>
  );
}
