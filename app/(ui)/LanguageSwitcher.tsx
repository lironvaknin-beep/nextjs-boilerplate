'use client';
import { useEffect, useState } from 'react';

type LangCode = 'en'|'he'|'ar'|'fr'|'es'|'ru';
function applyLang(lang: LangCode) {
  try {
    document.documentElement.setAttribute('lang', lang);
    const rtl = (lang === 'he' || lang === 'ar');
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    localStorage.setItem('wa_lang', lang);
  } catch (e) {}
}

const options: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'EN' }, { code: 'he', label: 'HE' }, { code: 'ar', label: 'AR' },
  { code: 'fr', label: 'FR' }, { code: 'es', label: 'ES' }, { code: 'ru', label: 'RU' },
];

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<LangCode>('en');
  useEffect(() => { setLang((localStorage.getItem('wa_lang') as LangCode) || 'en'); }, []);
  return (
    <label style={{display:'inline-flex', alignItems:'center', gap:8}} title="Language" aria-label="Language">
      <span className="muted" style={{opacity:.8}}>🌐</span>
      <select
        value={lang}
        onChange={(e)=>{ const next=e.target.value as LangCode; setLang(next); applyLang(next); }}
        className="burger" style={{padding:'6px 10px', borderRadius:12}}
      >
        {options.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
      </select>
    </label>
  );
}
