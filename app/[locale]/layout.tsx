/* File: app/[locale]/layout.tsx */
import '../globals.css';
import {ReactNode} from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import Header from '../(ui)/Header';
import AppFooter from '../(ui)/AppFooter';
import PreferencesProvider from '../(ui)/PreferencesProvider';
import {locales, defaultLocale, type Locale} from '../../i18n';

export const metadata = {
  title: 'App',
  description: 'Next.js App',
};

// חשוב: אנחנו לא מטייפים את הפרופס כ-LayoutProps כדי לא להיתקע עם טיפוס Promise ישן.
// במקום זאת מקבלים props:any ומיישרים את זה בפנים—זה פותר את שגיאת ה-constraint.
export default async function LocaleLayout(props: any) {
  const {children, params}: {children: ReactNode; params: {locale?: string} | Promise<{locale?: string}>} = props;

  // תומך גם במצב שבו params הוא Promise וגם במצב שהוא אובייקט רגיל
  const resolved = await Promise.resolve(params as any);
  const locale = ((resolved?.locale as string) || defaultLocale) as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  // טוען הודעות לפי שפה; נופל לדיפולט אם חסר
  let messages: any;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../../messages/${defaultLocale}.json`)).default;
  }

  const dir = locale === 'he' || locale === 'ar' ? 'rtl' : 'ltr';

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
