// File: app/[locale]/layout.tsx
// This is the main layout for all internationalized pages.
// It loads translations and wraps all pages with the global components.
// CRITICAL: It does NOT render <html> or <body> tags.

import {NextIntlClientProvider, AbstractIntlMessages} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import { locales } from '../../i18n';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '../globals.css';
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
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages;
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    notFound();
  }
 
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

