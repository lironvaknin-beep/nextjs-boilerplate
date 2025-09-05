'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FOOTER_DICT = {
    en: { home: 'Home', explore: 'Explore', create: 'Create', library: 'Library', settings: 'Settings' },
    he: { home: 'בית', explore: 'גילוי', create: 'יצירה', library: 'ספרייה', settings: 'הגדרות' },
    ar: { home: 'الرئيسية', explore: 'استكشف', create: 'إنشاء', library: 'المكتبة', settings: 'الإعدادات' },
    es: { home: 'Inicio', explore: 'Explorar', create: 'Crear', library: 'Biblioteca', settings: 'Ajustes' },
    fr: { home: 'Accueil', explore: 'Explorer', create: 'Créer', library: 'Bibliothèque', settings: 'Paramètres' },
    de: { home: 'Start', explore: 'Entdecken', create: 'Erstellen', library: 'Bibliothek', settings: 'Einstellungen' },
    it: { home: 'Home', explore: 'Esplora', create: 'Crea', library: 'Libreria', settings: 'Impostazioni' },
    pt: { home: 'Início', explore: 'Explorar', create: 'Criar', library: 'Biblioteca', settings: 'Configurações' },
    ru: { home: 'Главная', explore: 'Обзор', create: 'Создать', library: 'Библиотека', settings: 'Настройки' },
    pl: { home: 'Start', explore: 'Odkrywaj', create: 'Utwórz', library: 'Biblioteka', settings: 'Ustawienia' },
    tr: { home: 'Anasayfa', explore: 'Keşfet', create: 'Oluştur', library: 'Kütüphane', settings: 'Ayarlar' },
    nl: { home: 'Home', explore: 'Verkennen', create: 'Creëren', library: 'Bibliotheek', settings: 'Instellingen' },
    sv: { home: 'Hem', explore: 'Utforska', create: 'Skapa', library: 'Bibliotek', settings: 'Inställningar' },
    zh: { home: '首页', explore: '发现', create: '创建', library: '图书馆', settings: '设置' },
    ja: { home: 'ホーム', explore: '発見', create: '作成', library: 'ライブラリ', settings: '設定' },
    ko: { home: '홈', explore: '탐색', create: '만들기', library: '라이브러리', settings: '설정' },
    hi: { home: 'होम', explore: 'अन्वेषण', create: 'बनाएं', library: 'पुस्तकालय', settings: 'सेटिंग्स' },
    id: { home: 'Beranda', explore: 'Jelajahi', create: 'Buat', library: 'Perpustakaan', settings: 'Pengaturan' },
    vi: { home: 'Trang chủ', explore: 'Khám phá', create: 'Tạo', library: 'Thư viện', settings: 'Cài đặt' },
};

type LangCode = keyof typeof FOOTER_DICT;

// --- SVG Icons for Footer ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const CreateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>;
const ExploreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>;
const LibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

const NAV_LINKS = [
    { href: '/', labelKey: 'home', icon: <HomeIcon /> },
    { href: '/explore', labelKey: 'explore', icon: <ExploreIcon /> },
    { href: '/builder', labelKey: 'create', icon: <CreateIcon />, primary: true },
    { href: '/me/library', labelKey: 'library', icon: <LibraryIcon /> },
    { href: '/settings', labelKey: 'settings', icon: <SettingsIcon /> },
];

export default function AppFooter() {
    const pathname = usePathname();
    const [lang, setLang] = useState<LangCode>('en');

    useEffect(() => {
        // This component now only READS from the DOM, which is set by the provider.
        const currentLang = (document.documentElement.lang || 'en') as LangCode;
        if (currentLang in FOOTER_DICT) {
            setLang(currentLang);
        }
    }, [pathname]); // Re-check language if path changes, useful for client-side navigation

    const t = FOOTER_DICT[lang] || FOOTER_DICT.en;

    return (
        <footer className="appFooter">
            {NAV_LINKS.map(({ href, labelKey, icon, primary = false }) => {
                const isActive = (href === '/' && pathname === '/') || (href !== '/' && pathname.startsWith(href));
                const linkClasses = `footerLink ${isActive ? 'active' : ''} ${primary ? 'primary' : ''}`;
                
                return (
                    <Link key={href} href={href} className={linkClasses}>
                        {icon}
                        <span>{t[labelKey as keyof typeof t]}</span>
                    </Link>
                );
            })}
        </footer>
    );
}

