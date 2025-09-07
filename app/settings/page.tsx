// File: app/[locale]/settings/page.tsx
// Location: /app/[locale]/settings/page.tsx
// CRITICAL FIX: This component now renders its UI only on the client-side
// to definitively solve the "document is not defined" prerender error.

'use client';

import { useState, useEffect } from 'react';
import styles from './settings.module.css';
import { useTranslations } from 'next-intl';

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

export default function SettingsPage() {
    const [isClient, setIsClient] = useState(false);
    const [theme, setTheme] = useState('light');
    const [currentLangCode, setCurrentLangCode] = useState('en');
    const [dir, setDir] = useState('ltr');
    const t = useTranslations('SettingsPage');

    useEffect(() => {
        // This effect runs only on the client, after the initial render.
        setIsClient(true);

        const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(initialTheme as 'light' | 'dark');
        
        const initialLang = document.documentElement.lang || 'en';
        setCurrentLangCode(initialLang);
        
        const initialDir = document.documentElement.dir || 'ltr';
        setDir(initialDir);
    }, []);

    const changeLanguage = (langInfo: { code: string, dir: string }) => {
        setCookie('user-lang', langInfo.code, 365);
        window.location.href = `/${langInfo.code}/settings`;
    };

    const changeTheme = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        setCookie('user-theme', newTheme, 365);
    };
    
    // On the server or during the initial render, return null or a loading skeleton.
    if (!isClient) {
        return null;
    }

    return (
        <div className={styles.settingsPage} dir={dir}>
            <h1 className={styles.title}>{t('title')}</h1>

            <div className={styles.settingsCard}>
                <h2 className={styles.cardTitle}>{t('profile')}</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>{t('name')}</label>
                    <input type="text" id="name" className={styles.formInput} placeholder="Your Name" />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>{t('email')}</label>
                    <input type="email" id="email" className={styles.formInput} placeholder="your@email.com" />
                </div>
            </div>

            <div className={styles.settingsCard}>
                <h2 className={styles.cardTitle}>{t('appearance')}</h2>
                <div className={styles.themeSelector}>
                    <button onClick={() => changeTheme('light')} className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}>{t('light')}</button>
                    <button onClick={() => changeTheme('dark')} className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}>{t('dark')}</button>
                </div>
            </div>

            <div className={styles.settingsCard}>
                <h2 className={styles.cardTitle}>{t('language')}</h2>
                <div className={styles.langGrid}>
                    {LANGUAGES.map((langInfo) => (
                        <button key={langInfo.code} onClick={() => changeLanguage(langInfo)} className={`${styles.langBtn} ${currentLangCode === langInfo.code ? styles.active : ''}`}>
                            {langInfo.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.saveBtn}>{t('save')}</button>
            </div>
        </div>
    );
}

