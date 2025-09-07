// File: app/[locale]/page.tsx
// Location: /app/[locale]/page.tsx
// This is now the one and only homepage component for the entire application.

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from '../home.module.css';
import sampleData from '../sample-data.json';
import { useTranslations } from 'next-intl';

const allCategories = ['All', ...Array.from(new Set(sampleData.map(item => item.category)))];

// Group data by category for the Netflix-style rows
const groupedData = sampleData.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
}, {} as Record<string, typeof sampleData>);

export default function HomePage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const t = useTranslations('HomePage');
    const t_cat = useTranslations('HomePage.categories');

    // This state is just to trigger re-renders when language changes, if needed.
    const [currentLang, setCurrentLang] = useState('en');
    useEffect(() => {
        setCurrentLang(document.documentElement.lang || 'en');
    }, []);

    const filteredCategories = useMemo(() => {
        if (activeFilter === 'All') {
            return Object.entries(groupedData);
        }
        return Object.entries(groupedData).filter(([category]) => category === activeFilter);
    }, [activeFilter]);

    return (
        <div className={styles.homePage}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>{t('welcome')}</h1>
            </header>

            <nav className={styles.filterBar}>
                {allCategories.map(category => (
                    <button 
                        key={category} 
                        className={`${styles.filterBtn} ${activeFilter === category ? styles.active : ''}`}
                        onClick={() => setActiveFilter(category)}
                    >
                        {category === 'All' ? t('all') : t_cat(category) || category}
                    </button>
                ))}
            </nav>
            
            <main className={styles.feedContainer}>
                {filteredCategories.map(([category, items]) => (
                    <section key={category} className={styles.categoryRow}>
                        <h2 className={styles.rowTitle}>{t_cat(category) || category}</h2>
                        <div className={styles.rowSlider}>
                            {items.map(item => (
                                <Link href={`/item/${item.id}`} key={item.id} className={`${styles.card} ${styles[item.cardType]}`}>
                                    <div className={styles.cardOverlay} style={{background: item.colorGradient}}/>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{item.title}</h3>
                                        {item.snippet && <p className={styles.snippet}>{item.snippet}</p>}
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
