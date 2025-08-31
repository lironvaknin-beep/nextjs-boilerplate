'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';

/**
 * i18n — מילון טקסטים ללוקאלים נתמכים.
 * ניתן להרחיב/לעדכן בקלות.
 */
const DICT = {
  en: {
    title: 'What would you like to create?',
    subtitle: 'Write a few words about what you want — then continue to a smart, guided builder.',
    docType: 'Document type',
    promptLabel: 'A few words about what you want to create',
    promptPh: 'e.g., a short story about a kid who finds a robot on the beach…',
    clear: 'Clear',
    start: 'Start',
    preview: 'Preview',
    share: 'Share',
    previewTitle: 'Preview',
  },
  he: {
    title: 'מה תרצה/י ליצור?',
    subtitle: 'כתוב/כתבי כמה מילים על מה שרוצים — ואז ממשיכים לבילדר חכם ומודרך.',
    docType: 'סוג מסמך',
    promptLabel: 'כמה מילים על מה שבא לך ליצור',
    promptPh: 'לדוגמה: סיפור קצר על ילד שמוצא רובוט בחוף הים…',
    clear: 'נקה',
    start: 'התחל יצירה',
    preview: 'תצוגה מקדימה',
    share: 'שיתוף',
    previewTitle: 'תצוגה מקדימה',
  },
  ar: {
    title: 'ماذا تريد أن تُنشئ؟',
    subtitle: 'اكتب بعض الكلمات عمّا تريد، ثم تابع إلى مُنشئ ذكي وموجّه.',
    docType: 'نوع المستند',
    promptLabel: 'بضع كلمات عمّا تريد إنشاءه',
    promptPh: 'مثال: قصة قصيرة عن طفل يجد روبوتًا على الشاطئ…',
    clear: 'مسح',
    start: 'ابدأ',
    preview: 'معاينة',
    share: 'مشاركة',
    previewTitle: 'معاينة',
  },
  fr: {
    title: 'Que souhaitez-vous créer ?',
    subtitle: 'Écrivez quelques mots, puis passez à un builder intelligent et guidé.',
    docType: 'Type de document',
    promptLabel: 'Quelques mots sur ce que vous voulez créer',
    promptPh: 'ex. : une courte histoire sur un enfant qui trouve un robot sur la plage…',
    clear: 'Effacer',
    start: 'Commencer',
    preview: 'Aperçu',
    share: 'Partager',
    previewTitle: 'Aperçu',
  },
  es: {
    title: '¿Qué te gustaría crear?',
    subtitle: 'Escribe unas palabras y avanza a un generador inteligente y guiado.',
    docType: 'Tipo de documento',
    promptLabel: 'Unas palabras sobre lo que quieres crear',
    promptPh: 'p. ej., un cuento corto sobre un niño que encuentra un robot en la playa…',
    clear: 'Limpiar',
    start: 'Comenzar',
    preview: 'Vista previa',
    share: 'Compartir',
    previewTitle: 'Vista previa',
  },
  ru: {
    title: 'Что вы хотите создать?',
    subtitle: 'Напишите несколько слов, затем перейдите к умному пошаговому билдеру.',
    docType: 'Тип документа',
    promptLabel: 'Несколько слов о том, что вы хотите создать',
    promptPh: 'например: короткий рассказ о ребёнке, нашедшем робота на пляже…',
    clear: 'Очистить',
    start: 'Начать',
    preview: 'Предпросмотр',
    share: 'Поделиться',
    previewTitle: 'Предпросмотр',
  },
} as const;

type Lang = keyof typeof DICT;

/** החזרת השפה הפעילה מה־DOM/LocalStorage (ברירת מחדל: en) */
function getActiveLang(): Lang {
  if (typeof document !== 'undefined') {
    const fromHtml = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (fromHtml && (fromHtml in DICT)) return fromHtml as Lang;
  }
  if (typeof window !== 'undefined') {
    const fromLS = (localStorage.getItem('wa_lang') || '').toLowerCase();
    if (fromLS && (fromLS in DICT)) return fromLS as Lang;
  }
  return 'en';
}

/** מאזין לשינויים ב־<html lang=".."> דרך MutationObserver כדי לעדכן טקסטים מיד כשמשנים שפה */
function useHtmlLangObserver() {
  const [lang, setLang] = useState<Lang>(getActiveLang());
  const obsRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const el = document.documentElement;
    const handle = () => setLang(getActiveLang());

    // שינויים שמגיעים מפלגים אחרים (storage event)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'wa_lang') handle();
    };
    window.addEventListener('storage', onStorage);

    // מעקב אחרי שינוי ה־lang על ה־html
    obsRef.current = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'lang') {
          handle();
        }
      }
    });
    obsRef.current.observe(el, { attributes: true, attributeFilter: ['lang'] });

    return () => {
      window.removeEventListener('storage', onStorage);
      obsRef.current?.disconnect();
    };
  }, []);

  return lang;
}

/** רשימת סוגי המסמכים — לוקליזציה והפצה לקוד/ל־AI */
const DOC_TYPES = [
  { value: 'story',  label: { en: 'Story', he: 'סיפור', ar: 'قصة', fr: 'Histoire', es: 'Historia', ru: 'Рассказ' } },
  { value: 'recipe', label: { en: 'Recipe', he: 'מתכון', ar: 'وصفة', fr: 'Recette', es: 'Receta',  ru: 'Рецепт'  } },
  { value: 'news',   label: { en: 'News', he: 'חדשות', ar: 'أخبار', fr: 'Actualité', es: 'Noticias', ru: 'Новости' } },
  { value: 'song',   label: { en: 'Song', he: 'שיר', ar: 'أغنية', fr: 'Chanson', es: 'Canción', ru: 'Песня' } },
  { value: 'script', label: { en: 'Script', he: 'תסריט', ar: 'سينارיו', fr: 'Scénario', es: 'Guion', ru: 'Сценарий' } },
  { value: 'comic',  label: { en: 'Comic', he: 'קומיקס', ar: 'قصص مصوّرة', fr: 'BD', es: 'Cómic', ru: 'Комикс' } },
  { value: 'essay',  label: { en: 'Essay', he: 'מאמר', ar: 'مقال', fr: 'Essai', es: 'Ensayo', ru: 'Эссе' } },
] as const;

export default function BuilderPage() {
  const lang = useHtmlLangObserver();
  const t = useMemo(() => DICT[lang] ?? DICT.en, [lang]);

  const [started, setStarted] = useState(false);
  const [docType, setDocType] = useState<string>('story');
  const [prompt, setPrompt] = useState<string>('');

  // הזרקת CSS של הבילדר (public/builder/style.css) — פעם אחת פר session
  // שיטה יציבה ב-App Router ללא layout סגמנטלי.
  const ensureBuilderCss = () => {
    if (typeof document === 'undefined') return;
    if (!document.getElementById('builder-css')) {
      const l = document.createElement('link');
      l.id = 'builder-css';
      l.rel = 'stylesheet';
      l.href = '/builder/style.css';
      document.head.appendChild(l);
    }
  };
  useEffect(ensureBuilderCss, []);

  // בעת מעבר ל"יצירה" — מעבירים seed ל־window עבור ה־builder.js
  const onStart = () => {
    (window as any).__builderSeed = {
      docType,
      prompt,
      lang,
    };
    setStarted(true);
  };

  return (
    <div className="app">
      {/* הזרקת CSS גם אם הגעתי מתוך ניווט לקוח (בטוח) */}
      <Script id="builder-css" strategy="afterInteractive">{`
        (function(){
          if (!document.getElementById('builder-css')) {
            var l = document.createElement('link');
            l.id = 'builder-css';
            l.rel = 'stylesheet';
            l.href = '/builder/style.css';
            document.head.appendChild(l);
          }
        })();
      `}</Script>

      {!started ? (
        // ---------- מסך פתיחה ----------
        <section className="starter" aria-label="Builder Starter">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>

          <div className="row">
            <label>{t.docType}</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              aria-label={t.docType}
            >
              {DOC_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label[lang] ?? opt.label.en}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <label>{t.promptLabel}</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.promptPh}
              aria-label={t.promptLabel}
            />
          </div>

          <div className="actions">
            <button className="btn-ghost" onClick={() => setPrompt('')}>
              {t.clear}
            </button>
            <button
              className="btn-primary"
              onClick={onStart}
              disabled={!docType || !prompt.trim()}
            >
              {t.start}
            </button>
          </div>
        </section>
      ) : (
        // ---------- מצב יצירה: סליידר + מודאל ----------
        <>
          {/* seed לקוד ה-JS של ה-Builder (fallback, בנוסף ל־onStart) */}
          <Script id="builder-config">{`
            window.__builderSeed = window.__builderSeed || { 
              docType: ${JSON.stringify(docType)}, 
              prompt: ${JSON.stringify(prompt)}, 
              lang: ${JSON.stringify(lang)} 
            };
          `}</Script>

          {/* מכולת הכרטיסים — ה-builder.js מוסיף לתוכה section.slot */}
          <main id="scroller" className="scroller" aria-live="polite" />

          {/* כפתורי Preview/Share ייעודיים לבילדר (לא כפולים מחוץ לכרטיסים) */}
          <div style={{ position: 'fixed', bottom: 90, insetInlineEnd: 16, display: 'grid', gap: 8 }}>
            <button id="previewBtn" className="btn-primary">{t.preview}</button>
            <button id="shareBtn" className="btn-ghost">{t.share}</button>
          </div>

          {/* מודאל תצוגה מקדימה — IDS שחובה להתאים ל-builder.js */}
          <div id="previewModal" className="modal" role="dialog" aria-modal="true" aria-labelledby="previewTitle">
            <div className="modal-backdrop"></div>
            <div className="modal-panel">
              <div className="panel">
                <h2 id="previewTitle" className="modal-title">{t.previewTitle}</h2>
                <p id="previewSentence" className="preview-sentence">…</p>
                <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button id="closePreview" className="btn-ghost">
                    {/* נסגר ע״י builder.js דרך onclick */}
                    {/** אפשרות: לתרגם גם "סגור" אם תרצה להחליף כאן לכפתור מסוג אחר */}
                    {lang === 'he' ? 'סגור' : lang === 'ar' ? 'إغلاق' : lang === 'fr' ? 'Fermer' : lang === 'es' ? 'Cerrar' : lang === 'ru' ? 'Закрыть' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* טעינת לוגיקת ה-Builder אחרי תחילת העבודה */}
          <Script src="/builder/builder.js" strategy="afterInteractive" />
        </>
      )}
    </div>
  );
}
