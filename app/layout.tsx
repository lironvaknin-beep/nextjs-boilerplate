// File: app/layout.tsx
// This is the root layout. It's minimal and only defines the html and body tags.
// The locale is handled by the layout inside the [locale] folder.

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Since the middleware is redirecting, the locale parameter is not available here.
// This layout applies to all locales.
export default function RootLayout({ children }: Props) {
  return (
    // The lang attribute will be set by the nested layout in app/[locale]/layout.tsx
    <html>
      <body>{children}</body>
    </html>
  );
}

