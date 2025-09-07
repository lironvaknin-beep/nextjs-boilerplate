// File: app/layout.tsx
// This is the root layout. It's minimal and sets up the language.

import { locales } from '../i18n';

export default function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Validate that the incoming `locale` parameter is one of our supported locales
  if (!locales.includes(locale)) {
    // In a real app, you would redirect to a default locale or show a 404 page.
    // For now, we let it render, but it won't find translation messages.
  }

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}

