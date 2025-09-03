'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- Helper function for setting a cookie ---
function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  if (typeof document !== 'undefined') {
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
}

const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'he', label: 'עברית', dir: 'rtl' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', dir: 'ltr' },
  { code: 'pt', label: 'Português', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
];

const HEADER_DICT = {
    en: { appearance: 'Appearance', language: 'Language', settings: 'Settings', light: 'Light', dark: 'Dark' },
    he: { appearance: 'מראה', language: 'שפה', settings: 'הגדרות', light: 'בהיר', dark: 'כהה' },
    es: { appearance: 'Apariencia', language: 'Idioma', settings: 'Ajustes', light: 'Claro', dark: 'Oscuro' },
    fr: { appearance: 'Apparence', language: 'Langue', settings: 'Paramètres', light: 'Clair', dark: 'Sombre' },
    de: { appearance: 'Erscheinungsbild', language: 'Sprache', settings: 'Einstellungen', light: 'Hell', dark: 'Dunkel' },
    pt: { appearance: 'Aparência', language: 'Idioma', settings: 'Configurações', light: 'Claro', dark: 'Escuro' },
    zh: { appearance: '外观', language: '语言', settings: '设置', light: '浅色', dark: '深色' },
    hi: { appearance: 'दिखावट', language: 'भाषा', settings: 'सेटिंग्स', light: 'लाइट', dark: 'डार्क' },
}

type LangCode = keyof typeof HEADER_DICT;

// --- SVG Icons ---
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [currentLang, setCurrentLang] = useState<LangCode>('en');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(initialTheme);
    const initialLang = (document.documentElement.lang || 'en') as LangCode;
    setCurrentLang(initialLang);

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setCookie('user-theme', newTheme, 365);
  };

  const changeLanguage = (lang: { code: string, dir: string }) => {
    setCookie('user-lang', lang.code, 365);
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.dir;
    window.location.reload(); 
  };
  
  const t = HEADER_DICT[currentLang] || HEADER_DICT.en;

  return (
    <header className="appHeader">
        <Link href="/" className="logo">TextSpot</Link>
      
      {/* User Menu & Actions */}
      <div className="headerActions">
        <div className="relative" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="headerBtn">
             <UserIcon />
          </button>
          {isMenuOpen && (
            <div className="userDropdown">
              <Link href="/settings" className="userDropdownItem" onClick={() => setIsMenuOpen(false)}>
                <SettingsIcon />
                <span>{t.settings}</span>
              </Link>
              <div className="userDropdownDivider" />
              <div className="userDropdownHeading">{t.appearance}</div>
              <div className="px-2">
                <div className="flex items-center gap-1 p-1 rounded-md bg-[var(--muted)] border border-[var(--border)]">
                    <button onClick={() => changeTheme('light')} className={`langBtn ${theme === 'light' ? 'active' : ''}`}>{t.light}</button>
                    <button onClick={() => changeTheme('dark')} className={`langBtn ${theme === 'dark' ? 'active' : ''}`}>{t.dark}</button>
                </div>
              </div>
              <div className="userDropdownDivider" />
              <div className="userDropdownHeading">{t.language}</div>
              <div className="max-h-40 overflow-y-auto px-1">
                {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => changeLanguage(lang)} className="userDropdownItem">{lang.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


