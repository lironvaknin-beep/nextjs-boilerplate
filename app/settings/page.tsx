'use client';

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
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', dir: 'ltr' },
  { code: 'pt', label: 'Português', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
];

const SETTINGS_DICT = {
    en: { title: 'Settings', profile: 'Profile', name: 'Name', email: 'Email', appearance: 'Appearance', language: 'Language', light: 'Light', dark: 'Dark', save: 'Save Changes' },
    he: { title: 'הגדרות', profile: 'פרופיל', name: 'שם', email: 'אימייל', appearance: 'מראה', language: 'שפה', light: 'בהיר', dark: 'כהה', save: 'שמור שינויים' },
    es: { title: 'Ajustes', profile: 'Perfil', name: 'Nombre', email: 'Correo electrónico', appearance: 'Apariencia', language: 'Idioma', light: 'Claro', dark: 'Oscuro', save: 'Guardar cambios' },
    fr: { title: 'Paramètres', profile: 'Profil', name: 'Nom', email: 'E-mail', appearance: 'Apparence', language: 'Langue', light: 'Clair', dark: 'Sombre', save: 'Enregistrer les modifications' },
    de: { title: 'Einstellungen', profile: 'Profil', name: 'Name', email: 'E-Mail', appearance: 'Erscheinungsbild', language: 'Sprache', light: 'Hell', dark: 'Dunkel', save: 'Änderungen speichern' },
    pt: { title: 'Configurações', profile: 'Perfil', name: 'Nome', email: 'E-mail', appearance: 'Aparência', language: 'Idioma', light: 'Claro', dark: 'Escuro', save: 'Salvar alterações' },
    zh: { title: '设置', profile: '个人资料', name: '姓名', email: '电子邮件', appearance: '外观', language: '语言', light: '浅色', dark: '深色', save: '保存更改' },
    hi: { title: 'सेटिंग्स', profile: 'प्रोफ़ाइल', name: 'नाम', email: 'ईमेल', appearance: 'दिखावट', language: 'भाषा', light: 'लाइट', dark: 'डार्क', save: 'बदलाव सहेजें' },
}

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

    return (
        <div className={styles.settingsPage}>
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
