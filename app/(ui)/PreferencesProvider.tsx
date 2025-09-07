// File: app/(ui)/PreferencesProvider.tsx
// Location: /app/(ui)/PreferencesProvider.tsx
// This component's SOLE responsibility is now to manage the theme (light/dark).
// Language and direction are handled globally by next-intl's middleware and layouts.

'use client';

import { useEffect, ReactNode } from 'react';

// --- Helper function for getting a cookie ---
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

/**
 * This is a client-side component that runs only once when the app loads.
 * It reads the user's theme preference from cookies and applies it
 * to the root <html> element, ensuring visual consistency.
 */
export default function PreferencesProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Apply Theme based on cookie or system preference
        const themeCookie = getCookie('user-theme');
        const systemPrefersDark = 
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = themeCookie || (systemPrefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []); // Runs only once on initial client-side render

    return <>{children}</>;
}

