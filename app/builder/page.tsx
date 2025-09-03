'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import styles from './builder.module.css'; // Make sure this import is correct

const DICT = {
  en: { title:'What would you like to create?', subtitle:'Start with a few words, then continue to a smart, guided builder.', docType:'Document type', promptLabel:'Describe what you want to create', promptPh:'e.g., a short story about a kid who finds a robot on the beach…', clear:'Clear', start:'Start Building', preview:'Preview', share:'Share', previewTitle:'Preview' },
  he: { title:'מה תרצה/י ליצור?', subtitle:'מתחילים עם כמה מילים, וממשיכים לבילדר חכם ומודרך.', docType:'סוג המסמך', promptLabel:'תאר/י בכמה מילים מה ליצור', promptPh:'לדוגמה: סיפור קצר על ילד שמוצא רובוט בחוף הים…', clear:'ניקוי', start:'להתחיל ליצור', preview:'תצוגה מקדימה', share:'שיתוף', previewTitle:'תצוגה מקדימה' },
  // Add other languages here if needed
} as const;

type Lang = keyof typeof DICT;

function getActiveLang(): Lang {
  if (typeof document !== 'undefined') {
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang in DICT) return htmlLang as Lang;
  }
  return 'en';
}

function useHtmlLangObserver() {
  const [lang, setLang] = useState<Lang>(getActiveLang());
  
  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setLang(getActiveLang());
    });
    observer.observe(el, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  return lang;
}

const DOC_TYPES = [
  { value: 'story',  label: { en: 'Story', he: 'סיפור' } },
  { value: 'recipe', label: { en: 'Recipe', he: 'מתכון' } },
  { value: 'news',   label: { en: 'News', he: 'חדשות' } },
  { value: 'song',   label: { en: 'Song', he: 'שיר' } },
  { value: 'script', label: { en: 'Script', he: 'תסריט' } },
] as const;

export default function BuilderPage() {
  const lang = useHtmlLangObserver();
  const t = useMemo(() => DICT[lang] ?? DICT.en, [lang]);

  const [isStarted, setIsStarted] = useState(false);
  const [docType, setDocType] = useState('story');
  const [prompt, setPrompt] = useState('');

  const handleStart = () => {
    if (prompt.trim()) {
      (window as any).__builderSeed = { docType, prompt, lang };
      setIsStarted(true);
    }
  };
  
  const closeLabel = useMemo(() => (lang ==='he' ? 'סגור' : 'Close'), [lang]);

  return (
    <div className={styles.builderPageContainer}>
      {!isStarted ? (
        <section className={styles.starterPanel} aria-label="Builder Starter">
          <h1 className={styles.starterTitle}>{t.title}</h1>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="doc-type-select">{t.docType}</label>
            <select
              id="doc-type-select"
              className={styles.formSelect}
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              {DOC_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label[lang] ?? opt.label.en}
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.isGrowing}`}>
            <textarea
              id="prompt-textarea"
              className={styles.formTextarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.promptPh}
            />
          </div>

          <div className={styles.starterActions}>
             <button
              className={styles.btnPrimary}
              onClick={handleStart}
              disabled={!prompt.trim()}
            >
              {t.start}
            </button>
            <button className={styles.btnSecondary} onClick={() => setPrompt('')}>
              {t.clear}
            </button>
          </div>
        </section>
      ) : (
        <>
          <main id="scroller" className={styles.scroller} aria-live="polite" />

          <div className={styles.floatingActions}>
            <button id="previewBtn" className={styles.btnPrimary}>{t.preview}</button>
            <button id="shareBtn" className={styles.btnSecondary}>{t.share}</button>
          </div>

          <div id="previewModal" className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="previewTitle">
            <div className={styles.modalBackdrop}></div>
            <div className={styles.modalPanel}>
              <h2 id="previewTitle" className={styles.modalTitle}>{t.previewTitle}</h2>
              <p id="previewSentence" className={styles.previewContent}>…</p>
              <div className={styles.modalActions}>
                <button id="closePreview" className={styles.btnSecondary}>{closeLabel}</button>
              </div>
            </div>
          </div>

          <Script src="/builder/builder.js" strategy="afterInteractive" />
        </>
      )}
    </div>
  );
}

