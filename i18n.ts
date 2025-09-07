// i18n.ts (Project root)
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// בחר רק את השפות שאתה באמת מחזיק להן קובץ messages/*.json כרגע
export const locales = ['en', 'he', 'ar', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'sv', 'tr', 'vi', 'zh'] as const;
// אפשר להתחיל רק עם ['en'] אם אתה רוצה לצמצם
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
