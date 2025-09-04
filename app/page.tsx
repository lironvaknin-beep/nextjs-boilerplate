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
    en: { welcome: "Welcome to TextSpot" },
    he: { welcome: "ברוכים הבאים ל-TextSpot" },
    ar: { welcome: "مرحبًا بك في TextSpot" },
    es: { welcome: "Bienvenido a TextSpot" },
    fr: { welcome: "Bienvenue sur TextSpot" },
    de: { welcome: "Willkommen bei TextSpot" },
    it: { welcome: "Benvenuto in TextSpot" },
    pt: { welcome: "Bem-vindo ao TextSpot" },
    ru: { welcome: "Добро пожаловать в TextSpot" },
    pl: { welcome: "Witamy w TextSpot" },
    tr: { welcome: "TextSpot'a Hoş Geldiniz" },
    nl: { welcome: "Welkom bij TextSpot" },
    sv: { welcome: "Välkommen till TextSpot" },
    zh: { welcome: "欢迎来到 TextSpot" },
    ja: { welcome: "TextSpotへようこそ" },
    ko: { welcome: "TextSpot에 오신 것을 환영합니다" },
    hi: { welcome: "TextSpot में आपका स्वागत है" },
    id: { welcome: "Selamat datang di TextSpot" },
    vi: { welcome: "Chào mừng đến với TextSpot" },
};

const CATEGORIES_DICT = {
    en: { "Trending Now": "Trending Now", "Short Stories": "Short Stories", "For You": "For You", "Tech & Future": "Tech & Future", "Characters": "Characters" },
    he: { "Trending Now": "פופולרי עכשיו", "Short Stories": "סיפורים קצרים", "For You": "בשבילך", "Tech & Future": "טכנולוגיה ועתיד", "Characters": "דמויות" },
    ar: { "Trending Now": "الرائج الآن", "Short Stories": "قصص قصيرة", "For You": "لك", "Tech & Future": "التكنولوجيا والمستقبل", "Characters": "شخصيات" },
    es: { "Trending Now": "Tendencias ahora", "Short Stories": "Cuentos cortos", "For You": "Para ti", "Tech & Future": "Tecnología y futuro", "Characters": "Personajes" },
    fr: { "Trending Now": "Tendances actuelles", "Short Stories": "Histoires courtes", "For You": "Pour vous", "Tech & Future": "Technologie et avenir", "Characters": "Personnages" },
    de: { "Trending Now": "Aktuelle Trends", "Short Stories": "Kurzgeschichten", "For You": "Für dich", "Tech & Future": "Technik & Zukunft", "Characters": "Charaktere" },
    it: { "Trending Now": "Tendenze del momento", "Short Stories": "Racconti brevi", "For You": "Per te", "Tech & Future": "Tecnologia e futuro", "Characters": "Personaggi" },
    pt: { "Trending Now": "Em alta agora", "Short Stories": "Contos", "For You": "Para você", "Tech & Future": "Tecnologia e futuro", "Characters": "Personagens" },
    ru: { "Trending Now": "В тренде сейчас", "Short Stories": "Короткие рассказы", "For You": "Для вас", "Tech & Future": "Технологии и будущее", "Characters": "Персонажи" },
    pl: { "Trending Now": "Na czasie", "Short Stories": "Opowiadania", "For You": "Dla Ciebie", "Tech & Future": "Technologia i przyszłość", "Characters": "Postacie" },
    tr: { "Trending Now": "Şu An Trend Olanlar", "Short Stories": "Kısa Hikayeler", "For You": "Sizin İçin", "Tech & Future": "Teknoloji ve Gelecek", "Characters": "Karakterler" },
    nl: { "Trending Now": "Nu populair", "Short Stories": "Korte verhalen", "For You": "Voor jou", "Tech & Future": "Tech & toekomst", "Characters": "Personages" },
    sv: { "Trending Now": "Populärt just nu", "Short Stories": "Noveller", "For You": "För dig", "Tech & Future": "Teknik & framtid", "Characters": "Karaktärer" },
    zh: { "Trending Now": "时下流行", "Short Stories": "短篇故事", "For You": "为你推荐", "Tech & Future": "科技与未来", "Characters": "人物" },
    ja: { "Trending Now": "現在のトレンド", "Short Stories": "短編小説", "For You": "あなたへのおすすめ", "Tech & Future": "テクノロジーと未来", "Characters": "キャラクター" },
    ko: { "Trending Now": "현재 트렌드", "Short Stories": "단편 소설", "For You": "당신을 위해", "Tech & Future": "기술 및 미래", "Characters": "캐릭터" },
    hi: { "Trending Now": "अभी ट्रेंडिंग में", "Short Stories": "लघु कथाएँ", "For You": "आपके लिए", "Tech & Future": "प्रौद्योगिकी और भविष्य", "Characters": "पात्र" },
    id: { "Trending Now": "Sedang Tren", "Short Stories": "Cerita Pendek", "For You": "Untuk Anda", "Tech & Future": "Teknologi & Masa Depan", "Characters": "Karakter" },
    vi: { "Trending Now": "Thịnh hành", "Short Stories": "Truyện ngắn", "For You": "Dành cho bạn", "Tech & Future": "Công nghệ & Tương lai", "Characters": "Nhân vật" },
};

type LangCode = keyof typeof DICT;

const groupedData = sampleData.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
}, {} as Record<string, typeof sampleData>);


export default function HomePage() {
    const [lang, setLang] = useState<LangCode>('en');

    useEffect(() => {
        const currentLang = (getCookie('user-lang') || 'en') as LangCode;
        if (currentLang in DICT) {
            setLang(currentLang);
        }
    }, []);

    const t = useMemo(() => DICT[lang] || DICT.en, [lang]);
    const t_cat = useMemo(() => CATEGORIES_DICT[lang] || CATEGORIES_DICT.en, [lang]);

    return (
        <div className={styles.homePage}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>{t.welcome}</h1>
            </header>
            
            <main className={styles.feedContainer}>
                {Object.entries(groupedData).map(([category, items]) => (
                    <section key={category} className={styles.categoryRow}>
                        <h2 className={styles.rowTitle}>{t_cat[category as keyof typeof t_cat] || category}</h2>
                        <div className={styles.rowSlider}>
                            {items.map(item => (
                                <Link href={`/item/${item.id}`} key={item.id} className={`${styles.card} ${styles[item.cardType]}`}>
                                    <div className={styles.cardOverlay} style={{background: item.colorGradient}}/>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{item.title}</h3>
                                        <p className={styles.snippet}>{item.snippet}</p>
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

