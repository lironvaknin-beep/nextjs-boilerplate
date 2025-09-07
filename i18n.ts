// i18n.ts (קיים אצלך – הוספתי 2 שורות של types)
import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'he', 'ar', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'pl', 'tr', 'nl', 'sv', 'zh', 'ja', 'ko', 'hi', 'id', 'vi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
