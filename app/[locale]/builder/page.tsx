// File: app/[locale]/builder/page.tsx
// Location: /app/[locale]/builder/page.tsx
// This component is now fully refactored to use the central `next-intl` system.

'use client';

import { useState, useEffect, useMemo } from 'react';
import Script from 'next/script';
import styles from '../../builder/builder.module.css';
import { useTranslations, useLocale } from 'next-intl';

const DOC_TYPE_KEYS = ['story', 'article', 'blog', 'email', 'school', 'work', 'recipe', 'song', 'poem'];

export default function BuilderPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [docType, setDocType] = useState('story');
  const [prompt, setPrompt] = useState('');
  const [composedText, setComposedText] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  
  const t = useTranslations('BuilderPage');
  const locale = useLocale();

  const [dir, setDir] = useState('ltr');
  useEffect(() => {
    // Read direction from the DOM, which is set by PreferencesProvider/layout
    const currentDir = document.documentElement.dir || 'ltr';
    setDir(currentDir);
  }, []);


  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleStart = () => {
    if (prompt.trim()) {
      (window as any).__builderSeed = { docType, prompt, lang: locale, setComposedText };
      setIsStarted(true);
    }
  };
  
  const buildSentenceFromDom = (): string => {
    const words = Array.from(document.querySelectorAll('#scroller .word'));
    return words.map(w => (w as HTMLElement).innerText).join(' ');
  }

  const handleShare = async () => {
    const textToShare = composedText || buildSentenceFromDom();
    if (navigator.share && textToShare) {
      try {
        await navigator.share({ title: 'My Creation on TextSpot', text: textToShare });
      } catch (error) { console.error('Share failed:', error); }
    } else if (textToShare) {
      navigator.clipboard.writeText(textToShare);
      showToast(t('contentCopied'));
    }
  };

  const handleSave = () => {
    const textToSave = composedText || buildSentenceFromDom();
    console.log("Saving content:", textToSave);
    showToast(t('contentSaved'));
  };

  return (
    <div className={styles.builderPageContainer} dir={dir}>
      {!isStarted ? (
        <section className={styles.starterPanel} aria-label="Builder Starter">
          <h1 className={styles.starterTitle}>{t('title')}</h1>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="doc-type-select">{t('docType')}</label>
            <select id="doc-type-select" className={styles.formSelect} value={docType} onChange={(e) => setDocType(e.target.value)} dir={dir}>
              {DOC_TYPE_KEYS.map((key) => (
                <option key={key} value={key}>{t(`docTypes.${key}`)}</option>
              ))}
            </select>
          </div>
          <div className={`${styles.formGroup} ${styles.isGrowing}`}>
            <textarea id="prompt-textarea" className={styles.formTextarea} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t('promptPh')} dir={dir}/>
          </div>
          <div className={styles.starterActions}>
            <button className={styles.btnPrimary} onClick={handleStart} disabled={!prompt.trim()}>{t('start')}</button>
            <button className={styles.btnSecondary} onClick={() => setPrompt('')}>{t('clear')}</button>
          </div>
        </section>
      ) : (
        <>
          <main id="scroller" className={styles.scroller} aria-live="polite" />
          <div className={styles.floatingActions}>
            <button id="previewBtn" className={styles.btnPrimary}>{t('preview')}</button>
            <button id="shareBtn" onClick={handleShare} className={styles.btnSecondary}>{t('share')}</button>
            <button id="saveBtn" onClick={handleSave} className={styles.btnSecondary}>{t('save')}</button>
          </div>
          <div id="previewModal" className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="previewTitle">
            <div className={styles.modalBackdrop}></div>
            <div className={styles.modalPanel}>
              <h2 id="previewTitle" className={styles.modalTitle}>{t('previewTitle')}</h2>
              <p id="previewSentence" className={styles.previewContent}>…</p>
              <div className={styles.modalActions}>
                <button id="closePreview" className={styles.btnSecondary}>{t('close')}</button>
              </div>
            </div>
          </div>
          <Script src="/builder/builder.js" strategy="afterInteractive" />
        </>
      )}
       {toastMessage && (<div className={styles.toast}>{toastMessage}</div>)}
    </div>
  );
}
