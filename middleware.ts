// File: middleware.ts
// Location: / (Project Root)
// This file is critical. It intercepts requests to determine which locale to use.

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,
 
  // If this locale is matched, pathnames work without a prefix (e.g. /about)
  defaultLocale: defaultLocale,

  // CRITICAL CHANGE: The prefix will now only be used when needed (i.e., for non-default locales)
  localePrefix: 'as-needed'
});
 
export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

