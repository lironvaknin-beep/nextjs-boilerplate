'use client';

import { useEffect, ReactNode } from 'react';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  for (let c of document.cookie.split(';')) {
    c = c.trim();
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
  }
  return null;
}

export default function PreferencesProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const cookieTheme = getCookie('user-theme');
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      const resolved = cookieTheme || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', resolved);
    } catch {}
  }, []);
  return <>{children}</>;
}
