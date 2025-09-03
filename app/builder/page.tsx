'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import Head from 'next/head';

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
    <>
      <Head>
        <link rel="stylesheet" href="/builder/style.css" />
      </Head>

      <div className="builder-page-container">
        {!isStarted ? (
          <section className="starter-panel" aria-label="Builder Starter">
            <h1 className="starter-title">{t.title}</h1>
            <p className="starter-subtitle">{t.subtitle}</p>

            <div className="form-group">
              <label className="form-label" htmlFor="doc-type-select">{t.docType}</label>
              <select
                id="doc-type-select"
                className="form-select"
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

            <div className="form-group">
              <label className="form-label" htmlFor="prompt-textarea">{t.promptLabel}</label>
              <textarea
                id="prompt-textarea"
                className="form-textarea"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.promptPh}
              />
            </div>

            <div className="starter-actions">
              <button className="btn-secondary" onClick={() => setPrompt('')}>
                {t.clear}
              </button>
              <button
                className="btn-primary"
                onClick={handleStart}
                disabled={!prompt.trim()}
              >
                {t.start}
              </button>
            </div>
          </section>
        ) : (
          <>
            <main id="scroller" className="scroller" aria-live="polite" />

            <div className="floating-actions">
              <button id="previewBtn" className="btn-primary">{t.preview}</button>
              <button id="shareBtn" className="btn-secondary">{t.share}</button>
            </div>

            <div id="previewModal" className="modal" role="dialog" aria-modal="true" aria-labelledby="previewTitle">
              <div className="modal-backdrop"></div>
              <div className="modal-panel">
                <h2 id="previewTitle" className="modal-title">{t.previewTitle}</h2>
                <p id="previewSentence" className="preview-content">…</p>
                <div className="modal-actions">
                  <button id="closePreview" className="btn-secondary">{closeLabel}</button>
                </div>
              </div>
            </div>

            <Script src="/builder/builder.js" strategy="afterInteractive" />
          </>
        )}
      </div>
    </>
  );
}

