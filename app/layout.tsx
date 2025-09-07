// File: app/layout.tsx
// This is the root layout. It's now minimal and only passes children through.
// The actual <html> and <body> tags are defined in app/[locale]/layout.tsx.

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  // This component needs to exist, but it should be as simple as possible.
  // It just returns the children, which will be the content from the nested layout.
  return children;
}

