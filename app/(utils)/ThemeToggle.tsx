'use client';
import { useEffect, useState } from 'react';
import { applyTheme, ThemeMode } from '../(utils)/theme';

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
