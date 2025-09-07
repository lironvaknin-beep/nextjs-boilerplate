// File: app/(ui)/Header.tsx
// Location: /app/(ui)/Header.tsx
// This component has been refactored to rely on the central PreferencesProvider.
// It reads the initial theme/lang from the DOM and its dictionary is now complete.

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
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', dir: 'ltr' },
  { code: 'it', label: 'Italiano', dir: 'ltr' },
  { code: 'pt', label: 'Português', dir: 'ltr' },
  { code: 'ru', label: 'Русский', dir: 'ltr' },
  { code: 'pl', label: 'Polski', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe', dir: 'ltr' },
  { code: 'nl', label: 'Nederlands', dir: 'ltr' },
  { code: 'sv', label: 'Svenska', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
  { code: 'ja', label: '日本語', dir: 'ltr' },
  { code: 'ko', label: '한국어', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
  { code: 'id', label: 'Bahasa Indonesia', dir: 'ltr' },
  { code: 'vi', label: 'Tiếng Việt', dir: 'ltr' },
];

const HEADER_DICT = {
    en: { appearance: 'Appearance', language: 'Language', settings: 'Settings', light: 'Light', dark: 'Dark', searchPlaceholder: 'Search...' },
    he: { appearance: 'מראה', language: 'שפה', settings: 'הגדרות', light: 'בהיר', dark: 'כהה', searchPlaceholder: 'חיפוש...' },
    ar: { appearance: 'المظهر', language: 'اللغة', settings: 'الإعدادات', light: 'فاتح', dark: 'داكن', searchPlaceholder: 'بحث...' },
    es: { appearance: 'Apariencia', language: 'Idioma', settings: 'Ajustes', light: 'Claro', dark: 'Oscuro', searchPlaceholder: 'Buscar...' },
    fr: { appearance: 'Apparence', language: 'Langue', settings: 'Paramètres', light: 'Clair', dark: 'Sombre', searchPlaceholder: 'Rechercher...' },
    de: { appearance: 'Erscheinungsbild', language: 'Sprache', settings: 'Einstellungen', light: 'Hell', dark: 'Dunkel', searchPlaceholder: 'Suchen...' },
    it: { appearance: 'Aspetto', language: 'Lingua', settings: 'Impostazioni', light: 'Chiaro', dark: 'Scuro', searchPlaceholder: 'Cerca...' },
    pt: { appearance: 'Aparência', language: 'Idioma', settings: 'Configurações', light: 'Claro', dark: 'Escuro', searchPlaceholder: 'Pesquisar...' },
    ru: { appearance: 'Внешний вид', language: 'Язык', settings: 'Настройки', light: 'Светлая', dark: 'Тёмная', searchPlaceholder: 'Поиск...' },
    pl: { appearance: 'Wygląd', language: 'Język', settings: 'Ustawienia', light: 'Jasny', dark: 'Ciemny', searchPlaceholder: 'Szukaj...' },
    tr: { appearance: 'Görünüm', language: 'Dil', settings: 'Ayarlar', light: 'Açık', dark: 'Koyu', searchPlaceholder: 'Ara...' },
    nl: { appearance: 'Uiterlijk', language: 'Taal', settings: 'Instellingen', light: 'Licht', dark: 'Donker', searchPlaceholder: 'Zoeken...' },
    sv: { appearance: 'Utseende', language: 'Språk', settings: 'Inställningar', light: 'Ljus', dark: 'Mörk', searchPlaceholder: 'Sök...' },
    zh: { appearance: '外观', language: '语言', settings: '设置', light: '浅色', dark: '深色', searchPlaceholder: '搜索...' },
    ja: { appearance: '外観', language: '言語', settings: '設定', light: 'ライト', dark: 'ダーク', searchPlaceholder: '検索...' },
    ko: { appearance: '테마', language: '언어', settings: '설정', light: '라이트', dark: '다크', searchPlaceholder: '검색...' },
    hi: { appearance: 'दिखावट', language: 'भाषा', settings: 'सेटिंग्स', light: 'लाइट', dark: 'डार्क', searchPlaceholder: 'खोजें...' },
    id: { appearance: 'Tampilan', language: 'Bahasa', settings: 'Pengaturan', light: 'Terang', dark: 'Gelap', searchPlaceholder: 'Cari...' },
    vi: { appearance: 'Giao diện', language: 'Ngôn ngữ', settings: 'Cài đặt', light: 'Sáng', dark: 'Tối', searchPlaceholder: 'Tìm kiếm...' },
};


type LangCode = keyof typeof HEADER_DICT;

// --- SVG Icons ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [currentLang, setCurrentLang] = useState<LangCode>('en');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This component now only READS from the DOM, which is set by the provider.
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(initialTheme);
    const initialLang = (document.documentElement.lang || 'en') as LangCode;
    setCurrentLang(initialLang);

    // Event listeners remain for dynamic interactions
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const changeTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setCookie('user-theme', newTheme, 365);
  };

  const changeLanguage = (lang: { code: string, dir: string }) => {
    setCookie('user-lang', lang.code, 365);
    // The reload will trigger the PreferencesProvider to apply the new settings globally
    window.location.reload(); 
  };
  
  const t = HEADER_DICT[currentLang] || HEADER_DICT.en;

  return (
    <>
      <header className="appHeader">
        <Link href="/" className="logo">
          TextSpot
        </Link>
        <div className="headerActions">
            <button onClick={() => setIsSearchOpen(true)} className="headerBtn">
                <SearchIcon />
            </button>
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
      {isSearchOpen && (
        <div className="searchOverlay" onClick={() => setIsSearchOpen(false)}>
            <div className="searchPanel" onClick={(e) => e.stopPropagation()}>
                <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder={t.searchPlaceholder}
                    className="searchInput" 
                />
                <button onClick={() => setIsSearchOpen(false)} className="closeSearchBtn">
                    <XIcon />
                </button>
            </div>
        </div>
      )}
    </>
  );
}

