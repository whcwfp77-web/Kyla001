const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 图片优化
  images: {
    domains: [
      'cdn.example.com',
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'bilibili.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    NEXT_PUBLIC_APP_NAME: '语言学习平台',
  },

  // 国际化
  i18n: {
    locales: ['zh', 'en', 'ja', 'ko'],
    defaultLocale: 'zh',
  },

  // 重定向
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/review',
        permanent: false,
      },
    ];
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
