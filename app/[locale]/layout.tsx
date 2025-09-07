// File: app/[locale]/layout.tsx
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { locales } from '../../i18n';

import '../globals.css';
import Header from '../(ui)/Header';
import AppFooter from '../(ui)/AppFooter';
import PreferencesProvider from '../(ui)/PreferencesProvider';

type Params = { locale: string } | Promise<{ locale: string }>;
type Props = { children: ReactNode; params: Params };

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await Promise.resolve(params);
  if (!locales.includes(locale as any)) notFound();

  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages;
  } catch {
    messages = (await import(`../../messages/en.json`)).default as AbstractIntlMessages;
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
