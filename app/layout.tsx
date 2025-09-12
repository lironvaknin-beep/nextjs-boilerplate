/* File: app/[locale]/layout.tsx */
import '../globals.css';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Header from '../(ui)/Header';
import AppFooter from '../(ui)/AppFooter';
import PreferencesProvider from '../(ui)/PreferencesProvider';
import { locales, defaultLocale, type Locale } from '../../i18n';

export const metadata = {
  title: 'App',
  description: 'Next.js App',
};

// מקבל גם מצב שבו params הוא Promise וגם מצב שהוא אובייקט רגיל – בלי להיתקע על LayoutProps
export default async function LocaleLayout(props: any) {
  const { children, params }: { children: ReactNode; params: { locale?: string } | Promise<{ locale?: string }> } = props;

  const resolved = await Promise.resolve(params as any);
  const locale = ((resolved?.locale as string) || defaultLocale) as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  let messages: any;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../../messages/${defaultLocale}.json`)).default;
  }

  // RTL רק לעברית (he). אם תרצה גם ערבית – הוסף 'ar' ל-locales בקובץ i18n.ts.
  const dir: 'rtl' | 'ltr' = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
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
