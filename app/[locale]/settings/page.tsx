'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import styles from './settings.module.css';

const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'he', label: 'עברית',  dir: 'rtl' },
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
  { code: 'zh', label: '中文',   dir: 'ltr' },
  { code: 'ja', label: '日本語',  dir: 'ltr' },
  { code: 'ko', label: '한국어',  dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
  { code: 'id', label: 'Bahasa Indonesia', dir: 'ltr' },
  { code: 'vi', label: 'Tiếng Việt', dir: 'ltr' },
];

function setCookie(name: string, value: string, days: number) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days*24*60*60*1000);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
  } catch {}
}

export default function SettingsPage() {
  const t = useTranslations('SettingsPage');
  const router = useRouter();

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentLangCode, setCurrentLangCode] = useState('en');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(initialTheme as 'light' | 'dark');

    const initialLang = document.documentElement.lang || 'en';
    setCurrentLangCode(initialLang);

    const initialDir = document.documentElement.dir || 'ltr';
    setDir(initialDir as 'ltr' | 'rtl');
  }, []);

  const changeTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setCookie('user-theme', newTheme, 365);
  };

  const changeLanguage = (langInfo: { code: string; dir: string }) => {
    setCookie('user-lang', langInfo.code, 365);
    router.push(`/${langInfo.code}/settings`);
  };

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
          <button
            onClick={() => changeTheme('light')}
            className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
          >
            {t('light')}
          </button>
          <button
            onClick={() => changeTheme('dark')}
            className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
          >
            {t('dark')}
          </button>
        </div>
      </div>

      <div className={styles.settingsCard}>
        <h2 className={styles.cardTitle}>{t('language')}</h2>
        <div className={styles.langGrid}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang)}
              className={`${styles.langBtn} ${currentLangCode === lang.code ? styles.active : ''}`}
              dir={lang.dir as 'ltr' | 'rtl'}
            >
              {lang.label}
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
