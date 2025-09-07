// File: i18n.ts
// Location: / (Project Root)
// This file defines the supported locales and tells the server how to load the translation files.

import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
 
// The list of all supported locales.
export const locales = ['en', 'he', 'ar', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'pl', 'tr', 'nl', 'sv', 'zh', 'ja', 'ko', 'hi', 'id', 'vi'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid.
  if (!locales.includes(locale as any)) notFound();
 
  return {
    // Load the correct messages for the given locale.
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

