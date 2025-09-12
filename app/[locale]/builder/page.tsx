'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useTranslations, useLocale } from 'next-intl';
import styles from '../../builder/builder.module.css';

export default function BuilderPage() {
  const t = useTranslations('BuilderPage');
  const locale = useLocale();

  useEffect(()=> {
    document.documentElement.lang = String(locale);
  }, [locale]);

  return (
    <div className={styles.builderPage}>
      <h1 className={styles.title}>{t('title')}</h1>

      <div className={styles.controls}>
        <button id="previewBtn" type="button" className={styles.secondaryBtn}>{t('preview')}</button>
      </div>

      <div id="scroller" className={styles.scroller} aria-live="polite" />

      <div id="previewModal" className={styles.previewModal}>
        <div className={styles.previewCard}>
          <h2 className={styles.previewTitle}>{t('previewTitle')}</h2>
          <p id="previewSentence" className={styles.previewContent}> </p>
          <div className={styles.previewActions}>
            <button id="closePreview" className={styles.secondaryBtn}>{t('close')}</button>
            <button id="saveBtn" className={styles.primaryBtn}>{t('save')}</button>
          </div>
        </div>
      </div>

      <Script src="/builder/builder.js" strategy="afterInteractive" />
    </div>
  );
}
