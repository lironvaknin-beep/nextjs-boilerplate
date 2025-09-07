// File: app/layout.tsx
// This is the root layout. It's now minimal and only passes children through.
// The actual <html> and <body> tags are defined in app/[locale]/layout.tsx.

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}

