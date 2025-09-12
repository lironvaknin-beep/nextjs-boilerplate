'use client';

import {useEffect, useMemo, useState} from 'react';
import {usePathname, useRouter} from '@/navigation';
import {locales, defaultLocale} from '@/locales';

type Lang = typeof locales[number];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // בחר תתי-קבוצה להצגה (אפשר להרחיב בהמשך)
  const options = useMemo(() => (['en','he','ar','es','fr','ru'] as Lang[]), []);

  const [current, setCurrent] = useState<Lang>('en');

  useEffect(() => {
    const seg = pathname.split('/')[1] || '';
    const maybe = (locales as readonly string[]).includes(seg) ? (seg as Lang) : defaultLocale;
    setCurrent(maybe);
  }, [pathname]);

  function stripLocale(p: string) {
    const parts = p.split('/');
    if ((locales as readonly string[]).includes(parts[1])) parts.splice(1, 1);
    const out = parts.join('/');
    return out || '/';
  }

  function changeLang(next: Lang) {
    setCurrent(next);
    const base = stripLocale(pathname);
    const target = next === defaultLocale ? base : `/${next}${base === '/' ? '' : base}`;
    document.documentElement.setAttribute('lang', next);
    document.documentElement.setAttribute('dir', next === 'he' || next === 'ar' ? 'rtl' : 'ltr');
    document.cookie = `user-lang=${next}; path=/; max-age=31536000`;
    router.push(target);
  }

  return (
    <label style={{display:'inline-flex',alignItems:'center',gap:6}}>
      <span style={{fontSize:12,opacity:0.7}}>Lang</span>
      <select value={current} onChange={(e)=> changeLang(e.target.value as Lang)} aria-label="Select language">
        {options.map(code => <option key={code} value={code}>{code.toUpperCase()}</option>)}
      </select>
    </label>
  );
}
