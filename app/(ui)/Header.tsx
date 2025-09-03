'use client';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [open, setOpen] = useState(false);

  // This function will be used to render the navigation links
  const renderNavLinks = () => (
    <nav style={{ display: 'grid', gap: '0.5rem' }}>
      <a href="/" className="nav-btn">Home</a>
      <a href="/builder" className="nav-btn active">Builder</a>
      <a href="/explore" className="nav-btn">Explore</a>
      <a href="/me/library" className="nav-btn">My Library</a>
      <a href="/settings" className="nav-btn">Settings</a>
    </nav>
  );

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
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Drawer (Side Menu) */}
      <div className={open ? 'drawer open' : 'drawer'} aria-hidden={!open} role="dialog">
        <div className="drawer-backdrop" onClick={() => setOpen(false)}></div>
        <aside className="drawer-panel" aria-modal="true" aria-label="Main menu">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="logo">Menu</span>
            <button className="btn-secondary" onClick={() => setOpen(false)}>Close</button>
          </div>
          {renderNavLinks()}
        </aside>
      </div>
    </>
  );
}

