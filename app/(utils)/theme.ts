export type ThemeMode = 'auto' | 'dark' | 'light';
export type LangCode = 'en'|'he'|'ar'|'fr'|'es'|'ru';
export const isRTL = (lang: LangCode) => (lang === 'he' || lang === 'ar');

export function applyTheme(mode: ThemeMode) {
  try {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = (mode === 'dark') ? 'dark' : (mode === 'light' ? 'light' : (prefersDark ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('wa_theme', mode);
  } catch (e) {}
}
export function applyLang(lang: LangCode) {
  try {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRTL(lang) ? 'rtl' : 'ltr');
    localStorage.setItem('wa_lang', lang);
  } catch (e) {}
}
