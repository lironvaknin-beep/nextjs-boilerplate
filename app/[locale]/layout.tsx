import '../globals.css';

import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

import { locales } from '../../i18n';
import Header from '../(ui)/Header';
import AppFooter from '../(ui)/AppFooter';
import PreferencesProvider from '../(ui)/PreferencesProvider';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  // שים לב: כאן params הוא Promise של האובייקט עם locale
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

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
