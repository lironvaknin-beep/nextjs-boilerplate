'use client';
import { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import styles from './builder.module.css';

// --- Helper functions for cookies ---
function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  if (typeof document !== 'undefined') {
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
}

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

const DICT = {
  en: { title:'What would you like to create?', docType:'Document type', promptPh:'e.g., a short story about a kid who finds a robot on the beach…', clear:'Clear', start:'Start Building', preview:'Preview', share:'Share', save: 'Save', previewTitle:'Preview', contentSaved: 'Content saved!', contentCopied: 'Content copied to clipboard!' },
  he: { title:'מה תרצה/י ליצור?', docType:'סוג המסמך', promptPh:'לדוגמה: סיפור קצר על ילד שמוצא רובוט בחוף הים…', clear:'ניקוי', start:'להתחיל ליצור', preview:'תצוגה מקדימה', share:'שיתוף', save: 'שמירה', previewTitle:'תצוגה מקדימה', contentSaved: 'התוכן נשמר!', contentCopied: 'התוכן הועתק!' },
  es: { title: '¿Qué te gustaría crear?', docType: 'Tipo de documento', promptPh: 'p. ej., un cuento corto sobre un niño que encuentra un robot en la playa...', clear: 'Limpiar', start: 'Comenzar a construir', preview: 'Vista previa', share: 'Compartir', save: 'Guardar', previewTitle: 'Vista previa', contentSaved: '¡Contenido guardado!', contentCopied: '¡Contenido copiado al portapapeles!' },
  fr: { title: 'Que souhaitez-vous créer ?', docType: 'Type de document', promptPh: 'p. ex., une nouvelle sur un enfant qui trouve un robot sur la plage...', clear: 'Effacer', start: 'Commencer à créer', preview: 'Aperçu', share: 'Partager', save: 'Sauvegarder', previewTitle: 'Aperçu', contentSaved: 'Contenu sauvegardé !', contentCopied: 'Contenu copié dans le presse-papiers !' },
  zh: { title: '您想创建什么？', docType: '文档类型', promptPh: '例如，一个关于孩子在沙滩上发现机器人的短篇故事…', clear: '清除', start: '开始创作', preview: '预览', share: '分享', save: '保存', previewTitle: '预览', contentSaved: '内容已保存！', contentCopied: '内容已复制到剪贴板！' },
  hi: { title: 'आप क्या बनाना चाहेंगे?', docType: 'दस्तावेज़ का प्रकार', promptPh: 'जैसे, एक बच्चे के बारे में एक छोटी कहानी जिसे समुद्र तट पर एक रोबोट मिलता है...', clear: 'साफ़ करें', start: 'बनाना शुरू करें', preview: 'पूर्वावलोकन', share: 'साझा करें', save: 'सहेजें', previewTitle: 'पूर्वावलोकन', contentSaved: 'सामग्री सहेजी गई!', contentCopied: 'सामग्री क्लिपबोर्ड पर कॉपी की गई!' },
} as const;

type Lang = keyof typeof DICT;

// This hook now manages language and theme from cookies
function useUserPreferences() {
  const [lang, setLang] = useState<Lang>('en');
  
  useEffect(() => {
    // Set initial language from cookie or browser settings
    const cookieLang = getCookie('user-lang');
    if (cookieLang && cookieLang in DICT) {
      setLang(cookieLang as Lang);
      document.documentElement.lang = cookieLang;
    } else if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang in DICT) setLang(browserLang as Lang);
    }

    // Set initial theme from cookie or system preference
    const cookieTheme = getCookie('user-theme');
    if (cookieTheme) {
      document.documentElement.setAttribute('data-theme', cookieTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Effect to watch for external language changes (e.g., from header)
  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      const newLang = el.getAttribute('lang') as Lang;
      if (newLang && newLang in DICT && newLang !== lang) {
        setCookie('user-lang', newLang, 365);
        setLang(newLang);
      }
    });
    observer.observe(el, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, [lang]);

  return lang;
}

const DOC_TYPES = [
  { value: 'story',  label: { en: 'Story', he: 'סיפור', es: 'Historia', fr: 'Histoire', zh: '故事', hi: 'कहानी' } },
  { value: 'recipe', label: { en: 'Recipe', he: 'מתכון', es: 'Receta', fr: 'Recette', zh: '食谱', hi: 'नुस्खा' } },
  { value: 'news',   label: { en: 'News', he: 'חדשות', es: 'Noticias', fr: 'Actualités', zh: '新闻', hi: 'समाचार' } },
  { value: 'song',   label: { en: 'Song', he: 'שיר', es: 'Canción', fr: 'Chanson', zh: '歌曲', hi: 'गीत' } },
  { value: 'script', label: { en: 'Script', he: 'תסריט', es: 'Guion', fr: 'Scénario', zh: '脚本', hi: 'पटकथा' } },
] as const;

export default function BuilderPage() {
  const lang = useUserPreferences();
  const t = useMemo(() => DICT[lang] ?? DICT.en, [lang]);

  const [isStarted, setIsStarted] = useState(false);
  const [docType, setDocType] = useState('story');
  const [prompt, setPrompt] = useState('');
  const [composedText, setComposedText] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleStart = () => {
    if (prompt.trim()) {
      (window as any).__builderSeed = { docType, prompt, lang, setComposedText };
      setIsStarted(true);
    }
  };

  const handleShare = async () => {
    const textToShare = composedText || buildSentenceFromDom();
    if (navigator.share && textToShare) {
      try {
        await navigator.share({
          title: 'My Creation',
          text: textToShare,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
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

  const buildSentenceFromDom = (): string => {
    const words = Array.from(document.querySelectorAll('#scroller .word'));
    return words.map(w => (w as HTMLElement).innerText).join(' ');
  }
  
  const closeLabel = useMemo(() => (lang ==='he' ? 'סגור' : 'Close'), [lang]);

  return (
    <div className={styles.builderPageContainer}>
      {!isStarted ? (
        <section className={styles.starterPanel} aria-label="Builder Starter">
          <h1 className={styles.starterTitle}>{t.title}</h1>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="doc-type-select">{t.docType}</label>
            <select id="doc-type-select" className={styles.formSelect} value={docType} onChange={(e) => setDocType(e.target.value)}>
              {DOC_TYPES.map(opt => (<option key={opt.value} value={opt.value}>{opt.label[lang] ?? opt.label.en}</option>))}
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
          <div id="previewModal" className={`${styles.modal} ${composedText ? 'isOpen' : ''}`} role="dialog" aria-modal="true" aria-labelledby="previewTitle">
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
       {toastMessage && (
        <div className={styles.toast}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

