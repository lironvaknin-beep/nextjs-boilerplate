// File: app/[locale]/layout.tsx
// This is the one and only ROOT layout for the entire application.
// It defines <html> and <body>, loads translations, and sets up all global components.

import {NextIntlClientProvider, AbstractIntlMessages} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import { locales } from '../../i18n'; // Assumes i18n.ts is in the project root
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
    // The path is now relative to the project root, where the `messages` folder is.
    messages = (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages;
  } catch (error) {
    // If messages for a valid locale are not found, it's a build error.
    console.error(`Could not load messages for locale: ${locale}`, error);
    notFound();
  }
 
  return (
    // The <html> and <body> tags are defined here.
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
            <PreferencesProvider>
              <Header />
              <main>{children}</main>
              <AppFooter />
            </PreferencesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

