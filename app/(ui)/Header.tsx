'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// --- Helper functions for cookies ---
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
  { code: 'en', label: 'English' },
  { code: 'he', label: 'עברית' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिन्दी' },
];

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
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Set initial theme and add listener for clicks outside lang menu
  useEffect(() => {
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(initialTheme);

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

  const changeLanguage = (langCode: string) => {
    document.documentElement.lang = langCode;
    setCookie('user-lang', langCode, 365);
    setIsLangOpen(false);
    // The language will be picked up by the hook in the page component
  };

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
            <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
              {LANGUAGES.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => changeLanguage(code)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {label}
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
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-md sm:hidden p-4">
            <div className="flex flex-col gap-4">
                 <button onClick={toggleTheme} className="headerBtn justify-start">
                    {theme === 'light' ? <SunIcon /> : <MoonIcon />}
                    <span>Toggle Theme</span>
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <h3 className="text-sm font-semibold text-gray-500 px-2 pt-2">Language</h3>
                {LANGUAGES.map(({ code, label }) => (
                    <button
                    key={code}
                    onClick={() => { changeLanguage(code); setIsMenuOpen(false); }}
                    className="w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                    {label}
                    </button>
                ))}
            </div>
        </div>
      )}
    </header>
  );
}
