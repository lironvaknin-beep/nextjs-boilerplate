'use client';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="app-header" role="banner">
        <div className="header-inner">
          <div className="logo" aria-label="write">write</div>
          <div className="header-controls">
            <LanguageSwitcher />
            <ThemeToggle />
            <button 
              className="control-btn" 
              aria-label="Open menu" 
              onClick={() => setOpen(true)}
              // This is an SVG icon for the burger menu
              dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>` }}
            />
          </div>
        </div>
      </header>

      {/* Drawer (Side Menu) */}
      <div className={open ? 'drawer open' : 'drawer'} aria-hidden={!open} role="dialog">
        <div className="drawer-backdrop" onClick={() => setOpen(false)}></div>
        <aside className="drawer-panel" aria-modal="true" aria-label="Main menu">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0.5rem' }}>
            <span className="logo">Menu</span>
            <button className="btn-secondary" onClick={() => setOpen(false)}>Close</button>
          </div>
          <nav style={{ display: 'grid', gap: '0.5rem' }}>
            <a href="/" className="nav-btn">Home</a>
            <a href="/builder" className="nav-btn active">Builder</a>
            <a href="/explore" className="nav-btn">Explore</a>
            <a href="/me/library" className="nav-btn">My Library</a>
            <a href="/settings" className="nav-btn">Settings</a>
          </nav>
        </aside>
      </div>
    </>
  );
}

