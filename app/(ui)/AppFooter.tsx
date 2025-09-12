'use client';

import { Link, usePathname } from '../../navigation';
import { useTranslations } from 'next-intl';

export default function AppFooter() {
  const t = useTranslations('Footer');
  const pathname = usePathname();

  const items = [
    { href: '/', key: 'home' },
    { href: '/builder', key: 'create' },
    { href: '/settings', key: 'settings' }
  ];

  return (
    <footer style={{display:'flex',justifyContent:'space-around',gap:12,padding:'10px 12px',borderTop:'1px solid #e5e7eb',position:'sticky',bottom:0,background:'var(--bg, white)'}}>
      {items.map(({href, key}) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} style={{textDecoration:'none',fontWeight: active?600:400}}>
            {t(key as any)}
          </Link>
        );
      })}
    </footer>
  );
}
