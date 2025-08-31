import './globals.css';
import Header from './(ui)/Header';
import AppFooter from './(ui)/AppFooter';

export const metadata = { title: 'Write AI', description: 'Text-first creative platform' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <Header />
        <div style={{minHeight:'calc(100vh - 120px)'}}>{children}</div>
        <AppFooter />
      </body>
    </html>
  );
}
