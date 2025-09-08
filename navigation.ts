import { locales } from './i18n';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

// מכבד את ההגדרה במידלוור שה־default אין לו קידומת
export const { Link, usePathname, useRouter, redirect } =
  createSharedPathnamesNavigation({
    locales,
    localePrefix: 'as-needed'
  });
