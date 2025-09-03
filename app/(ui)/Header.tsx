'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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
  { code: 'zh', label: '中文', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
];

const HEADER_DICT = {
    en: { toggleTheme: 'Toggle Theme', language: 'Language' },
    he: { toggleTheme: 'שנה עיצוב', language: 'שפה' },
    es: { toggleTheme: 'Cambiar tema', language: 'Idioma' },
    fr: { toggleTheme: 'Changer de thème', language: 'Langue' },
    zh: { toggleTheme: '切换主题', language: '语言' },
    hi: { toggleTheme: 'थीम टॉगल करें', language: 'भाषा' },
}

type LangCode = keyof typeof HEADER_DICT;

// --- SVG Icons ---
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [currentLang, setCurrentLang] = useState<LangCode>('en');
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(initialTheme);
    const initialLang = (document.documentElement.lang || 'en') as LangCode;
    setCurrentLang(initialLang);

    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
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
      <Link href="/" className="logo colored">
        write
      </Link>

      {/* Desktop Actions */}
      <div className="hidden sm:flex headerActions">
        <div className="relative" ref={langMenuRef}>
          <button onClick={() => setIsLangOpen(!isLangOpen)} className="headerBtn">
            <GlobeIcon />
          </button>
          {isLangOpen && (
            <div className="langDropdown">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--accent)]"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={toggleTheme} className="headerBtn">
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="sm:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="headerBtn">
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>
      
      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="mobileMenu sm:hidden">
            <div className="flex flex-col gap-4">
                 <button onClick={toggleTheme} className="headerBtn justify-start">
                    {theme === 'light' ? <SunIcon /> : <MoonIcon />}
                    <span>{t.toggleTheme}</span>
                </button>
                <div className="border-t border-[var(--border)]"></div>
                <h3 className="text-sm font-semibold text-[var(--muted-foreground)] px-2 pt-2">{t.language}</h3>
                {LANGUAGES.map((lang) => (
                    <button
                    key={lang.code}
                    onClick={() => { changeLanguage(lang); setIsMenuOpen(false); }}
                    className="w-full text-left px-2 py-2 text-sm rounded-md hover:bg-[var(--accent)]"
                    >
                    {lang.label}
                    </button>
                ))}
            </div>
        </div>
      )}
    </header>
  );
}

