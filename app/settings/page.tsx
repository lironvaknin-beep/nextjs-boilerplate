// File: app/settings/page.tsx
// Location: /app/settings/page.tsx
// This is a Server Component whose only purpose is to redirect the user.
// It prevents Next.js from trying to prerender the client component at a path without a locale.

import {redirect} from 'next/navigation';
import {defaultLocale} from '../../i18n'; // We will ensure this is exported correctly

export default function SettingsRedirect() {
  // Redirect any request to /settings to the default locale version, e.g., /en/settings
  redirect(`/${defaultLocale}/settings`);
}

