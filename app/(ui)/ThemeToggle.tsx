'use client';
import { useEffect, useState } from 'react';
import { applyTheme, ThemeMode } from '../(utils)/theme';

export default function ThemeToggle() {
  const [currentMode, setCurrentMode] = useState<ThemeMode>('auto');

  useEffect(() => {
    // On initial load, read the saved theme from localStorage
    const savedMode = (localStorage.getItem('wa_theme') as ThemeMode) || 'auto';
    setCurrentMode(savedMode);
  }, []);

  function cycleTheme() {
    // Cycle through: auto -> light -> dark -> auto
    const nextMode = currentMode === 'auto' ? 'light' : currentMode === 'light' ? 'dark' : 'auto';
    setCurrentMode(nextMode);
    applyTheme(nextMode);
  }
  
  // Capitalize the first letter for display
  const buttonLabel = currentMode.charAt(0).toUpperCase() + currentMode.slice(1);

  return (
    <button
      className="control-btn"
      onClick={cycleTheme}
      title="Cycle theme"
      aria-label="Cycle theme"
    >
      {buttonLabel}
    </button>
  );
}

