import '../globals.css';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/locales';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string }; // ← היה Promise — לתקן לאובייקט רגיל
}) {
  const { locale } = params; // ← בלי await

  if (!locales.includes(locale as any)) {
    notFound();
  }

  let messages: any;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (e) {
    console.error('Failed to load locale messages for:', locale, e);
    messages = (await import(`../../messages/${defaultLocale}.json`)).default;
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
