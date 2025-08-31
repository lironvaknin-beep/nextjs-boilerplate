'use client';

import Script from 'next/script';

export default function BuilderPage() {
  return (
    <main id="scroller" dir="rtl" style={{minHeight: '100vh', background:'#fff'}}>
      {/* Header */}
      <header style={{position:'sticky', top:0, background:'#fff', borderBottom:'1px solid #eee', zIndex:50}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px'}}>
          <div style={{fontWeight:700}}>write</div>
          <nav>
            <button aria-label="תפריט" title="תפריט">☰</button>
          </nav>
        </div>
      </header>

      {/* Cards root - כאן ה-JS יוצר את הכרטיסים */}
      <section id="cards-root" style={{padding:'16px'}}>
        <div id="cards-container">
          {/* ה-JS שלך אמור להזריק לפה כרטיסים/תוכן */}
        </div>
      </section>

      {/* Footer עם הכפתורים ש-builder.js משתמש בהם */}
      <footer style={{position:'sticky', bottom:0, background:'#fff', borderTop:'1px solid #eee'}}>
        <div style={{display:'flex', gap:12, justifyContent:'flex-end', padding:'12px 16px'}}>
          <button id="previewBtn" aria-label="תצוגה מקדימה">Preview</button>
          <button id="shareBtn" aria-label="שיתוף">Share</button>
        </div>
      </footer>

      {/* Preview Modal - חלון מלא לתצוגה מקדימה (ה-JS יפתח/יסגור) */}
      <div id="previewModal" role="dialog" aria-modal="true" aria-labelledby="previewTitle" style={{display:'none'}}>
        <div className="preview-backdrop" />
        <div className="preview-panel">
          <h2 id="previewTitle">תצוגה מקדימה</h2>
          <div id="previewContent"></div>
          <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>
            <button id="previewCloseBtn">סגור</button>
            <button id="previewSaveBtn">שמור</button>
          </div>
        </div>
      </div>

      {/* Overlay של עורך טקסט (Edit) */}
      <div id="editorOverlay" role="dialog" aria-modal="true" aria-labelledby="editorTitle" style={{display:'none'}}>
        <div className="editor-backdrop" />
        <div className="editor-panel">
          <h2 id="editorTitle">עריכת טקסט</h2>
          <textarea id="editorTextarea" rows={5} placeholder="כתוב כאן..." />
          <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>
            <button id="editorCancelBtn">ביטול</button>
            <button id="editorUpdateBtn">עדכן</button>
          </div>
        </div>
      </div>

      {/* טעינת ה-CSS של ה-Builder (הוגדר כבר ב-head.tsx). */}

      {/* טעינת ה-JS של ה-Builder רק לאחר שהדף נטען */}
      <Script src="/builder/builder.js" strategy="afterInteractive" />
    </main>
  );
}
