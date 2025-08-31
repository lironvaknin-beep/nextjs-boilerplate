'use client';
import { useState } from 'react';
import Script from 'next/script';

export default function BuilderPage() {
  const [started, setStarted] = useState(false);
  const [docType, setDocType] = useState('story'); // story|recipe|news|song|script|comic|essay...
  const [prompt, setPrompt]   = useState('');

  return (
    <div className="app" dir="rtl">
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
            <textarea rows={4} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="לדוגמה: סיפור קצר על ילד שמוצא רובוט בחוף הים..."></textarea>
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
          {/* אפשר להעביר קונפיג לסקריפט: */}
          <Script id="builder-config">{`
            window.__builderSeed = { docType: ${JSON.stringify(docType)}, prompt: ${JSON.stringify(prompt)} };
          `}</Script>

          {/* כאן ה-JS יוסיף את ה-slots (אין כפילות כפתורים יותר) */}
          <main id="scroller" className="scroller" aria-live="polite" />

          {/* כפתורי Preview/Share (builder-ספציפיים) */}
          <div style={{position:'fixed', bottom:90, insetInlineEnd:16, display:'grid', gap:8}}>
            <button id="previewBtn" className="btn-primary">Preview</button>
            <button id="shareBtn"   className="btn-ghost">Share</button>
          </div>

          {/* מודאל תצוגה מקדימה שה-builder.js מצפה לו */}
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

          {/* נטען את לוגיקת ה-Builder רק אחרי Start */}
          <Script src="/builder/builder.js" strategy="afterInteractive" />
        </>
      )}
    </div>
  );
}
