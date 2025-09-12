import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,             // en
  localePrefix: 'as-needed'  // ברירת המחדל בלי קידומת
});

export const config = {
  matcher: [
    // החל על כל נתיב שאינו סטטי/‏API — כך שגם /settings, /item/123 וכו' יכוסו
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
