/* File: app/layout.tsx */
import './globals.css';           // הקובץ הגלובלי הקיים שלך
import './design-tokens.css';     // הקובץ החדש עם :root

export const metadata = {
  title: 'App',
  description: 'Next.js App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
