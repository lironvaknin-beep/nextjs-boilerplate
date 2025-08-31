export default function AppFooter() {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-inner">
        <a href="/" className="nav-btn">בית</a>
        <a href="/builder" className="nav-btn active">יצירה</a>
        <a href="/explore" className="nav-btn">גילוי</a>
        <a href="/me/library" className="nav-btn">הספרייה</a>
      </div>
    </footer>
  );
}
