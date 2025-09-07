// File: app/[locale]/layout.tsx
// Location: /app/[locale]/layout.tsx
// This is the main layout for all internationalized pages.
// It loads translations and wraps all pages with the global components.
// CRITICAL: It does NOT render <html> or <body> tags.

import {NextIntlClientProvider, AbstractIntlMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';
import {locales} from '../../i18n';
import '../globals.css';
import Header from '../(ui)/Header';
import AppFooter from '../(ui)/AppFooter';
import PreferencesProvider from '../(ui)/PreferencesProvider';
import { getMessages } from 'next-intl/server';

type Props = { 
  children: ReactNode; 
  params: { locale: string };
};

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as any)) notFound();

  let messages: AbstractIntlMessages;
  try {
    messages = (await getMessages({locale})) as AbstractIntlMessages;
  } catch (error) {
    // A safe fallback to English if a translation file is missing.
    console.error("Could not load messages for locale:", locale, "Falling back to 'en'.");
    messages = (await import(`../../messages/en.json`)).default as AbstractIntlMessages;
  }

  // IMPORTANT: This layout does not return <html> or <body>,
  // as that is handled by the root layout in app/layout.tsx.
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

