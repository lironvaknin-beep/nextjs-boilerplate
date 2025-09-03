'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './home.module.css'; // We will create this file next

// --- Helper function for getting a cookie ---
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const HOME_DICT = {
    en: { title: "What's new on TextSpot?" },
    he: { title: "מה חדש ב-TextSpot?" },
    ar: { title: "ما الجديد في TextSpot؟" },
    // Other languages can be added here
};

type LangCode = keyof typeof HOME_DICT;

// Sample data to simulate a content feed
// Based on research, variety in presentation is key to engagement.
// The `designVariant` will allow us to apply different CSS styles.
const sampleData = [
    {
        id: 1,
        title: "The Robot on the Beach",
        snippet: "A short story about a discovery that changed everything.",
        category: "Fiction",
        designVariant: 'gradient-burst', // Dynamic, eye-catching
    },
    {
        id: 2,
        title: "5 Principles of Modern UI Design",
        snippet: "Key takeaways from A/B testing at scale.",
        category: "Tech Article",
        designVariant: 'solid-bold', // Strong, authoritative
    },
    {
        id: 3,
        title: "My Grandmother's Secret Pasta Recipe",
        snippet: "More than just food, it's a taste of home.",
        category: "Recipe",
        designVariant: 'minimalist-light', // Clean, elegant
    },
    {
        id: 4,
        title: "Echoes in the Silence",
        snippet: "A new song about finding your voice.",
        category: "Music",
        designVariant: 'dark-dramatic', // Moody, artistic
    },
    {
        id: 5,
        title: "How to Pitch Your Startup in 60 Seconds",
        snippet: "A practical guide for entrepreneurs.",
        category: "Business",
        designVariant: 'solid-bold',
    },
    {
        id: 6,
        title: "A Journey Through Ancient Rome",
        snippet: "Exploring the history that shaped our world.",
        category: "History",
        designVariant: 'gradient-burst',
    },
];

export default function HomePage() {
    const [lang, setLang] = useState<LangCode>('en');

    useEffect(() => {
        const currentLang = (getCookie('user-lang') || 'en') as LangCode;
        if (currentLang in HOME_DICT) {
            setLang(currentLang);
        }
    }, []);

    const t = useMemo(() => HOME_DICT[lang] || HOME_DICT.en, [lang]);

    return (
        <div className={styles.homePage}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>{t.title}</h1>
            </header>
            
            <main className={styles.feedGrid}>
                {sampleData.map(item => (
                    <Link href={`/item/${item.id}`} key={item.id} className={`${styles.card} ${styles[item.designVariant]}`}>
                        <div className={styles.cardContent}>
                            <span className={styles.category}>{item.category}</span>
                            <h2 className={styles.cardTitle}>{item.title}</h2>
                            <p className={styles.snippet}>{item.snippet}</p>
                        </div>
                    </Link>
                ))}
            </main>
        </div>
    );
}
