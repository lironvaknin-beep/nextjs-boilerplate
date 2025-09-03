'use client';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="app-header" role="banner">
        <div className="header-inner">
          <div className="logo" aria-label="write">
            write
          </div>
          <div className="header-controls">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="control-btn"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`drawer ${isDrawerOpen ? 'open' : ''}`}
        aria-hidden={!isDrawerOpen}
        role="dialog"
      >
        <div
          className="drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        ></div>
        <aside
          className="drawer-panel"
          aria-modal="true"
          aria-label="Main menu"
        >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0.5rem'}}>
                <span className="logo">Menu</span>
                <button className="btn-secondary" onClick={() => setDrawerOpen(false)}>
                    Close
                </button>
            </div>
          <nav style={{display: 'grid', gap: '0.5rem'}}>
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

