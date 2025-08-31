'use client';
import { useState } from 'react';
import Script from 'next/script';

export default function BuilderPage() {
  const [started, setStarted] = useState(false);
  const [docType, setDocType] = useState('story');
  const [prompt, setPrompt]   = useState('');

  return (
    <div className="app">
      {!started ? (
        <section className="starter" aria-label="מסך פתיחה ליצירה">
          <h1>מה תרצה/י ליצור?</h1>
          <p>כתוב/כתבי כמה מילים על מה שרוצים — ואז ממשיכים לסליידר חכם.</p>

          <div className="row">
            <label>סוג מסמך</label>
            <select value={docType} onChange={e=>setDocType(e.target.value)}>
              <option value="story">סיפור</option>
              <option value="recipe">מתכון</option>
              <option value="news">חדשות</option>
              <option value="song">שיר</option>
              <option value="script">תסריט</option>
              <option value="comic">קומיקס</option>
              <option value="essay">מאמר</option>
            </select>
          </div>

          <div className="row">
            <label>כמה מילים על מה שבא לך ליצור</label>
            <textarea rows={4} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="לדוגמה: סיפור קצר על ילד שמוצא רובוט בחוף הים..." />
          </div>

          <div className="actions">
            <button className="btn-ghost" onClick={()=>{ setPrompt(''); }}>נקה</button>
            <button className="btn-primary" onClick={()=>setStarted(true)} disabled={!docType || !prompt.trim()}>
              התחל יצירה
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* מעביר seed ל-JS (בעתיד ישמש ל-AI) */}
          <Script id="builder-config">{`
            window.__builderSeed = { docType: ${JSON.stringify(docType)}, prompt: ${JSON.stringify(prompt)} };
          `}</Script>

          {/* מכולת הכרטיסים (ה-JS שלך מוסיף לתוכה section.slot) */}
          <main id="scroller" className="scroller" aria-live="polite" />

          {/* כפתורי Preview/Share של הבילדר */}
          <div style={{position:'fixed', bottom:90, insetInlineEnd:16, display:'grid', gap:8}}>
            <button id="previewBtn" className="btn-primary">Preview</button>
            <button id="shareBtn"   className="btn-ghost">Share</button>
          </div>

          {/* מודאל תצוגה מקדימה — IDs לפי builder.js */}
          <div id="previewModal" className="modal" role="dialog" aria-modal="true" aria-labelledby="previewTitle">
            <div className="modal-backdrop"></div>
            <div className="modal-panel">
              <div className="panel">
                <h2 id="previewTitle" className="modal-title">תצוגה מקדימה</h2>
                <p id="previewSentence" className="preview-sentence">…</p>
                <div className="modal-actions" style={{display:'flex', justifyContent:'flex-end', gap:8}}>
                  <button id="closePreview" className="btn-ghost">סגור</button>
                </div>
              </div>
            </div>
          </div>
<Script id="builder-css">{`
  (function(){
    if (!document.getElementById('builder-css')) {
      var l = document.createElement('link');
      l.id = 'builder-css';
      l.rel = 'stylesheet';
      l.href = '/builder/style.css'; // נשען על הקובץ שב-public
      document.head.appendChild(l);
    }
  })();
`}</Script>

          {/* טעינת לוגיקת הבילדר אחרי התחלה */}
          <Script src="/builder/builder.js" strategy="afterInteractive" />
        </>
      )}
    </div>
  );
}
