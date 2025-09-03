export default function AppFooter() {
  // In a real app, you'd use a hook like `usePathname` from `next/navigation` to get the current path
  const currentPath = '/builder'; 

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/builder", label: "Create", icon: "✨" },
    { href: "/explore", label: "Explore", icon: "🧭" },
    { href: "/me/library", label: "Library", icon: "📚" },
  ];

  return (
    <footer className="app-footer" role="contentinfo">
      <nav className="footer-inner">
        {navItems.map(item => (
          <a 
            key={item.href}
            href={item.href} 
            className={`footer-nav-btn ${currentPath === item.href ? 'active' : ''}`}
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </footer>
  );
}

