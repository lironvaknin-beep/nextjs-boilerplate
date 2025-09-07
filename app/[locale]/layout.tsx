// File: app/[locale]/layout.tsx
// Location: /app/[locale]/layout.tsx
// This is the main layout for all internationalized pages, now with the correct type handling for params.

import {NextIntlClientProvider, AbstractIntlMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';
import {locales} from '../../i18n';

import '../globals.css';
import Header from '../(ui)/Header';
import AppFooter from '../(ui)/AppFooter';
import PreferencesProvider from '../(ui)/PreferencesProvider';

// This type correctly handles that `params` can be an object or a Promise.
type Params = { locale: string } | Promise<{ locale: string }>;
type Props = { children: ReactNode; params: Params };

export default async function LocaleLayout({ children, params }: Props) {
  // By resolving the promise here, we handle both cases gracefully.
  const { locale } = await Promise.resolve(params);
  if (!locales.includes(locale as any)) notFound();

  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages;
  } catch {
    // A safe fallback to English if a translation file is missing.
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

