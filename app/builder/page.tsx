'use client';

import Script from 'next/script';

export default function BuilderPage() {
  return (
    <div dir="rtl" style={{minHeight: '100vh', background:'#fff', display:'flex', flexDirection:'column'}}>
      {/* Header (מחוץ ל-scroller) */}
      <header style={{position:'sticky', top:0, background:'#fff', borderBottom:'1px solid #eee', zIndex:50}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px'}}>
          <div style={{fontWeight:700}}>write</div>
          <nav>
            <button aria-label="תפריט" title="תפריט">☰</button>
          </nav>
        </div>
      </header>

      {/* כאן הסקריפט מצפה להזריק כרטיסים: SCROLLER הוא המכולה היחידה */}
      <section id="scroller" style={{flex:1, overflowY:'auto', padding:'16px'}}>
        {/* אל תמקם כאן אלמנטים נוספים קבועים — הסקריפט יוסיף section.slot */}
      </section>

      {/* Footer (גם מחוץ ל-scroller) */}
      <footer style={{position:'sticky', bottom:0, background:'#fff', borderTop:'1px solid #eee'}}>
        <div style={{display:'flex', gap:12, justifyContent:'space-between', padding:'12px 16px'}}>
          {/* פעולות כרטיס — ה-JS שלך לא חייב אותם כ-IDs, אבל אם בעתיד ידרוש, כבר מוכנים */}
          <div style={{display:'flex', gap:8}}>
            <button id="likeBtn" aria-label="בחר">👍</button>
            <button id="dislikeBtn" aria-label="דלג">👎</button>
            <button id="editBtn" aria-label="ערוך">✏️</button>
            <button id="undoBtn" aria-label="בטל">↩️</button>
          </div>
          {/* כפתורי Preview/Share שהסקריפט מצפה אליהם */}
          <div style={{display:'flex', gap:8}}>
            <button id="previewBtn" aria-label="תצוגה מקדימה">Preview</button>
            <button id="shareBtn" aria-label="שיתוף">Share</button>
          </div>
        </div>
      </footer>

      {/* Preview Modal — שמות ה-IDs MUST MATCH בדיוק למה שהסקריפט מחפש */}
      <div id="previewModal" style={{display:'none'}}>
        {/* אפשר לעצב עם CSS בקובץ style.css שלך (כיתה .open וכו') */}
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.4)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000
        }}>
          <div style={{background:'#fff', borderRadius:12, padding:20, maxWidth:600, width:'90%'}}>
            <h2 style={{marginTop:0}}>תצוגה מקדימה</h2>
            <p id="previewSentence" style={{minHeight:40, margin:'12px 0'}}>…</p>
            <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
              <button id="closePreview">סגור</button>
            </div>
          </div>
        </div>
      </div>

      {/* טוענים את סקריפט ה-Builder אחרי טעינת הדף */}
      <Script src="/builder/builder.js" strategy="afterInteractive" />
    </div>
  );
}
