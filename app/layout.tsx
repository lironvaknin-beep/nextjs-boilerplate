// File: app/layout.tsx
// This is the root layout. Its only job is to define the <html> and <body> tags.
// It receives the `locale` from the URL and sets it as the language.

import { ReactNode } from 'react';

// This defines the props the component will receive
type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function RootLayout({ children, params: { locale } }: Props) {
  // The lang attribute is crucial for next-intl and accessibility.
  return (
    <html lang={locale}>
      <body>
        {children}
      </body>
    </html>
  );
}

