'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './home.module.css';

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
    en: { title: "What's new on TextSpot?", all: "All" },
    he: { title: "מה חדש ב-TextSpot?", all: "הכל" },
    ar: { title: "ما الجديد في TextSpot؟", all: "الكل" },
    // Other languages can be added here
};

type LangCode = keyof typeof HOME_DICT;

const sampleData = [
    { id: 1, title: "The Robot on the Beach", snippet: "A short story about a discovery that changed everything.", category: "Fiction", designVariant: 'gradient-burst', },
    { id: 2, title: "5 Principles of Modern UI Design", snippet: "Key takeaways from A/B testing at scale.", category: "Tech Article", designVariant: 'solid-bold', },
    { id: 3, title: "My Grandmother's Secret Pasta Recipe", snippet: "More than just food, it's a taste of home.", category: "Recipe", designVariant: 'minimalist-light', },
    { id: 4, title: "Echoes in the Silence", snippet: "A new song about finding your voice.", category: "Music", designVariant: 'dark-dramatic', },
    { id: 5, title: "How to Pitch Your Startup in 60 Seconds", snippet: "A practical guide for entrepreneurs.", category: "Business", designVariant: 'solid-bold', },
    { id: 6, title: "A Journey Through Ancient Rome", snippet: "Exploring the history that shaped our world.", category: "History", designVariant: 'gradient-burst', },
];

// Dynamically get all unique categories from the data
const allCategories = ['All', ...Array.from(new Set(sampleData.map(item => item.category)))];


export default function HomePage() {
    const [lang, setLang] = useState<LangCode>('en');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const currentLang = (getCookie('user-lang') || 'en') as LangCode;
        if (currentLang in HOME_DICT) {
            setLang(currentLang);
        }
    }, []);

    const t = useMemo(() => HOME_DICT[lang] || HOME_DICT.en, [lang]);

    const filteredData = useMemo(() => {
        if (activeFilter === 'All') {
            return sampleData;
        }
        return sampleData.filter(item => item.category === activeFilter);
    }, [activeFilter]);

    return (
        <div className={styles.homePage}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>{t.title}</h1>
            </header>

            <nav className={styles.filterBar}>
                {allCategories.map(category => (
                    <button 
                        key={category} 
                        className={`${styles.filterBtn} ${activeFilter === category ? styles.active : ''}`}
                        onClick={() => setActiveFilter(category)}
                    >
                        {category === 'All' ? t.all : category}
                    </button>
                ))}
            </nav>
            
            <main className={styles.feedGrid}>
                {filteredData.map(item => (
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

