// File: app/layout.tsx
// This is the root layout. Its responsibility is to define the <html> and <body> tags
// and set the language and direction, which it receives from the URL.

import { ReactNode } from 'react';

// This defines the props the component will receive
type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function RootLayout({ children, params: { locale } }: Props) {
  return (
    <html lang={locale}>
      <body>
        {children}
      </body>
    </html>
  );
}

