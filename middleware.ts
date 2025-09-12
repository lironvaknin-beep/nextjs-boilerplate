import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,             // 'en'
  localePrefix: 'as-needed', // ברירת מחדל בלי קידומת
});

export const config = {
  // מפעיל i18n על כל נתיב שאינו סטטי/‏API – חשוב כדי ש-/settings יעבוד באנגלית בלי /en
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
