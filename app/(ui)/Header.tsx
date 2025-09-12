'use client';

import { Link } from '../../navigation';
import { useTranslations } from 'next-intl';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',borderBottom:'1px solid #e5e7eb'}}>
      <div>
        <Link href="/" style={{fontWeight:700,textDecoration:'none'}}>TextSpot</Link>
      </div>
      <div style={{flex:1}}>
        <input
          type="search"
          placeholder={t('searchPlaceholder')}
          style={{width:'100%',padding:'8px 10px',border:'1px solid #d1d5db',borderRadius:8}}
        />
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <ThemeToggle />
        <Link href="/settings" style={{textDecoration:'none'}}>{t('settings')}</Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
