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
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <LanguageSwitcher />
            <ThemeToggle />
            <button className="burger" aria-label="פתיחת תפריט" onClick={()=>setOpen(true)}>☰</button>
          </div>
        </div>
      </header>

      <div className={open ? 'drawer open' : 'drawer'} aria-hidden={!open}>
        <div className="drawer-backdrop" onClick={()=>setOpen(false)}></div>
        <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label="תפריט">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
            <strong>תפריט</strong>
            <button className="btn-ghost" onClick={()=>setOpen(false)}>סגור</button>
          </div>
          <nav style={{display:'grid', gap:8}}>
            <a href="/" className="nav-btn">דף הבית</a>
            <a href="/builder" className="nav-btn">Builder</a>
            <a href="/explore" className="nav-btn">גילוי</a>
            <a href="/me/library" className="nav-btn">הספרייה שלי</a>
            <a href="/settings" className="nav-btn">הגדרות</a>
          </nav>
        </aside>
      </div>
    </>
  );
}
