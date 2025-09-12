'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'auto' | 'light' | 'dark';

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto');

  useEffect(() => {
    const saved = (localStorage.getItem('wa_theme') as ThemeMode) || 'auto';
    setMode(saved);
  }, []);

  function cycle() {
    const next: ThemeMode = mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto';
    setMode(next);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const resolved = next === 'auto' ? (prefersDark ? 'dark' : 'light') : next;
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('wa_theme', next);
    document.cookie = `user-theme=${resolved}; path=/; max-age=31536000`;
  }

  return (
    <button onClick={cycle} aria-label="Theme" title="Theme">
      {mode[0].toUpperCase() + mode.slice(1)}
    </button>
  );
}
