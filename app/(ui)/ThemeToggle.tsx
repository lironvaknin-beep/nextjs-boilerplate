'use client';
import { useEffect, useState } from 'react';
import { applyTheme, ThemeMode } from '../(utils)/theme';

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto');

  useEffect(() => {
    const saved = (localStorage.getItem('wa_theme') as ThemeMode) || 'auto';
    setMode(saved);
  }, []);

  function cycleTheme() {
    const nextMode = mode === 'auto' ? 'dark' : mode === 'dark' ? 'light' : 'auto';
    setMode(nextMode);
    applyTheme(nextMode);
  }

  const label = mode.charAt(0).toUpperCase() + mode.slice(1);

  return (
    <button className="control-btn" title="Cycle theme" aria-label="Cycle theme" onClick={cycleTheme}>
      {label}
    </button>
  );
}

