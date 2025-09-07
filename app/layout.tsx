// app/layout.tsx
import type { ReactNode } from 'react';

// אם יש לך app/globals.css – זה המקום לייבא אותו
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
