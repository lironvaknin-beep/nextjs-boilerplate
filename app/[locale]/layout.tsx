// app/[locale]/layout.tsx
import {NextIntlClientProvider, AbstractIntlMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {ReactNode} from 'react';

import '../globals.css';
import Header from '../(ui)/Header';
import AppFooter from '../(ui)/AppFooter';
import PreferencesProvider from '../(ui)/PreferencesProvider';
import {locales} from '../../i18n';

export const metadata: Metadata = {
  title: 'TextSpot - AI-Powered Creation',
  description: 'A smart, guided builder for creating stories, recipes, and more.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
};

// ✅ תומך גם ב-{ locale: string } וגם ב-Promise<{ locale: string }>
type Params =
  | { locale: string }
  | Promise<{ locale: string }>;

type Props = {
  children: ReactNode;
  params: Params;
};

export default async function LocaleLayout({ children, params }: Props) {
  // נחלץ את הערך גם אם params הוא Promise
  const { locale } = await Promise.resolve(params);

  // בדיקת תוקף לוקאל
  if (!locales.includes(locale)) notFound();

  // טען הודעות לפי לוקאל
  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages;
  } catch (err) {
    console.error('Missing messages for locale:', locale, err);
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
