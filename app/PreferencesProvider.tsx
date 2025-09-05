'use client';

import { useEffect } from 'react';

// --- Helper function for getting a cookie ---
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
  { code: 'en', dir: 'ltr' }, { code: 'he', dir: 'rtl' }, { code: 'ar', dir: 'rtl' },
  { code: 'es', dir: 'ltr' }, { code: 'fr', dir: 'ltr' }, { code: 'de', dir: 'ltr' },
  { code: 'it', dir: 'ltr' }, { code: 'pt', dir: 'ltr' }, { code: 'ru', dir: 'ltr' },
  { code: 'pl', dir: 'ltr' }, { code: 'tr', dir: 'ltr' }, { code: 'nl', dir: 'ltr' },
  { code: 'sv', dir: 'ltr' }, { code: 'zh', dir: 'ltr' }, { code: 'ja', dir: 'ltr' },
  { code: 'ko', dir: 'ltr' }, { code: 'hi', dir: 'ltr' }, { code: 'id', dir: 'ltr' },
  { code: 'vi', dir: 'ltr' },
];

/**
 * This is a client-side component that runs only once when the app loads.
 * Its sole purpose is to read user preferences from cookies and apply them
 * to the root <html> element, ensuring consistency across the entire site.
 */
export default function PreferencesProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Apply Language and Direction
        const langCookie = getCookie('user-lang') || 'en';
        const langInfo = LANGUAGES.find(l => l.code === langCookie) || LANGUAGES[0];
        document.documentElement.lang = langInfo.code;
        document.documentElement.dir = langInfo.dir;

        // Apply Theme
        const themeCookie = getCookie('user-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = themeCookie || (systemPrefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    return <>{children}</>;
}
