'use client';

import Script from 'next/script';

export default function BuilderPage() {
  return (
    <div className="app" dir="rtl">
      {/* Header תואם-מחלקות (classes) */}
      <header className="header">
        <div className="brand">
          <span className="logo">write</span>
          <button className="burger" aria-label="תפריט">☰</button>
        </div>
      </header>

      {/* המכולה היחידה שה-JS מוסיף אליה כרטיסים */}
      <main id="scroller" className="scroller" aria-live="polite" />

      {/* כפתורי פעולה כלליים בתחתית */}
      <footer className="footer">
        <div className="footer-actions">
          {/* פעולות הכרטיס (אם ה-CSS שלך מתייחס להן, השארנו ids לשימוש עתידי) */}
          <div className="card-actions">
            <button id="likeBtn" className="actionBtn like" aria-label="בחר">✓</button>
            <button id="editBtn" className="actionBtn edit" aria-label="ערוך">✎</button>
            <button id="dislikeBtn" className="actionBtn dislike" aria-label="דלג">✕</button>
            <button id="undoBtn" className="actionBtn undo" aria-label="בטל">↺</button>
          </div>

          {/* Preview / Share שה-builder.js משתמש בהם */}
          <div className="global-actions">
            <button id="previewBtn" className="btn preview">Preview</button>
            <button id="shareBtn" className="btn share">Share</button>
          </div>
        </div>
      </footer>

      {/* מודאל תצוגה מקדימה — שמות ids חייבים להתאים ל-builder.js */}
      <div id="previewModal" className="modal" role="dialog" aria-modal="true" aria-labelledby="previewTitle">
        <div className="modal-backdrop"></div>
        <div className="modal-panel">
          <h2 id="previewTitle" className="modal-title">תצוגה מקדימה</h2>
          <p id="previewSentence" className="preview-sentence">…</p>
          <div className="modal-actions">
            <button id="closePreview" className="btn ghost">סגור</button>
          </div>
        </div>
      </div>

      {/* Overlay עורך טקסט (לפי ה-CSS שלך, אפשר להשאיר לעתיד) */}
      <div id="editorOverlay" className="modal" role="dialog" aria-modal="true" aria-labelledby="editorTitle">
        <div className="modal-backdrop"></div>
        <div className="modal-panel">
          <h2 id="editorTitle" className="modal-title">עריכת טקסט</h2>
          <textarea id="editorTextarea" rows={5} className="editor-textarea" placeholder="כתוב כאן..."></textarea>
          <div className="modal-actions">
            <button id="editorCancelBtn" className="btn ghost">ביטול</button>
            <button id="editorUpdateBtn" className="btn primary">עדכן</button>
          </div>
        </div>
      </div>

      {/* טעינת הלוגיקה של הבילדר אחרי אינטראקציה */}
      <Script src="/builder/builder.js" strategy="afterInteractive" />
    </div>
  );
}
