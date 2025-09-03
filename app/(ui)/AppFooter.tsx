'use client';
// In a real app, you might use usePathname from next/navigation to determine the active link
// For now, we'll keep it simple and mark 'Builder' as active.
// import { usePathname } from 'next/navigation';

export default function AppFooter() {
  // const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/builder', label: 'Builder' },
    { href: '/explore', label: 'Explore' },
    { href: '/me/library', label: 'Library' },
  ];

  return (
    <footer className="app-footer" role="contentinfo">
      <nav className="footer-nav">
        {navItems.map(item => (
          <a 
            key={item.href} 
            href={item.href} 
            // In a real app, you would use a check like this:
            // className={pathname === item.href ? 'footer-nav-btn active' : 'footer-nav-btn'}
            className={item.href === '/builder' ? 'footer-nav-btn active' : 'footer-nav-btn'}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}

