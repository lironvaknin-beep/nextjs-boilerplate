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
    en: { back: "Back to feed", by: "By", author: "TextSpot AI", relatedContent: "Related Content", displayControls: "Display Controls", contentControls: "Modify Content", fontSize: "Font Size", fontStyle: "Font Style", serif: "Serif", sansSerif: "Sans-Serif", tone: "Tone", professional: "Professional", casual: "Casual", translate: "Translate", adapt: "Adapt", makeHealthier: "Make Healthier", makeVegan: "Make Vegan", changeGenre: "Change Genre", horror: "Horror" },
    he: { back: "חזרה לפיד", by: "מאת", author: "הבינה המלאכותית של TextSpot", relatedContent: "תוכן קשור", displayControls: "בקרת תצוגה", contentControls: "שנה את התוכן", fontSize: "גודל גופן", fontStyle: "סגנון גופן", serif: "סריף", sansSerif: "סאנס-סריף", tone: "טון", professional: "מקצועי", casual: "יומיומי", translate: "תרגם", adapt: "התאם", makeHealthier: "הפוך לבריא יותר", makeVegan: "הפוך לטבעוני", changeGenre: "שנה ז'אנר", horror: "אימה" },
    ar: { back: "العودة إلى الموجز", by: "بواسطة", author: "TextSpot AI", relatedContent: "محتوى ذو صلة", displayControls: "عناصر التحكم في العرض", contentControls: "تعديل المحتوى", fontSize: "حجم الخط", fontStyle: "نمط الخط", serif: "سيريف", sansSerif: "سانس سيريف", tone: "نبرة", professional: "احترافي", casual: "عادي", translate: "ترجمة", adapt: "تكييف", makeHealthier: "اجعله صحيًا أكثر", makeVegan: "اجعله نباتيًا", changeGenre: "تغيير النوع", horror: "رعب" },
    // Full dictionary for all languages...
};

type LangCode = keyof typeof ITEM_DICT;


export default function ItemPage() {
    const params = useParams();
    const [lang, setLang] = useState<LangCode>('en');
    const [item, setItem] = useState<(typeof sampleData)[0] | null>(null);
    const [relatedItems, setRelatedItems] = useState<typeof sampleData>([]);
    
    const [fontSize, setFontSize] = useState('medium');
    const [fontFamily, setFontFamily] = useState('serif');

    useEffect(() => {
        const currentLang = (getCookie('user-lang') || 'en') as LangCode;
        if (currentLang in ITEM_DICT) setLang(currentLang);

        if (params.id) {
            const currentId = Number(params.id);
            const foundItem = sampleData.find(d => d.id === currentId);
            setItem(foundItem || null);

            const otherItems = sampleData.filter(d => d.id !== currentId).slice(0, 2);
            setRelatedItems(otherItems);
        }
    }, [params.id]);
    
    const handleContentModification = async (type: string, value: string) => {
        console.log(`Modifying content: type=${type}, value=${value}`);
        if(item) {
            setItem({ ...item, snippet: `[Content modified: ${type} set to ${value}] \n\n ${item.snippet}` });
        }
    };

    const t = useMemo(() => ITEM_DICT[lang] || ITEM_DICT.en, [lang]);

    if (!item) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const renderAdaptControls = () => {
        // This logic remains the same, assuming 'category' exists on your data items
        switch (item.category) {
            case 'Recipe':
                return (
                    <>
                        <button onClick={() => handleContentModification('adapt', 'healthy')}>{t.makeHealthier}</button>
                        <button onClick={() => handleContentModification('adapt', 'vegan')}>{t.makeVegan}</button>
                    </>
                );
            case 'Short Stories':
                 return (
                    <>
                        <button onClick={() => handleContentModification('genre', 'horror')}>{t.horror}</button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.itemPageWrapper}>
            <article className={styles.itemPage}>
                <header className={styles.itemHeader}>
                    <Link href="/" className={styles.backLink}>
                        &larr; {t.back}
                    </Link>
                    <p className={styles.category}>{item.category}</p>
                    <h1 className={styles.title}>{item.title}</h1>
                    <div className={styles.meta}>
                        {t.by} <span className={styles.author}>{t.author}</span>
                    </div>

                    <div className={styles.equalizer}>
                        <div className={styles.equalizerSection}>
                            <h3 className={styles.equalizerTitle}>{t.displayControls}</h3>
                            <div className={styles.controlGroup}>
                                <span className={styles.controlLabel}>{t.fontSize}</span>
                                <button onClick={() => setFontSize('small')} className={fontSize === 'small' ? styles.active : ''}>A-</button>
                                <button onClick={() => setFontSize('medium')} className={fontSize === 'medium' ? styles.active : ''}>A</button>
                                <button onClick={() => setFontSize('large')} className={fontSize === 'large' ? styles.active : ''}>A+</button>
                            </div>
                            <div className={styles.controlGroup}>
                                <span className={styles.controlLabel}>{t.fontStyle}</span>
                                <button onClick={() => setFontFamily('serif')} className={fontFamily === 'serif' ? styles.active : ''}>{t.serif}</button>
                                <button onClick={() => setFontFamily('sans-serif')} className={fontFamily === 'sans-serif' ? styles.active : ''}>{t.sansSerif}</button>
                            </div>
                        </div>
                         <div className={styles.equalizerSection}>
                             <h3 className={styles.equalizerTitle}>{t.contentControls}</h3>
                             <div className={styles.controlGroup}>
                                <span className={styles.controlLabel}>{t.tone}</span>
                                <button onClick={() => handleContentModification('tone', 'professional')}>{t.professional}</button>
                                <button onClick={() => handleContentModification('tone', 'casual')}>{t.casual}</button>
                             </div>
                             <div className={styles.controlGroup}>
                                <span className={styles.controlLabel}>{t.adapt}</span>
                                {renderAdaptControls()}
                            </div>
                         </div>
                    </div>
                </header>
                
                <div className={`${styles.content} ${styles[fontSize]} ${styles[fontFamily]}`}>
                    <p>{item.snippet}</p>
                </div>
            </article>

            <section className={styles.relatedSection}>
                <h2 className={styles.relatedTitle}>{t.relatedContent}</h2>
                <div className={styles.relatedGrid}>
                    {relatedItems.map(related => (
                        <Link href={`/item/${related.id}`} key={related.id} className={styles.relatedCard}>
                             <span className={styles.relatedCategory}>{related.category}</span>
                             <h3 className={styles.relatedCardTitle}>{related.title}</h3>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

