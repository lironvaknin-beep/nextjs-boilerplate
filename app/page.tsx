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

const DICT = {
    en: { welcome: "Welcome to TextSpot" },
    he: { welcome: "ברוכים הבאים ל-TextSpot" },
    ar: { welcome: "مرحبًا بك في TextSpot" },
    es: { welcome: "Bienvenido a TextSpot" },
    fr: { welcome: "Bienvenue sur TextSpot" },
    de: { welcome: "Willkommen bei TextSpot" },
    it: { welcome: "Benvenuto in TextSpot" },
    pt: { welcome: "Bem-vindo ao TextSpot" },
    ru: { welcome: "Добро пожаловать в TextSpot" },
    pl: { welcome: "Witamy w TextSpot" },
    tr: { welcome: "TextSpot'a Hoş Geldiniz" },
    nl: { welcome: "Welkom bij TextSpot" },
    sv: { welcome: "Välkommen till TextSpot" },
    zh: { welcome: "欢迎来到 TextSpot" },
    ja: { welcome: "TextSpotへようこそ" },
    ko: { welcome: "TextSpot에 오신 것을 환영합니다" },
    hi: { welcome: "TextSpot में आपका स्वागत है" },
    id: { welcome: "Selamat datang di TextSpot" },
    vi: { welcome: "Chào mừng đến với TextSpot" },
};

const CATEGORIES_DICT = {
    en: { "Trending Now": "Trending Now", "Short Stories": "Short Stories", "For You": "For You", "Tech & Future": "Tech & Future", "Creative Corner": "Creative Corner" },
    he: { "Trending Now": "פופולרי עכשיו", "Short Stories": "סיפורים קצרים", "For You": "בשבילך", "Tech & Future": "טכנולוגיה ועתיד", "Creative Corner": "פינה יצירתית" },
    ar: { "Trending Now": "الرائج الآن", "Short Stories": "قصص قصيرة", "For You": "لك", "Tech & Future": "التكنولوجيا والمستقبل", "Creative Corner": "ركن الإبداع" },
    // Full translations for other languages...
};

type LangCode = keyof typeof DICT;

const sampleData = [
    // Trending Now
    { id: 1, title: "The Robot on the Beach", snippet: "A short story about a discovery that changed everything.", category: "Trending Now", designVariant: 'gradient-burst' },
    { id: 2, title: "5 Principles of Modern UI Design", snippet: "Key takeaways from A/B testing at scale.", category: "Trending Now", designVariant: 'solid-bold' },
    { id: 5, title: "How to Pitch Your Startup in 60 Seconds", snippet: "A practical guide for entrepreneurs.", category: "Trending Now", designVariant: 'solid-bold' },
    { id: 11, title: "The Art of Saying No", snippet: "Protect your time and energy.", category: "Trending Now", designVariant: 'minimalist-light' },

    // Short Stories
    { id: 7, title: "Galaxy's Edge", snippet: "A sci-fi adventure beyond the stars.", category: "Short Stories", designVariant: 'dark-dramatic' },
    { id: 8, title: "The Last Librarian", snippet: "In a world without books, one woman remembers.", category: "Short Stories", designVariant: 'minimalist-light' },
    { id: 12, title: "Whispers in the Old Manor", snippet: "A gothic mystery unfolds.", category: "Short Stories", designVariant: 'dark-dramatic' },
    { id: 13, title: "A Summer in Tuscany", snippet: "Finding love and pasta.", category: "Short Stories", designVariant: 'gradient-burst' },
    
    // For You
    { id: 3, title: "My Grandmother's Secret Pasta Recipe", snippet: "More than just food, it's a taste of home.", category: "For You", designVariant: 'minimalist-light' },
    { id: 10, title: "The Perfect Sourdough", snippet: "A step-by-step guide to baking bread.", category: "For You", designVariant: 'gradient-burst' },
    { id: 4, title: "Echoes in the Silence", snippet: "A new song about finding your voice.", category: "For You", designVariant: 'dark-dramatic' },

    // Tech & Future
    { id: 9, title: "Getting Started with React Server Components", snippet: "A deep dive into the future of React.", category: "Tech & Future", designVariant: 'solid-bold' },
    { id: 14, title: "Is AI Conscious?", snippet: "A philosophical debate for the modern age.", category: "Tech & Future", designVariant: 'dark-dramatic' },
    { id: 15, title: "The Future of Remote Work", snippet: "How technology is reshaping the office.", category: "Tech & Future", designVariant: 'minimalist-light' },
];

const groupedData = sampleData.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
}, {} as Record<string, typeof sampleData>);


export default function HomePage() {
    const [lang, setLang] = useState<LangCode>('en');

    useEffect(() => {
        const currentLang = (getCookie('user-lang') || 'en') as LangCode;
        if (currentLang in DICT) {
            setLang(currentLang);
        }
        // Ensure theme is applied on load
        const currentTheme = getCookie('user-theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, []);

    const t = useMemo(() => DICT[lang] || DICT.en, [lang]);
    const t_cat = useMemo(() => CATEGORIES_DICT[lang] || CATEGORIES_DICT.en, [lang]);

    return (
        <div className={styles.homePage}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>{t.welcome}</h1>
            </header>
            
            <main className={styles.feedContainer}>
                {Object.entries(groupedData).map(([category, items]) => (
                    <section key={category} className={styles.categoryRow}>
                        <h2 className={styles.rowTitle}>{t_cat[category as keyof typeof t_cat] || category}</h2>
                        <div className={styles.rowSlider}>
                            {items.map(item => (
                                <Link href={`/item/${item.id}`} key={item.id} className={`${styles.card} ${styles[item.designVariant]}`}>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{item.title}</h3>
                                        <p className={styles.snippet}>{item.snippet}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    );
}

