// File: app/layout.tsx
// Location: /app/layout.tsx
// This is the root layout, simplified to define only the html/body shell and import global CSS.
// It does not handle locale parameters, solving the build conflict.

import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  // This layout is simple. The lang and dir attributes will be managed
  // dynamically by the nested layout and the PreferencesProvider.
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}

