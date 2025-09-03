export type ThemeMode = 'auto' | 'dark' | 'light';
export type LangCode = 'en' | 'he' | 'ar' | 'fr' | 'es' | 'ru';

/**
 * Checks if a given language code corresponds to a Right-to-Left language.
 * @param lang The language code to check.
 * @returns True if the language is RTL, otherwise false.
 */
export const isRTL = (lang: LangCode): boolean => (lang === 'he' || lang === 'ar');

/**
 * Applies the selected theme to the document and saves it to localStorage.
 * @param mode The theme mode to apply ('auto', 'dark', or 'light').
 */
export function applyTheme(mode: ThemeMode): void {
  try {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Resolve 'auto' to 'dark' or 'light' based on system preference
    const resolvedTheme = (mode === 'auto') ? (prefersDark ? 'dark' : 'light') : mode;
    
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem('wa_theme', mode);
  } catch (e) {
    console.error('Failed to apply theme:', e);
  }
}

/**
 * Applies the selected language and direction to the document and saves it to localStorage.
 * @param lang The language code to apply.
 */
export function applyLang(lang: LangCode): void {
  try {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRTL(lang) ? 'rtl' : 'ltr');
    localStorage.setItem('wa_lang', lang);
  } catch (e) {
    console.error('Failed to apply language:', e);
  }
}

