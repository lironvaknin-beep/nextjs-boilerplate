// File: app/[locale]/layout.tsx
import {NextIntlClientProvider, AbstractIntlMessages} from 'next-intl';
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
  params: { locale: string };
};

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale)) notFound();

  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages;
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
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
