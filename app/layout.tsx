/* File: app/[locale]/layout.tsx */
import '../globals.css';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Header from '../(ui)/Header';
import AppFooter from '../(ui)/AppFooter';
import PreferencesProvider from '../(ui)/PreferencesProvider';
import { locales, defaultLocale, type Locale, isRTL } from '../../i18n';

export const metadata = {
  title: 'App',
  description: 'Next.js App',
};

// מקבל גם params כאובייקט וגם כ-Promise כדי למנוע שגיאות טיפוס בין גרסאות
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

  const dir: 'rtl' | 'ltr' = isRTL(locale) ? 'rtl' : 'ltr';

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
