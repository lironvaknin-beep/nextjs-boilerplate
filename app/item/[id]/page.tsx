'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
    en: { back: "Back to feed", by: "By", author: "TextSpot AI", relatedContent: "Related Content", modifyWithAI: "Remix with AI", contentControls: "Remix Content", tone: "Tone", professional: "Professional", casual: "Casual", translate: "Translate", adapt: "Adapt", makeHealthier: "Make Healthier", makeVegan: "Make Vegan", changeGenre: "Change Genre", horror: "Horror", close: "Close", community: "Community Reactions", humor: "Humor", diners: "Diners" },
    he: { back: "חזרה לפיד", by: "מאת", author: "הבינה המלאכותית של TextSpot", relatedContent: "תוכן קשור", modifyWithAI: "שנה עם AI", contentControls: "שנה את התוכן", tone: "טון", professional: "מקצועי", casual: "יומיומי", translate: "תרגם", adapt: "התאם", makeHealthier: "הפוך לבריא יותר", makeVegan: "הפוך לטבעוני", changeGenre: "שנה ז'אנר", horror: "אימה", close: "סגור", community: "תגובות הקהילה", humor: "הומור", diners: "סועדים" },
    // Full dictionary for all 19 languages...
};

type LangCode = keyof typeof ITEM_DICT;

// --- SVG Icons ---
const MagicWandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2m0 14v-2m-7.5 5.5L9 16m0-7L7.5 7.5M4 9H2m14 0h-2m5.5 7.5L16 15m0-7l1.5-1.5M9.5 4l-1-1L4 7.5 2 9.5l5.5 2L9 14l2.5 1.5L14 13l2.5 1.5L22 9l-2-2-1.5 1.5-2.5-1.5L14 4Z"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const sampleComments = [
    { id: 1, author: "Alex", text: "This is brilliant! The ending gave me chills.", reactions: { "❤️": 12, "🤯": 5 } },
    { id: 2, author: "Maria", text: "I tried the 'horror' remix and it was amazing! 👻", reactions: { "😂": 8, "👍": 15 } },
];

export default function ItemPage() {
    const params = useParams();
    const [lang, setLang] = useState<LangCode>('en');
    const [item, setItem] = useState<(typeof sampleData)[0] | null>(null);
    const [relatedItems, setRelatedItems] = useState<typeof sampleData>([]);
    const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
    const [showXp, setShowXp] = useState(false);
    
    // State for Equalizer sliders
    const [humorLevel, setHumorLevel] = useState(50);
    const [dinersCount, setDinersCount] = useState(2);

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
            setItem({ ...item, snippet: `[Content modified: ${type} set to ${value}] \n\n ${item.snippet}` });
        }
        if (type !== 'humor' && type !== 'diners') {
            setIsEqualizerOpen(false);
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

    const renderAdaptControls = () => {
        switch (item.category) {
            case 'For You':
            case 'Recipe':
                return (
                    <>
                        <div className={styles.equalizerSection}>
                            <h3 className={styles.equalizerTitle}>{t.diners}</h3>
                             <div className={styles.stepper}>
                                <button onClick={() => setDinersCount(c => Math.max(1, c - 1))}>-</button>
                                <span>{dinersCount}</span>
                                <button onClick={() => setDinersCount(c => c + 1)}>+</button>
                            </div>
                        </div>
                        <div className={styles.equalizerSection}>
                             <h3 className={styles.equalizerTitle}>{t.adapt}</h3>
                             <div className={styles.controlGroup}>
                                <button onClick={() => handleContentModification('adapt', 'healthy')}>{t.makeHealthier}</button>
                                <button onClick={() => handleContentModification('adapt', 'vegan')}>{t.makeVegan}</button>
                            </div>
                         </div>
                    </>
                );
            case 'Short Stories':
                 return (
                     <div className={styles.equalizerSection}>
                         <h3 className={styles.equalizerTitle}>{t.changeGenre}</h3>
                         <div className={styles.controlGroup}>
                            <button onClick={() => handleContentModification('genre', 'horror')}>{t.horror}</button>
                        </div>
                     </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.itemPageWrapper}>
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
                                <button>X</button>
                                <button>W</button>
                                <button>F</button>
                            </div>
                        </div>
                    </div>
                </header>
                
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
                        <Link href={`/item/${related.id}`} key={related.id} className={`${styles.relatedCard} ${styles[related.cardType]}`}>
                             <div className={styles.cardOverlay} style={{background: related.colorGradient}}/>
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
                        
                        <div className={styles.equalizerSection}>
                             <h3 className={styles.equalizerTitle}>{t.humor}</h3>
                             <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={humorLevel} 
                                onChange={(e) => setHumorLevel(Number(e.target.value))}
                                onMouseUp={() => handleContentModification('humor', humorLevel)}
                                className={styles.slider}
                             />
                        </div>
                        
                        {renderAdaptControls()}
                    </div>
                </div>
            )}
        </div>
    );
}

