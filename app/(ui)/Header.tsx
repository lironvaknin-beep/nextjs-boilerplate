'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// --- SVG Icons ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;


export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when search opens
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    // Handle Escape key press to close search
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
        document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

  return (
    <>
      <header className="appHeader">
        <Link href="/" className="logo">
          TextSpot
        </Link>

        {/* Search Action Button */}
        <div className="headerActions">
            <button onClick={() => setIsSearchOpen(true)} className="headerBtn">
                <SearchIcon />
            </button>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="searchOverlay" onClick={() => setIsSearchOpen(false)}>
            <div className="searchPanel" onClick={(e) => e.stopPropagation()}>
                <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search for content..." 
                    className="searchInput" 
                />
                <button onClick={() => setIsSearchOpen(false)} className="closeSearchBtn">
                    <XIcon />
                </button>
            </div>
        </div>
      )}
    </>
  );
}

