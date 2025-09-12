import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import {locales} from './locales';

export const {Link, usePathname, useRouter, redirect} =
  createSharedPathnamesNavigation({
    locales,
    localePrefix: 'as-needed'
  });
