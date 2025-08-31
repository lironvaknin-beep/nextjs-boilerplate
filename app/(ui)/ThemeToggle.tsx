'use client';
import { useEffect, useState } from 'react';

type ThemeMode = 'auto' | 'dark' | 'light';

function applyTheme(mode: ThemeMode) {
  try {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = (mode === 'dark') ? 'dark' : (mode === 'light' ? 'light' : (prefersDark ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('wa_theme', mode);
  } catch (e) {}
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto');
  useEffect(() => { setMode((localStorage.getItem('wa_theme') as ThemeMode) || 'auto'); }, []);
  function cycle() {
    const next = mode === 'auto' ? 'dark' : mode === 'dark' ? 'light' : 'auto';
    setMode(next);
    applyTheme(next);
  }
  const label = mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light';
  return <button className="burger" title="Theme" aria-label="Theme" onClick={cycle}>{label}</button>;
}
