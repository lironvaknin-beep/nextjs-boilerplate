'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './item.module.css'; // We will create this file next

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

const ITEM_DICT = {
    en: { back: "Back to feed", by: "By", author: "TextSpot AI" },
    he: { back: "חזרה לפיד", by: "מאת", author: "הבינה המלאכותית של TextSpot" },
    ar: { back: "العودة إلى الموجز", by: "بواسطة", author: "TextSpot AI" },
    // Other languages can be added here
};

type LangCode = keyof typeof ITEM_DICT;

// This sample data should eventually come from a database
const sampleData = [
    { id: 1, title: "The Robot on the Beach", snippet: "The salt spray tasted of adventure. For Leo, a ten-year-old with more imagination than friends, the beach was a universe of possibilities. Today, that universe delivered. Nestled between seaweed and driftwood was a shape that didn't belong. It was smooth, metallic, and gleaming under the morning sun. A chrome head, tilted sideways, with two large, dark optical sensors. It was a robot, dormant and half-buried in the sand. Leo's heart hammered against his ribs. He had to help it.", category: "Fiction" },
    { id: 2, title: "5 Principles of Modern UI Design", snippet: "In the ever-evolving landscape of digital interfaces, certain principles remain timeless. First, clarity over clutter. A clean interface is an effective one. Second, consistency is key. Users should not have to learn new patterns for common actions within your app. Third, provide feedback. Every action should have a clear and immediate reaction. Fourth, prioritize user control. Users feel more comfortable when they are in command. Lastly, embrace accessibility. Great design is usable by everyone, regardless of ability.", category: "Tech Article" },
    { id: 3, title: "My Grandmother's Secret Pasta Recipe", snippet: "The secret isn't in the tomatoes, though they must be San Marzano. It's not in the basil, which has to be fresh. The secret, my Nonna would say, is patience. The sauce must simmer for no less than four hours, a slow, gentle process that melds the flavors into a single, harmonious melody. You cannot rush love, and you cannot rush a good sauce. This recipe is a testament to that philosophy, a taste of a slow, deliberate life.", category: "Recipe" },
    // Add other items to match the home page
];

export default function ItemPage() {
    const params = useParams();
    const [lang, setLang] = useState<LangCode>('en');
    const [item, setItem] = useState<(typeof sampleData)[0] | null>(null);

    useEffect(() => {
        const currentLang = (getCookie('user-lang') || 'en') as LangCode;
        if (currentLang in ITEM_DICT) {
            setLang(currentLang);
        }

        if (params.id) {
            const foundItem = sampleData.find(d => d.id === Number(params.id));
            setItem(foundItem || null);
        }
    }, [params.id]);

    const t = useMemo(() => ITEM_DICT[lang] || ITEM_DICT.en, [lang]);

    if (!item) {
        return <div className={styles.loading}>Loading...</div>; // Or a proper not-found page
    }

    return (
        <article className={styles.itemPage}>
            <header className={styles.itemHeader}>
                <Link href="/" className={styles.backLink}>
                    &larr; {t.back}
                </Link>
                <p className={styles.category}>{item.category}</p>
                <h1 className={styles.title}>{item.title}</h1>
                <div className={styles.meta}>
                    {t.by} <span className={styles.author}>{t.author}</span>
                </div>
            </header>
            
            <div className={styles.content}>
                <p>{item.snippet}</p>
                 {/* In a real app, this would render the full content, perhaps from Markdown */}
            </div>
        </article>
    );
}
