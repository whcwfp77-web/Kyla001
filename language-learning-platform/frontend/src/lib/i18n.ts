import { useTranslation as useNextI18nTranslation } from 'next-i18next';

export function useTranslation(namespace?: string) {
  return useNextI18nTranslation(namespace);
}

export const supportedLocales = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'];

export function getLocaleDisplayName(locale: string): string {
  const names: Record<string, string> = {
    'zh-CN': '简体中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'ko-KR': '한국어',
  };
  return names[locale] || locale;
}
