/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // PWA configuration
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
  // Image optimization
  images: {
    domains: ['cdn.ciying.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // i18n configuration
  i18n: {
    locales: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'],
    defaultLocale: 'zh-CN',
    localeDetection: true,
  },
};

module.exports = nextConfig;
