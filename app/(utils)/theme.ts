export type ThemeMode = 'auto' | 'dark' | 'light';
export type LangCode = 'en' | 'he' | 'ar' | 'fr' | 'es' | 'ru';

export const isRTL = (lang: LangCode): boolean => (lang === 'he' || lang === 'ar');

export function applyTheme(mode: ThemeMode): void {
  try {
    const prefersDark = typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode;
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('wa_theme', mode);
    document.cookie = `user-theme=${resolved}; path=/; max-age=31536000`;
  } catch (e) {
    console.error('Failed to apply theme:', e);
  }
}

export function applyLang(lang: LangCode): void {
  try {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRTL(lang) ? 'rtl' : 'ltr');
    localStorage.setItem('wa_lang', lang);
  } catch (e) {
    console.error('Failed to apply language:', e);
  }
}
