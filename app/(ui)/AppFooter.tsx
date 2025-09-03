'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- SVG Icons for Footer ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const CreateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>;
const ExploreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>;
const LibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;


const NAV_LINKS = [
    { href: '/', label: 'Home', icon: <HomeIcon /> },
    { href: '/builder', label: 'Create', icon: <CreateIcon /> },
    { href: '/explore', label: 'Explore', icon: <ExploreIcon /> },
    { href: '/me/library', label: 'Library', icon: <LibraryIcon /> },
];

export default function AppFooter() {
    const pathname = usePathname();

    return (
        <footer className="appFooter">
            {NAV_LINKS.map(({ href, label, icon }) => {
                // The link is active if it's the homepage OR if the path starts with the link's href
                const isActive = (href === '/' && pathname === '/') || (href !== '/' && pathname.startsWith(href));
                return (
                    <Link key={href} href={href} className={`footerLink ${isActive ? 'active' : ''}`}>
                        {icon}
                        <span>{label}</span>
                    </Link>
                );
            })}
        </footer>
    );
}

