'use client';

import { Link } from '../../../navigation';
import { useParams } from 'next/navigation';
import styles from './item.module.css';
import sampleData from '../../sample-data.json';

type Item = {
  id: string | number;
  title: string;
  snippet?: string;
  colorGradient?: string;
  cardType?: string;
  author?: string;
};

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const items = sampleData as unknown as Item[];
  const item = items.find(x => String(x.id) === String(id));

  if (!item) return <div className={styles.loading}>Item not found</div>;

  return (
    <div className={styles.itemPage}>
      <header className={styles.header}>
        <Link href="/">{'← Back'}</Link>
      </header>
      <article className={styles.card}>
        <div className={styles.cardOverlay} style={{ background: item.colorGradient || undefined }} />
        <h1 className={styles.title}>{item.title}</h1>
        {item.snippet && <p className={styles.snippet}>{item.snippet}</p>}
        {item.author && <p className={styles.author}>By {item.author}</p>}
      </article>
    </div>
  );
}
