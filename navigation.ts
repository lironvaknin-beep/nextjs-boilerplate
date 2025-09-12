import { locales } from './i18n';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const { Link, usePathname, useRouter, redirect } =
  createSharedPathnamesNavigation({
    locales,
    localePrefix: 'as-needed', // EN בלי קידומת, אחרות עם
  });
