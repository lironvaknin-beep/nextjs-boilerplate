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
    en: { back: "Back to feed", by: "By", author: "TextSpot AI", relatedContent: "Related Content", modifyWithAI: "Modify with AI", contentControls: "Modify Content", tone: "Tone", professional: "Professional", casual: "Casual", translate: "Translate", adapt: "Adapt", makeHealthier: "Make Healthier", makeVegan: "Make Vegan", changeGenre: "Change Genre", horror: "Horror", close: "Close" },
    he: { back: "חזרה לפיד", by: "מאת", author: "הבינה המלאכותית של TextSpot", relatedContent: "תוכן קשור", modifyWithAI: "שנה עם AI", contentControls: "שנה את התוכן", tone: "טון", professional: "מקצועי", casual: "יומיומי", translate: "תרגם", adapt: "התאם", makeHealthier: "הפוך לבריא יותר", makeVegan: "הפוך לטבעוני", changeGenre: "שנה ז'אנר", horror: "אימה", close: "סגור" },
    ar: { back: "العودة إلى الموجز", by: "بواسطة", author: "TextSpot AI", relatedContent: "محتوى ذو صلة", modifyWithAI: "تعديلด้วย الذكاء الاصطناعي", contentControls: "تعديل المحتوى", tone: "نبرة", professional: "احترافي", casual: "عادي", translate: "ترجمة", adapt: "تكييف", makeHealthier: "اجعله صحيًا أكثر", makeVegan: "اجعله نباتيًا", changeGenre: "تغيير النوع", horror: "رعب", close: "إغلاق" },
    es: { back: "Volver al feed", by: "Por", author: "IA de TextSpot", relatedContent: "Contenido relacionado", modifyWithAI: "Modificar con IA", contentControls: "Modificar contenido", tone: "Tono", professional: "Profesional", casual: "Casual", translate: "Traducir", adapt: "Adaptar", makeHealthier: "Hacer más saludable", makeVegan: "Hacer vegano", changeGenre: "Cambiar género", horror: "Terror", close: "Cerrar" },
    fr: { back: "Retour au fil", by: "Par", author: "IA de TextSpot", relatedContent: "Contenu associé", modifyWithAI: "Modifier avec l'IA", contentControls: "Modifier le contenu", tone: "Ton", professional: "Professionnel", casual: "Décontracté", translate: "Traduire", adapt: "Adapter", makeHealthier: "Rendre plus sain", makeVegan: "Rendre végétalien", changeGenre: "Changer de genre", horror: "Horreur", close: "Fermer" },
    de: { back: "Zurück zum Feed", by: "Von", author: "TextSpot KI", relatedContent: "Ähnliche Inhalte", modifyWithAI: "Mit KI ändern", contentControls: "Inhalt ändern", tone: "Ton", professional: "Professionell", casual: "Lässig", translate: "Übersetzen", adapt: "Anpassen", makeHealthier: "Gesünder machen", makeVegan: "Vegan machen", changeGenre: "Genre ändern", horror: "Horror", close: "Schließen" },
    it: { back: "Torna al feed", by: "Di", author: "IA di TextSpot", relatedContent: "Contenuti correlati", modifyWithAI: "Modifica con IA", contentControls: "Modifica contenuto", tone: "Tono", professional: "Professionale", casual: "Casuale", translate: "Traduci", adapt: "Adatta", makeHealthier: "Rendi più sano", makeVegan: "Rendi vegano", changeGenre: "Cambia genere", horror: "Orrore", close: "Chiudi" },
    pt: { back: "Voltar ao feed", by: "Por", author: "IA da TextSpot", relatedContent: "Conteúdo relacionado", modifyWithAI: "Modificar com IA", contentControls: "Modificar conteúdo", tone: "Tom", professional: "Profissional", casual: "Casual", translate: "Traduzir", adapt: "Adaptar", makeHealthier: "Tornar mais saudável", makeVegan: "Tornar vegano", changeGenre: "Mudar gênero", horror: "Terror", close: "Fechar" },
    ru: { back: "Назад к ленте", by: "Автор", author: "ИИ TextSpot", relatedContent: "Похожий контент", modifyWithAI: "Изменить с помощью ИИ", contentControls: "Изменить контент", tone: "Тон", professional: "Профессиональный", casual: "Повседневный", translate: "Перевести", adapt: "Адаптировать", makeHealthier: "Сделать более здоровым", makeVegan: "Сделать веганским", changeGenre: "Изменить жанр", horror: "Ужасы", close: "Закрыть" },
    pl: { back: "Wróć do kanału", by: "Przez", author: "SI TextSpot", relatedContent: "Powiązane treści", modifyWithAI: "Modyfikuj za pomocą SI", contentControls: "Modyfikuj treść", tone: "Ton", professional: "Profesjonalny", casual: "Swobodny", translate: "Tłumacz", adapt: "Dostosuj", makeHealthier: "Uczyń zdrowszym", makeVegan: "Uczyń wegańskim", changeGenre: "Zmień gatunek", horror: "Horror", close: "Zamknij" },
    tr: { back: "Akışa geri dön", by: "Yazan", author: "TextSpot AI", relatedContent: "İlgili İçerik", modifyWithAI: "AI ile Değiştir", contentControls: "İçeriği Değiştir", tone: "Ton", professional: "Profesyonel", casual: "Günlük", translate: "Çevir", adapt: "Uyarla", makeHealthier: "Daha Sağlıklı Yap", makeVegan: "Vegan Yap", changeGenre: "Türü Değiştir", horror: "Korku", close: "Kapat" },
    nl: { back: "Terug naar feed", by: "Door", author: "TextSpot AI", relatedContent: "Gerelateerde inhoud", modifyWithAI: "Wijzigen met AI", contentControls: "Inhoud wijzigen", tone: "Toon", professional: "Professioneel", casual: "Informeel", translate: "Vertalen", adapt: "Aanpassen", makeHealthier: "Gezonder maken", makeVegan: "Veganistisch maken", changeGenre: "Genre wijzigen", horror: "Horror", close: "Sluiten" },
    sv: { back: "Tillbaka till flödet", by: "Av", author: "TextSpot AI", relatedContent: "Relaterat innehåll", modifyWithAI: "Ändra med AI", contentControls: "Ändra innehåll", tone: "Ton", professional: "Professionell", casual: "Vardaglig", translate: "Översätt", adapt: "Anpassa", makeHealthier: "Gör hälsosammare", makeVegan: "Gör vegansk", changeGenre: "Ändra genre", horror: "Skräck", close: "Stäng" },
    zh: { back: "返回动态", by: "作者", author: "TextSpot AI", relatedContent: "相关内容", modifyWithAI: "使用 AI 修改", contentControls: "修改内容", tone: "语气", professional: "专业", casual: "休闲", translate: "翻译", adapt: "调整", makeHealthier: "更健康", makeVegan: "纯素", changeGenre: "更改类型", horror: "恐怖", close: "关闭" },
    ja: { back: "フィードに戻る", by: "作成者", author: "TextSpot AI", relatedContent: "関連コンテンツ", modifyWithAI: "AIで変更", contentControls: "コンテンツを変更", tone: "トーン", professional: "プロフェッショナル", casual: "カジュアル", translate: "翻訳", adapt: "適応", makeHealthier: "より健康的に", makeVegan: "ビーガンにする", changeGenre: "ジャンルを変更", horror: "ホラー", close: "閉じる" },
    ko: { back: "피드로 돌아가기", by: "작성자", author: "TextSpot AI", relatedContent: "관련 콘텐츠", modifyWithAI: "AI로 수정", contentControls: "콘텐츠 수정", tone: "톤", professional: "전문가용", casual: "캐주얼", translate: "번역", adapt: "조정", makeHealthier: "더 건강하게 만들기", makeVegan: "비건으로 만들기", changeGenre: "장르 변경", horror: "공포", close: "닫기" },
    hi: { back: "फ़ीड पर वापस", by: "द्वारा", author: "TextSpot AI", relatedContent: "संबंधित सामग्री", modifyWithAI: "एआई के साथ संशोधित करें", contentControls: "सामग्री संशोधित करें", tone: "स्वर", professional: "पेशेवर", casual: "अनौपचारिक", translate: "अनुवाद", adapt: "अनुकूलित करें", makeHealthier: "स्वस्थ बनाएं", makeVegan: "शाकाहारी बनाएं", changeGenre: "शैली बदलें", horror: "डरावनी", close: "बंद करें" },
    id: { back: "Kembali ke feed", by: "Oleh", author: "TextSpot AI", relatedContent: "Konten terkait", modifyWithAI: "Ubah dengan AI", contentControls: "Ubah Konten", tone: "Nada", professional: "Profesional", casual: "Santai", translate: "Terjemahkan", adapt: "Sesuaikan", makeHealthier: "Jadikan Lebih Sehat", makeVegan: "Jadikan Vegan", changeGenre: "Ubah Genre", horror: "Horor", close: "Tutup" },
    vi: { back: "Quay lại bảng tin", by: "Bởi", author: "TextSpot AI", relatedContent: "Nội dung liên quan", modifyWithAI: "Sửa đổi bằng AI", contentControls: "Sửa đổi nội dung", tone: "Giọng điệu", professional: "Chuyên nghiệp", casual: "Thân mật", translate: "Dịch", adapt: "Điều chỉnh", makeHealthier: "Làm cho lành mạnh hơn", makeVegan: "Làm cho thuần chay", changeGenre: "Thay đổi thể loại", horror: "Kinh dị", close: "Đóng" },
};

type LangCode = keyof typeof ITEM_DICT;

// --- SVG Icons ---
const MagicWandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2m0 14v-2m-7.5 5.5L9 16m0-7L7.5 7.5M4 9H2m14 0h-2m5.5 7.5L16 15m0-7l1.5-1.5M9.5 4l-1-1L4 7.5 2 9.5l5.5 2L9 14l2.5 1.5L14 13l2.5 1.5L22 9l-2-2-1.5 1.5-2.5-1.5L14 4Z"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;


export default function ItemPage() {
    const params = useParams();
    const [lang, setLang] = useState<LangCode>('en');
    const [item, setItem] = useState<(typeof sampleData)[0] | null>(null);
    const [relatedItems, setRelatedItems] = useState<typeof sampleData>([]);
    const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);

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
        setIsEqualizerOpen(false); // Close modal after action
    };

    const t = useMemo(() => ITEM_DICT[lang] || ITEM_DICT.en, [lang]);

    if (!item) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const renderAdaptControls = () => {
        switch (item.category) {
            case 'Recipe':
            case 'For You': // Assuming "For You" might contain recipes
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
                </header>
                
                <div className={styles.content}>
                    <p>{item.snippet}</p>
                </div>
            </article>

            <section className={styles.relatedSection}>
                <h2 className={styles.relatedTitle}>{t.relatedContent}</h2>
                <div className={styles.relatedGrid}>
                    {relatedItems.map(related => (
                        <Link href={`/item/${related.id}`} key={related.id} className={styles.relatedCard} style={{background: related.colorGradient}}>
                             <div className={styles.relatedCardOverlay} />
                             <div className={styles.relatedCardContent}>
                                <h3 className={styles.relatedCardTitle}>{related.title}</h3>
                             </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Floating Action Button for Equalizer */}
            <button className={styles.equalizerFab} onClick={() => setIsEqualizerOpen(true)} title={t.modifyWithAI}>
                <MagicWandIcon />
            </button>

            {/* Equalizer Modal */}
            {isEqualizerOpen && (
                 <div className={styles.modalOverlay} onClick={() => setIsEqualizerOpen(false)}>
                    <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeModalBtn} onClick={() => setIsEqualizerOpen(false)}><XIcon/></button>
                        <h2 className={styles.modalTitle}>{t.contentControls}</h2>
                        
                        <div className={styles.equalizerSection}>
                             <h3 className={styles.equalizerTitle}>{t.tone}</h3>
                             <div className={styles.controlGroup}>
                                <button onClick={() => handleContentModification('tone', 'professional')}>{t.professional}</button>
                                <button onClick={() => handleContentModification('tone', 'casual')}>{t.casual}</button>
                             </div>
                        </div>

                         <div className={styles.equalizerSection}>
                             <h3 className={styles.equalizerTitle}>{t.adapt}</h3>
                             <div className={styles.controlGroup}>
                                {renderAdaptControls()}
                            </div>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
}

