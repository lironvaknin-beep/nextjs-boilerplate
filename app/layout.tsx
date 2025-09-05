import type { Metadata } from 'next';
import './globals.css';
import Header from './(ui)/Header';
import AppFooter from './(ui)/AppFooter';
import PreferencesProvider from './(ui)/PreferencesProvider'; // Import the new provider

export const metadata: Metadata = {
  title: 'TextSpot - AI-Powered Creation',
  description: 'A smart, guided builder for creating stories, recipes, and more.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The provider will now handle setting these attributes on the client side
    <html>
      <body>
        <PreferencesProvider>
          <Header />
          <main>{children}</main>
          <AppFooter />
        </PreferencesProvider>
      </body>
    </html>
  );
}

