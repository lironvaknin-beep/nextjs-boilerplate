// File: app/[locale]/layout.tsx
// This is the main layout for all internationalized pages.
// It loads translations and wraps all pages with the global components.

import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import type { Metadata } from 'next';
import '../globals.css'; // Note the path goes up one level
import Header from '../(ui)/Header';
import AppFooter from '../(ui)/AppFooter';
import PreferencesProvider from '../(ui)/PreferencesProvider';

export const metadata: Metadata = {
  title: 'TextSpot - AI-Powered Creation',
  description: 'A smart, guided builder for creating stories, recipes, and more.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <NextIntlClientProvider messages={messages}>
        <PreferencesProvider>
          <Header />
          <main>{children}</main>
          <AppFooter />
        </PreferencesProvider>
    </NextIntlClientProvider>
  );
}

