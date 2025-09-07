// File: app/[locale]/layout.tsx
// This is the main layout for all internationalized pages.
// It loads translations and wraps all pages with the global components.

import {NextIntlClientProvider, AbstractIntlMessages} from 'next-intl';
import {getMessages} from 'next-intl/server';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '../globals.css'; // Note the path goes up one level
import Header from '../(ui)/Header';
import AppFooter from '../(ui)/AppFooter';
import PreferencesProvider from '../(ui)/PreferencesProvider';

export const metadata: Metadata = {
  title: 'TextSpot - AI-Powered Creation',
  description: 'A smart, guided builder for creating stories, recipes, and more.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export default async function LocaleLayout({
  children,
  params: {locale}
}: Props) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages() as AbstractIntlMessages;
 
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
        <PreferencesProvider>
          <Header />
          <main>{children}</main>
          <AppFooter />
        </PreferencesProvider>
    </NextIntlClientProvider>
  );
}

