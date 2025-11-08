import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import EntryTabs from '@/components/EntryTabs';
import { getEntry } from '@/lib/api';

interface Entry {
  id: string;
  term: string;
  language: string;
  pronunciation?: string;
  meaningSummary: string;
  clips: any[];
  relatedEntries: any[];
}

export default function EntryPage({ entry }: { entry: Entry }) {
  const { t } = useTranslation('common');
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{entry.term} - Language Learning Platform</title>
        <meta name="description" content={entry.meaningSummary} />
        <meta property="og:title" content={entry.term} />
        <meta property="og:description" content={entry.meaningSummary} />
      </Head>

      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{entry.term}</h1>
            {entry.pronunciation && (
              <p className="text-xl text-gray-600 mb-4">{entry.pronunciation}</p>
            )}
            <p className="text-lg mb-8">{entry.meaningSummary}</p>

            <EntryTabs entry={entry} />
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const entryId = params?.id as string;
  
  try {
    const entry = await getEntry(entryId);
    return {
      props: {
        entry,
        ...(await serverSideTranslations(locale ?? 'zh-CN', ['common'])),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
