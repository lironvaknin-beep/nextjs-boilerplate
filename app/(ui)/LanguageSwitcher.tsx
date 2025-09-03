'use client';
import { useEffect, useState } from 'react';
import { applyLang, LangCode } from '../(utils)/theme';

const langOptions: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'he', label: 'HE' },
  { code: 'ar', label: 'AR' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'ru', label: 'RU' },
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<LangCode>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('wa_lang') as LangCode) || 'en';
    setCurrentLang(savedLang);
  }, []);

  function handleLangChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLang = e.target.value as LangCode;
    setCurrentLang(newLang);
    applyLang(newLang);
  }

  return (
    <div className="lang-switcher-wrapper">
      <span className="lang-switcher-icon" aria-hidden="true">🌐</span>
      <select
        value={currentLang}
        onChange={handleLangChange}
        className="lang-select"
        aria-label="Select language"
      >
        {langOptions.map(opt => (
          <option key={opt.code} value={opt.code}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

