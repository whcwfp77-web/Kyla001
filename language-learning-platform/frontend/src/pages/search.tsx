import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import SearchBar from '@/components/SearchBar';
import ClipCard from '@/components/ClipCard';
import { searchClips } from '@/lib/api';

interface SearchResult {
  id: string;
  entryTerm: string;
  language: string;
  mediaTitle: string;
  startTime: string;
  endTime: string;
  thumbnailUrl?: string;
  embedPolicy: string;
}

export default function SearchPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { q, type, language, theme } = router.query;
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q) {
      setLoading(true);
      searchClips({
        query: q as string,
        type: type as string,
        language: language as string,
        theme: theme as string,
      })
        .then((data) => {
          setResults(data.results || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [q, type, language, theme]);

  return (
    <>
      <Head>
        <title>{t('search.title')} - Language Learning Platform</title>
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto mb-8">
            <SearchBar initialValue={q as string} />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((clip) => (
                <ClipCard key={clip.id} clip={clip} />
              ))}
            </div>
          ) : q ? (
            <div className="text-center py-12 text-gray-500">
              {t('search.noResults')}
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-CN', ['common'])),
    },
  };
};
