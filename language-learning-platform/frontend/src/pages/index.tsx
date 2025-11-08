import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('title')} - Language Learning Platform</title>
        <meta name="description" content={t('description')} />
        <meta property="og:title" content={t('title')} />
        <meta property="og:description" content={t('description')} />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {t('welcome')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('subtitle')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <SearchBar />
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              title={t('features.shadowLab.title')}
              description={t('features.shadowLab.description')}
              href="/shadow-lab"
              icon="🎤"
            />
            <FeatureCard
              title={t('features.srs.title')}
              description={t('features.srs.description')}
              href="/me/review"
              icon="📚"
            />
            <FeatureCard
              title={t('features.grammar.title')}
              description={t('features.grammar.description')}
              href="/grammar"
              icon="📖"
            />
          </div>
        </div>
      </main>
    </>
  );
}

function FeatureCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-CN', ['common'])),
    },
  };
};
