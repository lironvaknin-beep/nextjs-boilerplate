'use client';

import { useState, useEffect, useMemo } from 'react';
import Script from 'next/script';
import styles from './builder.module.css';

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

const LANGUAGES = [
  { code: 'en', dir: 'ltr' }, { code: 'he', dir: 'rtl' }, { code: 'ar', dir: 'rtl' },
  { code: 'es', dir: 'ltr' }, { code: 'fr', dir: 'ltr' }, { code: 'de', dir: 'ltr' },
  { code: 'it', dir: 'ltr' }, { code: 'pt', dir: 'ltr' }, { code: 'ru', dir: 'ltr' },
  { code: 'pl', dir: 'ltr' }, { code: 'tr', dir: 'ltr' }, { code: 'nl', dir: 'ltr' },
  { code: 'sv', dir: 'ltr' }, { code: 'zh', dir: 'ltr' }, { code: 'ja', dir: 'ltr' },
  { code: 'ko', dir: 'ltr' }, { code: 'hi', dir: 'ltr' }, { code: 'id', dir: 'ltr' },
  { code: 'vi', dir: 'ltr' },
];

const DICT = {
    en: { title:'What would you like to create?', docType:'Document type', promptPh:'e.g., a short story about a kid who finds a robot on the beach…', clear:'Clear', start:'Start Building', preview:'Preview', share:'Share', save: 'Save', previewTitle:'Preview', contentSaved: 'Content saved!', contentCopied: 'Content copied!' },
    he: { title:'מה תרצו ליצור?', docType:'סוג המסמך', promptPh:'לדוגמה: סיפור קצר על ילד שמוצא רובוט בחוף הים…', clear:'ניקוי', start:'להתחיל ליצור', preview:'תצוגה מקדימה', share:'שיתוף', save: 'שמירה', previewTitle:'תצוגה מקדימה', contentSaved: 'התוכן נשמר!', contentCopied: 'התוכן הועתק!' },
    ar: { title: 'ماذا تود أن تنشئ؟', docType: 'نوع المستند', promptPh: 'على سبيل المثال: قصة قصيرة عن طفل يجد روبوتًا على الشاطئ...', clear: 'مسح', start: 'ابدأ الإنشاء', preview: 'معاينة', share: 'مشاركة', save: 'حفظ', previewTitle: 'معاينة', contentSaved: 'تم حفظ المحتوى!', contentCopied: 'تم نسخ المحتوى!' },
    // Other languages can be added here
};

type LangCode = keyof typeof DICT;

const DOC_TYPES = [
    { value: 'story', label: { en: 'Story', he: 'סיפור', ar: 'قصة' } },
    { value: 'article', label: { en: 'Article', he: 'מאמר', ar: 'مقالة' } },
    { value: 'school', label: { en: 'School Work', he: 'עבודה לבית הספר', ar: 'عمل مدرسي' } },
    { value: 'work', label: { en: 'Work Document', he: 'מסמך עבודה', ar: 'مستند عمل' } },
    { value: 'recipe', label: { en: 'Recipe', he: 'מתכון', ar: 'وصفة' } },
    { value: 'song', label: { en: 'Song', he: 'שיר', ar: 'أغنية' } },
];


export default function BuilderPage() {
  const [lang, setLang] = useState<LangCode>('en');
  const [isStarted, setIsStarted] = useState(false);
  const [docType, setDocType] = useState('story');
  const [prompt, setPrompt] = useState('');
  const [composedText, setComposedText] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const currentLang = (getCookie('user-lang') || 'en') as LangCode;
    if (currentLang in DICT) {
      setLang(currentLang);
    }
  }, []);

  const t = useMemo(() => DICT[lang] || DICT.en, [lang]);
  const dir = useMemo(() => LANGUAGES.find(l => l.code === lang)?.dir || 'ltr', [lang]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleStart = () => {
    if (prompt.trim()) {
      (window as any).__builderSeed = { docType, prompt, lang, setComposedText };
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
      showToast(t.contentCopied);
    }
  };

  const handleSave = () => {
    const textToSave = composedText || buildSentenceFromDom();
    console.log("Saving content:", textToSave);
    showToast(t.contentSaved);
  };

  const closeLabel = useMemo(() => (lang === 'he' ? 'סגור' : lang === 'ar' ? 'إغلاق' : 'Close'), [lang]);

  return (
    <div className={styles.builderPageContainer} dir={dir}>
      {!isStarted ? (
        <section className={styles.starterPanel} aria-label="Builder Starter">
          <h1 className={styles.starterTitle}>{t.title}</h1>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="doc-type-select">{t.docType}</label>
            <select id="doc-type-select" className={styles.formSelect} value={docType} onChange={(e) => setDocType(e.target.value)} dir={dir}>
              {DOC_TYPES.map(opt => (<option key={opt.value} value={opt.value}>{opt.label[lang as keyof typeof opt.label] ?? opt.label.en}</option>))}
            </select>
          </div>
          <div className={`${styles.formGroup} ${styles.isGrowing}`}>
            <textarea id="prompt-textarea" className={styles.formTextarea} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t.promptPh}/>
          </div>
          <div className={styles.starterActions}>
            <button className={styles.btnPrimary} onClick={handleStart} disabled={!prompt.trim()}>{t.start}</button>
            <button className={styles.btnSecondary} onClick={() => setPrompt('')}>{t.clear}</button>
          </div>
        </section>
      ) : (
        <>
          <main id="scroller" className={styles.scroller} aria-live="polite" />
          <div className={styles.floatingActions}>
            <button id="previewBtn" className={styles.btnPrimary}>{t.preview}</button>
            <button id="shareBtn" onClick={handleShare} className={styles.btnSecondary}>{t.share}</button>
            <button id="saveBtn" onClick={handleSave} className={styles.btnSecondary}>{t.save}</button>
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
       {toastMessage && (<div className={styles.toast}>{toastMessage}</div>)}
    </div>
  );
}

