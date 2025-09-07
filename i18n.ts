
import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'he', 'ar', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'pl', 'tr', 'nl', 'sv', 'zh', 'ja', 'ko', 'hi', 'id', 'vi'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    // For this example, we'll fall back to the default locale.
    // In a real app, you might want to show a 404 page.
    locale = defaultLocale;
  }
 
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
