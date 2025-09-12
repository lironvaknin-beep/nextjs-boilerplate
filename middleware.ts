import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './locales';

export default createMiddleware({
  locales,
  defaultLocale,             // 'en'
  localePrefix: 'as-needed', // ברירת מחדל בלי קידומת
  // localeDetection: true  ← אופציונלי; אפשר להשאיר ככה או להסיר
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
