import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = [
  'ar','de','en','es','fr','he','hi','id','it','ja','ko','nl','pl','pt','ru','sv','tr','vi','zh'
] as const;

export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
