/* File: i18n.ts */
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales, defaultLocale} from './locales';

export {locales, defaultLocale};
export type {Locale} from './locales';

/** סט שפות RTL (כולל he ו-ar שיש בתיקיית messages) */
const rtlLangs = new Set(['ar', 'he', 'fa', 'ur']);

/** בדיקה האם שפה היא RTL */
export function isRTL(lang: string): boolean {
  return rtlLangs.has(lang);
}

/** תצורת next-intl לטעינת קובץ התרגום הנכון לפי locale */
export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) {
    notFound();
  }
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
