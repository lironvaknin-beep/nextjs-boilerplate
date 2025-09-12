'use client';

import { Link } from '../../navigation';
import styles from '../home.module.css';
import sampleData from '../sample-data.json';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

const grouped = sampleData.reduce<Record<string, typeof sampleData>>((acc, item) => {
  (acc[item.category] ||= []).push(item);
  return acc;
}, {});
const allCategories = ['All', ...Object.keys(grouped)];

export default function HomePage() {
  const [active, setActive] = useState('All');
  const t = useTranslations('HomePage');
  const tCat = useTranslations('HomePage.categories');

  const rows = useMemo(
    () => (active === 'All' ? Object.entries(grouped) : Object.entries(grouped).filter(([c]) => c === active)),
    [active]
  );

  return (
    <div className={styles.homePage}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>{t('welcome')}</h1>
      </header>

      <nav className={styles.filterBar}>
        {allCategories.map((c) => (
          <button key={c} className={`${styles.filterBtn} ${active === c ? styles.active : ''}`} onClick={() => setActive(c)}>
            {c === 'All' ? t('all') : tCat(c) || c}
          </button>
        ))}
      </nav>

      <main className={styles.feedContainer}>
        {rows.map(([category, items]) => (
          <section key={category} className={styles.categoryRow}>
            <h2 className={styles.rowTitle}>{tCat(category) || category}</h2>
            <div className={styles.rowSlider}>
              {items.map((item) => (
                <Link key={item.id} href={`/item/${item.id}`} className={`${styles.card} ${styles[item.cardType]}`}>
                  <div className={styles.cardOverlay} style={{ background: item.colorGradient }} />
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
