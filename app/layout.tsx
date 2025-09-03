import type { Metadata } from 'next';
import './(ui)/globals.css';
import Header from './(ui)/Header';
import AppFooter from './(ui)/AppFooter';

export const metadata: Metadata = {
  title: 'write - AI-Powered Creation',
  description: 'A smart, guided builder for creating stories, recipes, and more.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1', // Prevents zoom on mobile
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Default values; will be updated by client-side hooks
    <html lang="en" data-theme="light">
      <body>
        <Header />
        <main>{children}</main>
        <AppFooter />
      </body>
    </html>
  );
}
