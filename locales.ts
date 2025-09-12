export const locales = [
  'ar','de','en','es','fr','he','hi','id','it','ja','ko','nl','pl','pt','ru','sv','tr','vi','zh'
] as const;

export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';
