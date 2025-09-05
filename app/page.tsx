'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './home.module.css';
import sampleData from './sample-data.json';

// --- Helper function for getting a cookie ---
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const DICT = {
    en: { welcome: "Welcome to TextSpot", all: "All" },
    he: { welcome: "ברוכים הבאים ל-TextSpot", all: "הכל" },
    ar: { welcome: "مرحبًا بك في TextSpot", all: "الكل" },
    es: { welcome: "Bienvenido a TextSpot", all: "Todos" },
    fr: { welcome: "Bienvenue sur TextSpot", all: "Tout" },
    de: { welcome: "Willkommen bei TextSpot", all: "Alle" },
    it: { welcome: "Benvenuto in TextSpot", all: "Tutti" },
    pt: { welcome: "Bem-vindo ao TextSpot", all: "Todos" },
    ru: { welcome: "Добро пожаловать в TextSpot", all: "Все" },
    pl: { welcome: "Witamy w TextSpot", all: "Wszystko" },
    tr: { welcome: "TextSpot'a Hoş Geldiniz", all: "Tümü" },
    nl: { welcome: "Welkom bij TextSpot", all: "Alles" },
    sv: { welcome: "Välkommen till TextSpot", all: "Alla" },
    zh: { welcome: "欢迎来到 TextSpot", all: "全部" },
    ja: { welcome: "TextSpotへようこそ", all: "すべて" },
    ko: { welcome: "TextSpot에 오신 것을 환영합니다", all: "전체" },
    hi: { welcome: "TextSpot में आपका स्वागत है", all: "सभी" },
    id: { welcome: "Selamat datang di TextSpot", all: "Semua" },
    vi: { welcome: "Chào mừng đến với TextSpot", all: "Tất cả" },
};

const CATEGORIES_DICT = {
    en: { "Trending Now": "Trending Now", "Short Stories": "Short Stories", "For You": "For You", "Characters": "Characters", "Tech & Future": "Tech & Future", "Productivity Hacks": "Productivity Hacks", "World History": "World History" },
    he: { "Trending Now": "פופולרי עכשיו", "Short Stories": "סיפורים קצרים", "For You": "בשבילך", "Characters": "דמויות", "Tech & Future": "טכנולוגיה ועתיד", "Productivity Hacks": "טיפים לפרודוקטיביות", "World History": "היסטוריה עולמית" },
    ar: { "Trending Now": "الرائج الآن", "Short Stories": "قصص قصيرة", "For You": "لك", "Characters": "شخصيات", "Tech & Future": "التكنولوجيا والمستقبل", "Productivity Hacks": "حيل إنتاجية", "World History": "تاريخ العالم" },
    es: { "Trending Now": "Tendencias ahora", "Short Stories": "Cuentos cortos", "For You": "Para ti", "Characters": "Personajes", "Tech & Future": "Tecnología y futuro", "Productivity Hacks": "Trucos de productividad", "World History": "Historia mundial" },
    fr: { "Trending Now": "Tendances actuelles", "Short Stories": "Histoires courtes", "For You": "Pour vous", "Characters": "Personnages", "Tech & Future": "Technologie et avenir", "Productivity Hacks": "Astuces de productivité", "World History": "Histoire du monde" },
    de: { "Trending Now": "Aktuelle Trends", "Short Stories": "Kurzgeschichten", "For You": "Für dich", "Characters": "Charaktere", "Tech & Future": "Technik & Zukunft", "Productivity Hacks": "Produktivitätshacks", "World History": "Weltgeschichte" },
    it: { "Trending Now": "Tendenze del momento", "Short Stories": "Racconti brevi", "For You": "Per te", "Characters": "Personaggi", "Tech & Future": "Tecnologia e futuro", "Productivity Hacks": "Trucchi di produttività", "World History": "Storia mondiale" },
    pt: { "Trending Now": "Em alta agora", "Short Stories": "Contos", "For You": "Para você", "Characters": "Personagens", "Tech & Future": "Tecnologia e futuro", "Productivity Hacks": "Dicas de produtividade", "World History": "História mundial" },
    ru: { "Trending Now": "В тренде сейчас", "Short Stories": "Короткие рассказы", "For You": "Для вас", "Characters": "Персонажи", "Tech & Future": "Технологии и будущее", "Productivity Hacks": "Лайфхаки по продуктивности", "World History": "Всемирная история" },
    pl: { "Trending Now": "Na czasie", "Short Stories": "Opowiadania", "For You": "Dla Ciebie", "Characters": "Postacie", "Tech & Future": "Technologia i przyszłość", "Productivity Hacks": "Sztuczki produktywności", "World History": "Historia świata" },
    tr: { "Trending Now": "Şu An Trend Olanlar", "Short Stories": "Kısa Hikayeler", "For You": "Sizin İçin", "Characters": "Karakterler", "Tech & Future": "Teknoloji ve Gelecek", "Productivity Hacks": "Üretkenlik Hileleri", "World History": "Dünya Tarihi" },
    nl: { "Trending Now": "Nu populair", "Short Stories": "Korte verhalen", "For You": "Voor jou", "Characters": "Personages", "Tech & Future": "Tech & toekomst", "Productivity Hacks": "Productiviteitshacks", "World History": "Wereldgeschiedenis" },
    sv: { "Trending Now": "Populärt just nu", "Short Stories": "Noveller", "For You": "För dig", "Characters": "Karaktärer", "World History": "Världshistoria", "Productivity Hacks": "Produktivitetshacks" },
    zh: { "Trending Now": "时下流行", "Short Stories": "短篇故事", "For You": "为你推荐", "Characters": "人物", "Tech & Future": "科技与未来", "Productivity Hacks": "生产力技巧", "World History": "世界历史" },
    ja: { "Trending Now": "現在のトレンド", "Short Stories": "短編小説", "For You": "あなたへのおすすめ", "Characters": "キャラクター", "Tech & Future": "テクノロジーと未来", "Productivity Hacks": "生産性ハック", "World History": "世界史" },
    ko: { "Trending Now": "현재 트렌드", "Short Stories": "단편 소설", "For You": "당신을 위해", "Characters": "캐릭터", "Tech & Future": "기술 및 미래", "Productivity Hacks": "생산성 팁", "World History": "세계사" },
    hi: { "Trending Now": "अभी ट्रेंडिंग में", "Short Stories": "लघु कथाएँ", "For You": "आपके लिए", "Characters": "पात्र", "Tech & Future": "प्रौद्योगिकी और भविष्य", "Productivity Hacks": "उत्पादकता हैक्स", "World History": "विश्व इतिहास" },
    id: { "Trending Now": "Sedang Tren", "Short Stories": "Cerita Pendek", "For You": "Untuk Anda", "Characters": "Karakter", "Tech & Future": "Teknologi & Masa Depan", "Productivity Hacks": "Trik Produktivitas", "World History": "Sejarah Dunia" },
    vi: { "Trending Now": "Thịnh hành", "Short Stories": "Truyện ngắn", "For You": "Dành cho bạn", "Characters": "Nhân vật", "Tech & Future": "Công nghệ & Tương lai", "Productivity Hacks": "Mẹo năng suất", "World History": "Lịch sử thế giới" },
};

type LangCode = keyof typeof DICT;

const groupedData = sampleData.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
}, {} as Record<string, typeof sampleData>);

const allCategories = ['All', ...Object.keys(groupedData)];

export default function HomePage() {
    const [lang, setLang] = useState<LangCode>('en');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const currentLang = (getCookie('user-lang') || 'en') as LangCode;
        if (currentLang in DICT) {
            setLang(currentLang);
        }
    }, []);

    const t = useMemo(() => DICT[lang] || DICT.en, [lang]);
    const t_cat = useMemo(() => CATEGORIES_DICT[lang] || CATEGORIES_DICT.en, [lang]);

    const filteredCategories = useMemo(() => {
        if (activeFilter === 'All') {
            return Object.entries(groupedData);
        }
        return Object.entries(groupedData).filter(([category]) => category === activeFilter);
    }, [activeFilter]);

    return (
        <div className={styles.homePage}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>{t.welcome}</h1>
            </header>

            <nav className={styles.filterBar}>
                {allCategories.map(category => (
                    <button 
                        key={category} 
                        className={`${styles.filterBtn} ${activeFilter === category ? styles.active : ''}`}
                        onClick={() => setActiveFilter(category)}
                    >
                        {category === 'All' ? t.all : t_cat[category as keyof typeof t_cat] || category}
                    </button>
                ))}
            </nav>
            
            <main className={styles.feedContainer}>
                {filteredCategories.map(([category, items]) => (
                    <section key={category} className={styles.categoryRow}>
                        <h2 className={styles.rowTitle}>{t_cat[category as keyof typeof t_cat] || category}</h2>
                        <div className={styles.rowSlider}>
                            {items.map(item => (
                                <Link href={`/item/${item.id}`} key={item.id} className={`${styles.card} ${styles[item.cardType]}`}>
                                    <div className={styles.cardOverlay} style={{background: item.colorGradient}}/>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{item.title}</h3>
                                        {/* Snippet is now optional, for cleaner cards */}
                                        {item.snippet && <p className={styles.snippet}>{item.snippet}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    );
}

