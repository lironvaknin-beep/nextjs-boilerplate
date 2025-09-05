'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import styles from './item.module.css';
import sampleData from '../../sample-data.json';

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

const ITEM_DICT = {
    en: { back: "Back to feed", by: "By", author: "TextSpot AI", relatedContent: "Related Content", modifyWithAI: "Remix with AI", contentControls: "Remix Content", close: "Close", community: "Community Reactions", postComment: "Post Comment", humor: "Humor", diners: "Diners", targetAudience: "Target Audience", kids: "Kids", teens: "Teens", adults: "Adults", actionLevel: "Action Level", low: "Low", high: "High", pov: "Point of View", firstPerson: "First", thirdPerson: "Third", twists: "Twists", addTwist: "Add a Twist", kashrut: "Kashrut", kosher: "Kosher", nonKosher: "Non-Kosher", difficulty: "Difficulty", easy: "Easy", complex: "Complex", genre: "Genre", horror: "Horror", comedy: "Comedy", romance: "Romance", addCommentPlaceholder: "Add your reaction..." },
    he: { back: "חזרה לפיד", by: "מאת", author: "הבינה המלאכותית של TextSpot", relatedContent: "תוכן קשור", modifyWithAI: "שנה עם AI", contentControls: "שנה את התוכן", close: "סגור", community: "תגובות הקהילה", postComment: "פרסם תגובה", humor: "הומור", diners: "סועדים", targetAudience: "קהל יעד", kids: "ילדים", teens: "נוער", adults: "מבוגרים", actionLevel: "רמת אקשן", low: "נמוכה", high: "גבוהה", pov: "נקודת מבט", firstPerson: "גוף ראשון", thirdPerson: "גוף שלישי", twists: "טוויסטים", addTwist: "הוסף טוויסט", kashrut: "כשרות", kosher: "כשר", nonKosher: "לא כשר", difficulty: "רמת קושי", easy: "קל", complex: "מורכב", genre: "ז'אנר", horror: "אימה", comedy: "קומדיה", romance: "רומנטיקה", addCommentPlaceholder: "הוסף את תגובתך..." },
    ar: { back: "العودة إلى الموجز", by: "بواسطة", author: "TextSpot AI", relatedContent: "محتوى ذو صلة", modifyWithAI: "تعديل بواسطة الذكاء الاصطناعي", contentControls: "تعديل المحتوى", close: "إغلاق", community: "ردود فعل المجتمع", postComment: "نشر تعليق", humor: "فكاهة", diners: "رواد المطعم", targetAudience: "الجمهور المستهدف", kids: "أطفال", teens: "مراهقون", adults: "بالغون", actionLevel: "مستوى الحركة", low: "منخفض", high: "مرتفع", pov: "وجهة نظر", firstPerson: "الشخص الأول", thirdPerson: "الشخص الثالث", twists: "تحولات", addTwist: "أضف تحولاً", kashrut: "كوشير", kosher: "كوشير", nonKosher: "غير كوشير", difficulty: "صعوبة", easy: "سهل", complex: "معقد", genre: "نوع", horror: "رعب", comedy: "كوميديا", romance: "رومانسية", addCommentPlaceholder: "أضف رد فعلك..." },
    es: { back: "Volver al feed", by: "Por", author: "IA de TextSpot", relatedContent: "Contenido relacionado", modifyWithAI: "Remezclar con IA", contentControls: "Remezclar Contenido", close: "Cerrar", community: "Reacciones de la comunidad", postComment: "Publicar comentario", humor: "Humor", diners: "Comensales", targetAudience: "Público objetivo", kids: "Niños", teens: "Adolescentes", adults: "Adultos", actionLevel: "Nivel de acción", low: "Bajo", high: "Alto", pov: "Punto de vista", firstPerson: "Primera persona", thirdPerson: "Tercera persona", twists: "Giros", addTwist: "Añadir un giro", kashrut: "Kashrut", kosher: "Kosher", nonKosher: "No kosher", difficulty: "Dificultad", easy: "Fácil", complex: "Complejo", genre: "Género", horror: "Terror", comedy: "Comedia", romance: "Romance", addCommentPlaceholder: "Añade tu reacción..." },
    fr: { back: "Retour au fil", by: "Par", author: "IA de TextSpot", relatedContent: "Contenu associé", modifyWithAI: "Remixer avec l'IA", contentControls: "Remixer le Contenu", close: "Fermer", community: "Réactions de la communauté", postComment: "Publier un commentaire", humor: "Humour", diners: "Convives", targetAudience: "Public cible", kids: "Enfants", teens: "Adolescents", adults: "Adultes", actionLevel: "Niveau d'action", low: "Bas", high: "Élevé", pov: "Point de vue", firstPerson: "Première personne", thirdPerson: "Troisième personne", twists: "Rebondissements", addTwist: "Ajouter un rebondissement", kashrut: "Cacherout", kosher: "Casher", nonKosher: "Non casher", difficulty: "Difficulté", easy: "Facile", complex: "Complexe", genre: "Genre", horror: "Horreur", comedy: "Comédie", romance: "Romance", addCommentPlaceholder: "Ajoutez votre réaction..." },
    // Full dictionary for all languages will be included in the final output
};

type LangCode = keyof typeof ITEM_DICT;

const sampleComments = [
    { id: 1, author: "Alex", text: "This is brilliant! The ending gave me chills.", reactions: { "❤️": 12, "🤯": 5 } },
    { id: 2, author: "Maria", text: "I tried the 'horror' remix and it was amazing! 👻", reactions: { "😂": 8, "👍": 15 } },
];

// --- SVG Icons ---
const MagicWandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2m0 14v-2m-7.5 5.5L9 16m0-7L7.5 7.5M4 9H2m14 0h-2m5.5 7.5L16 15m0-7l1.5-1.5M9.5 4l-1-1L4 7.5 2 9.5l5.5 2L9 14l2.5 1.5L14 13l2.5 1.5L22 9l-2-2-1.5 1.5-2.5-1.5L14 4Z"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;


export default function ItemPage() {
    const params = useParams();
    const [lang, setLang] = useState<LangCode>('en');
    const [item, setItem] = useState<(typeof sampleData)[0] & { pullQuote?: string } | null>(null);
    const [relatedItems, setRelatedItems] = useState<typeof sampleData>([]);
    const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
    const [showXp, setShowXp] = useState(false);
    
    const [equalizerState, setEqualizerState] = useState({
        humor: 50, action: 50, diners: 2, pov: 'third', audience: 'adults'
    });

    useEffect(() => {
        const currentLang = (getCookie('user-lang') || 'en') as LangCode;
        if (currentLang in ITEM_DICT) setLang(currentLang);

        if (params.id) {
            const currentId = Number(params.id);
            const foundItem = sampleData.find(d => d.id === currentId);
            setItem(foundItem || null);

            const otherItems = sampleData.filter(d => d.id !== currentId).slice(0, 4);
            setRelatedItems(otherItems);
        }
    }, [params.id]);
    
    const handleContentModification = async (type: string, value: any) => {
        console.log(`Modifying content: type=${type}, value=${value}`);
        if(item) {
            setItem({ ...item, snippet: `[Content modified via Equalizer: ${type} set to ${value}] \n\n ${item.snippet}` });
        }
    };

    const handleFabClick = () => {
        setIsEqualizerOpen(true);
        setShowXp(true);
        setTimeout(() => setShowXp(false), 1500);
    };

    const t = useMemo(() => ITEM_DICT[lang] || ITEM_DICT.en, [lang]);

    if (!item) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const pullQuote = item.pullQuote || item.snippet.split('. ')[0] + '.';

    const renderEqualizerControls = () => {
        switch (item.documentType) {
            case 'recipe':
                return (
                    <div className={styles.equalizerSection}>
                        <h3 className={styles.equalizerTitle}>{t.diners}</h3>
                        <div className={styles.stepper}>
                            <button onClick={() => setEqualizerState(s => ({...s, diners: Math.max(1, s.diners - 1)}))}>-</button>
                            <span>{equalizerState.diners}</span>
                            <button onClick={() => setEqualizerState(s => ({...s, diners: s.diners + 1}))}>+</button>
                        </div>
                    </div>
                );
            case 'story':
                 return (
                     <>
                        <div className={styles.equalizerSection}>
                            <h3 className={styles.equalizerTitle}>{t.humor}</h3>
                            <input type="range" min="0" max="100" value={equalizerState.humor} onChange={(e) => setEqualizerState(s => ({...s, humor: Number(e.target.value)}))} onMouseUp={() => handleContentModification('humor', equalizerState.humor)} className={styles.slider}/>
                        </div>
                        <div className={styles.equalizerSection}>
                             <h3 className={styles.equalizerTitle}>{t.pov}</h3>
                             <div className={styles.controlGroup}>
                                <button onClick={() => handleContentModification('pov', 'first')}>{t.firstPerson}</button>
                                <button onClick={() => handleContentModification('pov', 'third')}>{t.thirdPerson}</button>
                            </div>
                         </div>
                     </>
                );
            default:
                return null;
        }
    };
    
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": item.title,
        "author": { "@type": "Person", "name": "TextSpot AI" },
        "publisher": { "@type": "Organization", "name": "TextSpot", "logo": { "@type": "ImageObject", "url": "/logo.png" } },
        "articleBody": item.snippet,
    };

    return (
        <div className={styles.itemPageWrapper}>
            <Head>
                <script type="application/ld+json">{JSON.stringify(schema)}</script>
            </Head>
            <article className={styles.itemPage}>
                <header className={styles.itemHeader}>
                    <Link href="/" className={styles.backLink}> &larr; {t.back} </Link>
                    <div className={styles.headerMain}>
                        <div className={styles.headerText}>
                            <p className={styles.category}>{item.category}</p>
                            <h1 className={styles.title}>{item.title}</h1>
                            <div className={styles.meta}>{t.by} <span className={styles.author}>{t.author}</span></div>
                        </div>
                        <div className={styles.viralActions}>
                            <div className={styles.viralScore}>🔥 85%</div>
                            <div className={styles.shareButtons}>
                                <button>X</button><button>W</button><button>F</button>
                            </div>
                        </div>
                    </div>
                </header>
                
                {pullQuote && (<blockquote className={styles.pullQuote}>{pullQuote}</blockquote>)}

                <div className={styles.content}>
                    {item.snippet.split('. ').map((sentence, index) => (
                        <span key={index} className={styles.sentence}>{sentence}{index < item.snippet.split('. ').length - 1 ? '. ' : ''}</span>
                    ))}
                </div>
            </article>

            <section className={styles.relatedSection}>
                <h2 className={styles.relatedTitle}>{t.relatedContent}</h2>
                <div className={styles.relatedSlider}>
                    {relatedItems.map(related => (
                        <Link href={`/item/${related.id}`} key={related.id} className={`${styles.relatedCard} ${styles[related.cardType]}`} style={{ background: related.colorGradient }}>
                             <div className={styles.cardOverlay}/>
                             <div className={styles.relatedCardContent}>
                                <h3 className={styles.relatedCardTitle}>{related.title}</h3>
                                <button className={styles.quickRemixBtn}>Remix</button>
                             </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className={styles.communitySection}>
                <h2 className={styles.communityTitle}>{t.community}</h2>
                <div className={styles.comments}>
                    {sampleComments.map(comment => (
                        <div key={comment.id} className={styles.comment}>
                            <p className={styles.commentAuthor}>{comment.author}</p>
                            <p className={styles.commentText}>{comment.text}</p>
                            <div className={styles.reactions}>
                                {Object.entries(comment.reactions).map(([emoji, count]) => (
                                    <button key={emoji}>{emoji} {count}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className={styles.addComment}>
                        <textarea placeholder={t.addCommentPlaceholder}></textarea>
                        <button>{t.postComment}</button>
                    </div>
                </div>
            </section>

            <button className={styles.equalizerFab} onClick={handleFabClick} title={t.modifyWithAI}>
                <MagicWandIcon />
                {showXp && <span className={styles.xpGain}>+5 XP</span>}
            </button>

            {isEqualizerOpen && (
                 <div className={styles.modalOverlay} onClick={() => setIsEqualizerOpen(false)}>
                    <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeModalBtn} onClick={() => setIsEqualizerOpen(false)}><XIcon/></button>
                        <h2 className={styles.modalTitle}>{t.contentControls}</h2>
                        {renderEqualizerControls()}
                    </div>
                </div>
            )}
        </div>
    );
}

