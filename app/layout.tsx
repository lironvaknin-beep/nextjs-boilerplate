import './globals.css';
import Header from './(ui)/Header';
import AppFooter from './(ui)/AppFooter';

export const metadata = {
  title: 'Write AI',
  description: 'Text-first creative platform',
};

// This script runs before React hydration to prevent theme/language flickering.
const initScript = `
(function(){
  try {
    var theme = localStorage.getItem('wa_theme') || 'auto';
    var lang  = localStorage.getItem('wa_lang')  || 'en';
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved = (theme === 'dark') ? 'dark' : (theme === 'light' ? 'light' : (prefersDark ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', resolved);
    var rtl = (lang === 'he' || lang === 'ar');
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* The init script must be in the head to run before the body renders */}
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
        
        {/* This is the most stable way to load the builder's specific CSS */}
        <link rel="stylesheet" href="/builder/style.css?v=1" />
      </head>
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 120px)' }}>{children}</main>
        <AppFooter />
      </body>
    </html>
  );
}

