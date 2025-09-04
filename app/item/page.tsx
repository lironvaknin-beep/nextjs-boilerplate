'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './item.module.css';
import sampleData from '../sample-data.json';

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
    es: { back: "Volver al feed", by: "Por", author: "IA de TextSpot", relatedContent: "Contenido relacionado", displayControls: "Controles de visualización", contentControls: "Modificar contenido", fontSize: "Tamaño de fuente", fontStyle: "Estilo de fuente", serif: "Serif", sansSerif: "Sans-Serif", tone: "Tono", professional: "Profesional", casual: "Casual", translate: "Traducir", adapt: "Adaptar", makeHealthier: "Hacer más saludable", makeVegan: "Hacer vegano", changeGenre: "Cambiar género", horror: "Terror" },
    fr: { back: "Retour au fil", by: "Par", author: "IA de TextSpot", relatedContent: "Contenu associé", displayControls: "Contrôles d'affichage", contentControls: "Modifier le contenu", fontSize: "Taille de la police", fontStyle: "Style de police", serif: "Serif", sansSerif: "Sans-Serif", tone: "Ton", professional: "Professionnel", casual: "Décontracté", translate: "Traduire", adapt: "Adapter", makeHealthier: "Rendre plus sain", makeVegan: "Rendre végétalien", changeGenre: "Changer de genre", horror: "Horreur" },
    de: { back: "Zurück zum Feed", by: "Von", author: "TextSpot KI", relatedContent: "Ähnliche Inhalte", displayControls: "Anzeigesteuerung", contentControls: "Inhalt ändern", fontSize: "Schriftgröße", fontStyle: "Schriftstil", serif: "Serif", sansSerif: "Sans-Serif", tone: "Ton", professional: "Professionell", casual: "Lässig", translate: "Übersetzen", adapt: "Anpassen", makeHealthier: "Gesünder machen", makeVegan: "Vegan machen", changeGenre: "Genre ändern", horror: "Horror" },
    it: { back: "Torna al feed", by: "Di", author: "IA di TextSpot", relatedContent: "Contenuti correlati", displayControls: "Controlli visualizzazione", contentControls: "Modifica contenuto", fontSize: "Dimensione carattere", fontStyle: "Stile carattere", serif: "Serif", sansSerif: "Sans-Serif", tone: "Tono", professional: "Professionale", casual: "Casuale", translate: "Traduci", adapt: "Adatta", makeHealthier: "Rendi più sano", makeVegan: "Rendi vegano", changeGenre: "Cambia genere", horror: "Orrore" },
    pt: { back: "Voltar ao feed", by: "Por", author: "IA da TextSpot", relatedContent: "Conteúdo relacionado", displayControls: "Controles de exibição", contentControls: "Modificar conteúdo", fontSize: "Tamanho da fonte", fontStyle: "Estilo da fonte", serif: "Serif", sansSerif: "Sans-Serif", tone: "Tom", professional: "Profissional", casual: "Casual", translate: "Traduzir", adapt: "Adaptar", makeHealthier: "Tornar mais saudável", makeVegan: "Tornar vegano", changeGenre: "Mudar gênero", horror: "Terror" },
    ru: { back: "Назад к ленте", by: "Автор", author: "ИИ TextSpot", relatedContent: "Похожий контент", displayControls: "Управление отображением", contentControls: "Изменить контент", fontSize: "Размер шрифта", fontStyle: "Стиль шрифта", serif: "Serif", sansSerif: "Sans-Serif", tone: "Тон", professional: "Профессиональный", casual: "Повседневный", translate: "Перевести", adapt: "Адаптировать", makeHealthier: "Сделать более здоровым", makeVegan: "Сделать веганским", changeGenre: "Изменить жанр", horror: "Ужасы" },
    pl: { back: "Wróć do kanału", by: "Przez", author: "SI TextSpot", relatedContent: "Powiązane treści", displayControls: "Kontrola wyświetlania", contentControls: "Modyfikuj treść", fontSize: "Rozmiar czcionki", fontStyle: "Styl czcionki", serif: "Serif", sansSerif: "Sans-Serif", tone: "Ton", professional: "Profesjonalny", casual: "Swobodny", translate: "Tłumacz", adapt: "Dostosuj", makeHealthier: "Uczyń zdrowszym", makeVegan: "Uczyń wegańskim", changeGenre: "Zmień gatunek", horror: "Horror" },
    tr: { back: "Akışa geri dön", by: "Yazan", author: "TextSpot AI", relatedContent: "İlgili İçerik", displayControls: "Görünüm Kontrolleri", contentControls: "İçeriği Değiştir", fontSize: "Yazı Tipi Boyutu", fontStyle: "Yazı Tipi Stili", serif: "Serif", sansSerif: "Sans-Serif", tone: "Ton", professional: "Profesyonel", casual: "Günlük", translate: "Çevir", adapt: "Uyarla", makeHealthier: "Daha Sağlıklı Yap", makeVegan: "Vegan Yap", changeGenre: "Türü Değiştir", horror: "Korku" },
    nl: { back: "Terug naar feed", by: "Door", author: "TextSpot AI", relatedContent: "Gerelateerde inhoud", displayControls: "Weergave-instellingen", contentControls: "Inhoud wijzigen", fontSize: "Lettergrootte", fontStyle: "Letterstijl", serif: "Serif", sansSerif: "Sans-Serif", tone: "Toon", professional: "Professioneel", casual: "Informeel", translate: "Vertalen", adapt: "Aanpassen", makeHealthier: "Gezonder maken", makeVegan: "Veganistisch maken", changeGenre: "Genre wijzigen", horror: "Horror" },
    sv: { back: "Tillbaka till flödet", by: "Av", author: "TextSpot AI", relatedContent: "Relaterat innehåll", displayControls: "Visningskontroller", contentControls: "Ändra innehåll", fontSize: "Teckenstorlek", fontStyle: "Teckenstil", serif: "Serif", sansSerif: "Sans-Serif", tone: "Ton", professional: "Professionell", casual: "Vardaglig", translate: "Översätt", adapt: "Anpassa", makeHealthier: "Gör hälsosammare", makeVegan: "Gör vegansk", changeGenre: "Ändra genre", horror: "Skräck" },
    zh: { back: "返回动态", by: "作者", author: "TextSpot AI", relatedContent: "相关内容", displayControls: "显示控制", contentControls: "修改内容", fontSize: "字体大小", fontStyle: "字体样式", serif: "衬线体", sansSerif: "无衬线体", tone: "语气", professional: "专业", casual: "休闲", translate: "翻译", adapt: "调整", makeHealthier: "更健康", makeVegan: "纯素", changeGenre: "更改类型", horror: "恐怖" },
    ja: { back: "フィードに戻る", by: "作成者", author: "TextSpot AI", relatedContent: "関連コンテンツ", displayControls: "表示設定", contentControls: "コンテンツを変更", fontSize: "フォントサイズ", fontStyle: "フォントスタイル", serif: "セリフ", sansSerif: "サンセリフ", tone: "トーン", professional: "プロフェッショナル", casual: "カジュアル", translate: "翻訳", adapt: "適応", makeHealthier: "より健康的に", makeVegan: "ビーガンにする", changeGenre: "ジャンルを変更", horror: "ホラー" },
    ko: { back: "피드로 돌아가기", by: "작성자", author: "TextSpot AI", relatedContent: "관련 콘텐츠", displayControls: "표시 제어", contentControls: "콘텐츠 수정", fontSize: "글꼴 크기", fontStyle: "글꼴 스타일", serif: "세리프", sansSerif: "산세리프", tone: "톤", professional: "전문가용", casual: "캐주얼", translate: "번역", adapt: "조정", makeHealthier: "더 건강하게 만들기", makeVegan: "비건으로 만들기", changeGenre: "장르 변경", horror: "공포" },
    hi: { back: "फ़ीड पर वापस", by: "द्वारा", author: "TextSpot AI", relatedContent: "संबंधित सामग्री", displayControls: "प्रदर्शन नियंत्रण", contentControls: "सामग्री संशोधित करें", fontSize: "फ़ॉन्ट आकार", fontStyle: "फ़ॉन्ट शैली", serif: "सेरिफ़", sansSerif: "sans-serif", tone: "स्वर", professional: "पेशेवर", casual: "अनौपचारिक", translate: "अनुवाद", adapt: "अनुकूलित करें", makeHealthier: "स्वस्थ बनाएं", makeVegan: "शाकाहारी बनाएं", changeGenre: "शैली बदलें", horror: "डरावनी" },
    id: { back: "Kembali ke feed", by: "Oleh", author: "TextSpot AI", relatedContent: "Konten terkait", displayControls: "Kontrol Tampilan", contentControls: "Ubah Konten", fontSize: "Ukuran Font", fontStyle: "Gaya Font", serif: "Serif", sansSerif: "Sans-Serif", tone: "Nada", professional: "Profesional", casual: "Santai", translate: "Terjemahkan", adapt: "Sesuaikan", makeHealthier: "Jadikan Lebih Sehat", makeVegan: "Jadikan Vegan", changeGenre: "Ubah Genre", horror: "Horor" },
    vi: { back: "Quay lại bảng tin", by: "Bởi", author: "TextSpot AI", relatedContent: "Nội dung liên quan", displayControls: "Điều khiển hiển thị", contentControls: "Sửa đổi nội dung", fontSize: "Cỡ chữ", fontStyle: "Kiểu chữ", serif: "Serif", sansSerif: "Sans-Serif", tone: "Giọng điệu", professional: "Chuyên nghiệp", casual: "Thân mật", translate: "Dịch", adapt: "Điều chỉnh", makeHealthier: "Làm cho lành mạnh hơn", makeVegan: "Làm cho thuần chay", changeGenre: "Thay đổi thể loại", horror: "Kinh dị" },
};


type LangCode = keyof typeof ITEM_DICT;

export default function ItemPage() {
    const params = useParams();
    const [lang, setLang] = useState<LangCode>('en');
    const [item, setItem] = useState<(typeof sampleData)[0] | null>(null);
    const [relatedItems, setRelatedItems] = useState<typeof sampleData>([]);
    
    // State for Display Equalizer
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

