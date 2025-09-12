export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">  {/* lang ברירת מחדל; RTL יוחלף בדפדפן ע"י LanguageSwitcher */}
      <body>{children}</body>
    </html>
  );
}
