'use client';

import { useEffect, ReactNode } from 'react';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1); // ← היה חתוך אצלך
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
}

export default function PreferencesProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // החזרת שורה שנחתכה: window.matchMedia
    const systemPrefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const themeCookie = getCookie('user-theme'); // 'dark' | 'light' | null
    const initialTheme = themeCookie || (systemPrefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  return <>{children}</>;
}
