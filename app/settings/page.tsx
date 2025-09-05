'use client'; // CRITICAL: This directive marks the component as a Client Component

import { useState, useEffect } from 'react';
import styles from './settings.module.css';

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

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
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

const SETTINGS_DICT = {
    en: { title: 'Settings', profile: 'Profile', name: 'Name', email: 'Email', appearance: 'Appearance', language: 'Language', light: 'Light', dark: 'Dark', save: 'Save Changes' },
    he: { title: 'הגדרות', profile: 'פרופיל', name: 'שם', email: 'אימייל', appearance: 'מראה', language: 'שפה', light: 'בהיר', dark: 'כהה', save: 'שמור שינויים' },
    ar: { title: 'الإعدادات', profile: 'الملف الشخصي', name: 'الاسم', email: 'البريد الإلكتروني', appearance: 'المظهر', language: 'اللغة', light: 'فاتح', dark: 'داكن', save: 'حفظ التغييرات' },
    // Full translations for all languages...
};

type LangCode = keyof typeof SETTINGS_DICT;

function useUserPreferences() {
  const [lang, setLang] = useState<LangCode>('en');
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    const cookieLang = getCookie('user-lang') as LangCode;
    if (cookieLang && cookieLang in SETTINGS_DICT) {
      setLang(cookieLang);
    }
    const cookieTheme = getCookie('user-theme') || 'light';
    setTheme(cookieTheme as 'light' | 'dark');
  }, []);

  const changeLanguage = (langInfo: { code: string, dir: string }) => {
    setCookie('user-lang', langInfo.code, 365);
    document.documentElement.lang = langInfo.code;
    document.documentElement.dir = langInfo.dir;
    window.location.reload();
  };

  const changeTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setCookie('user-theme', newTheme, 365);
  };

  return { lang, theme, changeLanguage, changeTheme };
}

export default function SettingsPage() {
    const { lang, theme, changeLanguage, changeTheme } = useUserPreferences();
    const t = SETTINGS_DICT[lang] || SETTINGS_DICT.en;

    const dir = LANGUAGES.find(l => l.code === lang)?.dir || 'ltr';

    return (
        <div className={styles.settingsPage} dir={dir}>
            <h1 className={styles.title}>{t.title}</h1>

            <div className={styles.settingsCard}>
                <h2 className={styles.cardTitle}>{t.profile}</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>{t.name}</label>
                    <input type="text" id="name" className={styles.formInput} placeholder="Your Name" />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>{t.email}</label>
                    <input type="email" id="email" className={styles.formInput} placeholder="your@email.com" />
                </div>
            </div>

            <div className={styles.settingsCard}>
                <h2 className={styles.cardTitle}>{t.appearance}</h2>
                <div className={styles.themeSelector}>
                    <button onClick={() => changeTheme('light')} className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}>{t.light}</button>
                    <button onClick={() => changeTheme('dark')} className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}>{t.dark}</button>
                </div>
            </div>

            <div className={styles.settingsCard}>
                <h2 className={styles.cardTitle}>{t.language}</h2>
                <div className={styles.langGrid}>
                    {LANGUAGES.map((langInfo) => (
                        <button key={langInfo.code} onClick={() => changeLanguage(langInfo)} className={`${styles.langBtn} ${lang === langInfo.code ? styles.active : ''}`}>
                            {langInfo.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.saveBtn}>{t.save}</button>
            </div>
        </div>
    );
}

