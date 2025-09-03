import type { Metadata } from 'next';
import './(ui)/globals.css';
import Header from './(ui)/Header';
import AppFooter from './(ui)/AppFooter';

export const metadata: Metadata = {
  title: 'write - AI-Powered Creation',
  description: 'A smart, guided builder for creating stories, recipes, and more.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no', // Prevents zoom on mobile
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The client-side hook in Header.tsx will set the correct theme and lang on load.
    // We provide safe defaults here.
    <html lang="en" data-theme="light">
      <body>
        <Header />
        <main>{children}</main>
        <AppFooter />
      </body>
    </html>
  );
}

