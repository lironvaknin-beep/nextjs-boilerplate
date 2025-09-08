import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,           // en
  localePrefix: 'as-needed' // לא מוסיף קידומת לברירת המחדל
});

export const config = {
  matcher: [
    '/', // שורש
    // כל השפות בקידומת (לא כולל קבצי סטטיק, _next, api)
    '/(ar|de|en|es|fr|he|hi|id|it|ja|ko|nl|pl|pt|ru|sv|tr|vi|zh)/:path*'
  ]
};
