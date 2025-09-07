// File: i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// רשימת שפות קיימות באמת בתיקיית /messages
export const locales = [
  'en','he','ar','es','fr','de','it','pt','ru','pl','tr','nl','sv','zh','ja','ko','hi','id','vi'
];

export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
