'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import Head from 'next/head'; // << טוענים את ה-CSS דרך next/head

const DICT = {
  en: { title:'What would you like to create?', subtitle:'Write a few words...', docType:'Document type', promptLabel:'A few words about what you want to create', promptPh:'e.g., a short story...', clear:'Clear', start:'Start', preview:'Preview', share:'Share', previewTitle:'Preview' },
  he: { title:'מה תרצה/י ליצור?', subtitle:'כתוב/כתבי כמה מילים...', docType:'סוג מסמך', promptLabel:'כמה מילים על מה שבא לך ליצור', promptPh:'לדוגמה: סיפור קצר...', clear:'נקה', start:'התחל יצירה', preview:'תצוגה מקדימה', share:'שיתוף', previewTitle:'תצוגה מקדימה' },
  ar: { title:'ماذا تريد أن تُنشئ؟', subtitle:'اكتب بعض الكلمات...', docType:'نوع المستند', promptLabel:'بضع كلمات...', promptPh:'مثال: قصة قصيرة...', clear:'مسح', start:'ابدأ', preview:'معاينة', share:'مشاركة', previewTitle:'معاينة' },
  fr: { title:'Que souhaitez-vous créer ?', subtitle:'Écrivez quelques mots...', docType:'Type de document', promptLabel:'Quelques mots...', promptPh:'ex. : une courte histoire...', clear:'Effacer', start:'Commencer', preview:'Aperçu', share:'Partager', previewTitle:'Aperçu' },
  es: { title:'¿Qué te gustaría crear?', subtitle:'Escribe unas palabras...', docType:'Tipo de documento', promptLabel:'Unas palabras...', promptPh:'p. ej., un cuento corto...', clear:'Limpiar', start:'Comenzar', preview:'Vista previa', share:'Compartir', previewTitle:'Vista previa' },
  ru: { title:'Что вы хотите создать?', subtitle:'Напишите несколько слов...', docType:'Тип документа', promptLabel:'Несколько слов...', promptPh:'например: короткий рассказ...', clear:'Очистить', start:'Начать', preview:'Предпросмотр', share:'Поделиться', previewTitle:'Предпросмотр' },
} as const;
type Lang = keyof typeof DICT;

function getActiveLang(): Lang {
  if (typeof document !== 'undefined') {
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang in DICT) return htmlLang as Lang;
  }
  if (typeof window !== 'undefined') {
    const ls = (localStorage.getItem('wa_lang') || '').toLowerCase();
    if (ls in DICT) return ls as Lang;
  }
  return 'en';
}
function useHtmlLangObserver() {
  const [lang, setLang] = useState<Lang>(getActiveLang());
  const obsRef = useRef<MutationObserver | null>(null);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setLang(getActiveLang());
    const onStorage = (e: StorageEvent) => { if (e.key === 'wa_lang') update(); };
    window.addEventListener('storage', onStorage);
    obsRef.current = new MutationObserver((muts) => {
      for (const m of muts) if (m.type === 'attributes' && m.attributeName === 'lang') update();
    });
    obsRef.current.observe(el, { attributes: true, attributeFilter: ['lang'] });
    return () => { window.removeEventListener('storage', onStorage); obsRef.current?.disconnect(); };
  }, []);
  return lang;
}

const DOC_TYPES = [
  { value:'story',  label:{ en:'Story',  he:'סיפור',   ar:'قصة', fr:'Histoire', es:'Historia', ru:'Рассказ' } },
  { value:'recipe', label:{ en:'Recipe', he:'מתכון',   ar:'وصفة', fr:'Recette', es:'Receta',   ru:'Рецепт'  } },
  { value:'news',   label:{ en:'News',   he:'חדשות',   ar:'أخبار', fr:'Actualité', es:'Noticias', ru:'Новости' } },
  { value:'song',   label:{ en:'Song',   he:'שיר',     ar:'أغنية', fr:'Chanson', es:'Canción', ru:'Песня' } },
  { value:'script', label:{ en:'Script', he:'תסריט',   ar:'سيناريو', fr:'Scénario', es:'Guion', ru:'Сценарий' } },
  { value:'comic',  label:{ en:'Comic',  he:'קומיקס',  ar:'قصص مصوّرة', fr:'BD', es:'Cómic', ru:'Комикс' } },
  { value:'essay',  label:{ en:'Essay',  he:'מאמר',    ar:'مقال', fr:'Essai', es:'Ensayo', ru:'Эссе' } },
] as const;

export default function BuilderPage() {
  const lang = useHtmlLangObserver();
  const t = useMemo(() => DICT[lang] ?? DICT.en, [lang]);

  const [started, setStarted] = useState(false);
  const [docType, setDocType] = useState('story');
  const [prompt, setPrompt] = useState('');

  const onStart = () => {
    (window as any).__builderSeed = { docType, prompt, lang };
    setStarted(true);
  };

  // כותרת "סגור" למודאל לפי שפה (קטן ונוח)
  const closeLabel = useMemo(() => (
    lang==='he' ? 'סגור' : lang==='ar' ? 'إغلاق' : lang==='fr' ? 'Fermer' : lang==='es' ? 'Cerrar' : lang==='ru' ? 'Закрыть' : 'Close'
  ), [lang]);

  return (
    <div className="app">
      {/* כאן ה-CSS נטען SSR וייראה גם ב-View Source */}
      <Head>
        <link id="builder-css" rel="stylesheet" href="/builder/style.css?v=3" />
      </Head>

      {!started ? (
        <section className="starter" aria-label="Builder Starter">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>

          <div className="row">
            <label>{t.docType}</label>
            <select value={docType} onChange={(e)=>setDocType(e.target.value)} aria-label={t.docType}>
              {DOC_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label[lang] ?? opt.label.en}</option>
              ))}
            </select>
          </div>

          <div className="row">
            <label>{t.promptLabel}</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e)=>setPrompt(e.target.value)}
              placeholder={t.promptPh}
              aria-label={t.promptLabel}
            />
          </div>

          <div className="actions">
            <button className="btn-ghost" onClick={()=>setPrompt('')}>{t.clear}</button>
            <button className="btn-primary" onClick={onStart} disabled={!docType || !prompt.trim()}>
              {t.start}
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* seed לגיבוי */}
          <Script id="builder-config">{`
            window.__builderSeed = window.__builderSeed || { 
              docType: ${JSON.stringify(docType)}, 
              prompt: ${JSON.stringify(prompt)}, 
              lang: ${JSON.stringify(lang)} 
            };
          `}</Script>

          <main id="scroller" className="scroller" aria-live="polite" />

          <div style={{ position:'fixed', bottom:90, insetInlineEnd:16, display:'grid', gap:8 }}>
            <button id="previewBtn" className="btn-primary">{t.preview}</button>
            <button id="shareBtn" className="btn-ghost">{t.share}</button>
          </div>

          <div id="previewModal" className="modal" role="dialog" aria-modal="true" aria-labelledby="previewTitle">
            <div className="modal-backdrop"></div>
            <div className="modal-panel">
              <div className="panel">
                <h2 id="previewTitle" className="modal-title">{t.previewTitle}</h2>
                <p id="previewSentence" className="preview-sentence">…</p>
                <div className="modal-actions" style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
                  <button id="closePreview" className="btn-ghost">{closeLabel}</button>
                </div>
              </div>
            </div>
          </div>

          <Script src="/builder/builder.js" strategy="afterInteractive" />
        </>
      )}
    </div>
  );
}
