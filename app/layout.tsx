import './globals.css'; // This line is crucial! It loads the global styles.
import Header from './(ui)/Header';
import AppFooter from './(ui)/AppFooter';

export const metadata = {
  title: 'Write AI',
  description: 'The viral, multilingual text platform.',
};

// This script prevents theme flashing on page load
const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('wa_theme') || 'auto';
    if (theme === 'auto') {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Header />
        <main className="app-main-content">
          {children}
        </main>
        <AppFooter />
      </body>
    </html>
  );
}

