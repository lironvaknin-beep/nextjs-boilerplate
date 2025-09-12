'use client';

import { useState, useEffect, useMemo } from 'react';
import Script from 'next/script';
import styles from './builder.module.css';

// This component now assumes PreferencesProvider has set the correct lang/dir on the <html> element.

const DICT = {
    en: { title:'What would you like to create?', docType:'Document type', promptPh:'e.g., a short story about a kid who finds a robot on the beach…', clear:'Clear', start:'Start Building', preview:'Preview', share:'Share', save: 'Save', previewTitle:'Preview', contentSaved: 'Content saved!', contentCopied: 'Content copied!', close: 'Close' },
    he: { title:'מה תרצו ליצור?', docType:'סוג המסמך', promptPh:'לדוגמה: סיפור קצר על ילד שמוצא רובוט בחוף הים…', clear:'ניקוי', start:'להתחיל ליצור', preview:'תצוגה מקדימה', share:'שיתוף', save: 'שמירה', previewTitle:'תצוגה מקדימה', contentSaved: 'התוכן נשמר!', contentCopied: 'התוכן הועתק!', close: 'סגור' },
    ar: { title: 'ماذا تود أن تنشئ؟', docType: 'نوع المستند', promptPh: 'على سبيل المثال: قصة قصيرة عن طفل يجد روبوتًا على الشاطئ...', clear: 'مسح', start: 'ابدأ الإنشاء', preview: 'معاينة', share: 'مشاركة', save: 'حفظ', previewTitle: 'معاينة', contentSaved: 'تم حفظ المحتوى!', contentCopied: 'تم نسخ المحتوى!', close: 'إغلاق' },
    es: { title: '¿Qué te gustaría crear?', docType: 'Tipo de documento', promptPh: 'p. ej., un cuento sobre un niño que encuentra un robot...', clear: 'Limpiar', start: 'Comenzar', preview: 'Vista previa', share: 'Compartir', save: 'Guardar', previewTitle: 'Vista previa', contentSaved: '¡Contenido guardado!', contentCopied: '¡Contenido copiado!', close: 'Cerrar' },
    fr: { title: 'Que souhaitez-vous créer ?', docType: 'Type de document', promptPh: 'p. ex., une nouvelle sur un enfant qui trouve un robot...', clear: 'Effacer', start: 'Commencer', preview: 'Aperçu', share: 'Partager', save: 'Sauvegarder', previewTitle: 'Aperçu', contentSaved: 'Contenu sauvegardé !', contentCopied: 'Contenu copié !', close: 'Fermer' },
    de: { title: 'Was möchten Sie erstellen?', docType: 'Dokumenttyp', promptPh: 'z.B. eine Kurzgeschichte über ein Kind, das einen Roboter findet...', clear: 'Löschen', start: 'Erstellung starten', preview: 'Vorschau', share: 'Teilen', save: 'Speichern', previewTitle: 'Vorschau', contentSaved: 'Inhalt gespeichert!', contentCopied: 'Inhalt kopiert!', close: 'Schließen' },
    it: { title: 'Cosa vorresti creare?', docType: 'Tipo di documento', promptPh: 'es. una breve storia su un bambino che trova un robot...', clear: 'Pulisci', start: 'Inizia a creare', preview: 'Anteprima', share: 'Condividi', save: 'Salva', previewTitle: 'Anteprima', contentSaved: 'Contenuto salvato!', contentCopied: 'Contenuto copiato!', close: 'Chiudi' },
    pt: { title: 'O que você gostaria de criar?', docType: 'Tipo de documento', promptPh: 'ex.: um conto sobre um garoto que encontra um robô...', clear: 'Limpar', start: 'Começar a Criar', preview: 'Pré-visualizar', share: 'Compartilhar', save: 'Salvar', previewTitle: 'Pré-visualizar', contentSaved: 'Conteúdo salvo!', contentCopied: 'Conteúdo copiado!', close: 'Fechar' },
    ru: { title: 'Что бы вы хотели создать?', docType: 'Тип документа', promptPh: 'например, короткий рассказ о ребенке, который находит робота...', clear: 'Очистить', start: 'Начать создание', preview: 'Предпросмотр', share: 'Поделиться', save: 'Сохранить', previewTitle: 'Предпросмотр', contentSaved: 'Содержимое сохранено!', contentCopied: 'Содержимое скопировано!', close: 'Закрыть' },
    pl: { title: "Co chcesz stworzyć?", docType: "Typ dokumentu", promptPh: "np. opowiadanie o dziecku, które znajduje robota na plaży...", clear: "Wyczyść", start: "Zacznij tworzyć", preview: "Podgląd", share: "Udostępnij", save: "Zapisz", previewTitle: "Podgląd", contentSaved: "Treść zapisana!", contentCopied: "Treść skopiowana!", close: "Zamknij" },
    tr: { title: "Ne oluşturmak istersiniz?", docType: "Belge türü", promptPh: "örneğin, sahilde bir robot bulan bir çocuk hakkında kısa bir hikaye...", clear: "Temizle", start: "Oluşturmaya Başla", preview: "Önizleme", share: "Paylaş", save: "Kaydet", previewTitle: "Önizleme", contentSaved: "İçerik kaydedildi!", contentCopied: "İçerik kopyalandı!", close: "Kapat" },
    nl: { title: "Wat wil je maken?", docType: "Documenttype", promptPh: "bijv. een kort verhaal over een kind dat een robot op het strand vindt...", clear: "Wissen", start: "Begin met bouwen", preview: "Voorbeeld", share: "Delen", save: "Opslaan", previewTitle: "Voorbeeld", contentSaved: "Inhoud opgeslagen!", contentCopied: "Inhoud gekopieerd!", close: "Sluiten" },
    sv: { title: "Vad vill du skapa?", docType: "Dokumenttyp", promptPh: "t.ex. en novell om ett barn som hittar en robot på stranden...", clear: "Rensa", start: "Börja skapa", preview: "Förhandsgranska", share: "Dela", save: "Spara", previewTitle: "Förhandsgranska", contentSaved: "Innehåll sparat!", contentCopied: "Innehåll kopierat!", close: "Stäng" },
    zh: { title: '您想创建什么？', docType: '文档类型', promptPh: '例如，一个关于孩子在沙滩上发现机器人的短篇故事…', clear: '清除', start: '开始创作', preview: '预览', share: '分享', save: '保存', previewTitle: '预览', contentSaved: '内容已保存！', contentCopied: '内容已复制！', close: '关闭' },
    ja: { title: '何を作成しますか？', docType: 'ドキュメントの種類', promptPh: '例：ビーチでロボットを見つけた子供の短編小説…', clear: 'クリア', start: '作成を開始', preview: 'プレビュー', share: '共有', save: '保存', previewTitle: 'プレビュー', contentSaved: 'コンテンツが保存されました！', contentCopied: 'コンテンツがコピーされました！', close: '閉じる' },
    ko: { title: '무엇을 만들고 싶으신가요?', docType: '문서 종류', promptPh: '예: 해변에서 로봇을 발견한 아이에 대한 짧은 이야기…', clear: '지우기', start: '만들기 시작', preview: '미리보기', share: '공유', save: '저장', previewTitle: '미리보기', contentSaved: '콘텐츠가 저장되었습니다!', contentCopied: '콘텐츠가 복사되었습니다!', close: '닫기' },
    hi: { title: "आप क्या बनाना चाहेंगे?", docType: "दस्तावेज़ का प्रकार", promptPh: "जैसे, एक बच्चे के बारे में एक छोटी कहानी जिसे समुद्र तट पर एक रोबोट मिलता है...", clear: "साफ़ करें", start: "बनाना शुरू करें", preview: "पूर्वावलोकन", share: "साझा करें", save: "सहेजें", previewTitle: "पूर्वावलोकन", contentSaved: "सामग्री सहेजी गई!", contentCopied: "सामग्री कॉपी की गई!", close: "बंद करें" },
    id: { title: "Apa yang ingin Anda buat?", docType: "Jenis Dokumen", promptPh: "misalnya, cerita pendek tentang seorang anak yang menemukan robot di pantai...", clear: "Hapus", start: "Mulai Membuat", preview: "Pratinjau", share: "Bagikan", save: "Simpan", previewTitle: "Pratinjau", contentSaved: "Konten disimpan!", contentCopied: "Konten disalin!", close: "Tutup" },
    vi: { title: "Bạn muốn tạo gì?", docType: "Loại tài liệu", promptPh: "ví dụ: một câu chuyện ngắn về một đứa trẻ tìm thấy một con robot trên bãi biển...", clear: "Xóa", start: "Bắt đầu tạo", preview: "Xem trước", share: "Chia sẻ", save: "Lưu", previewTitle: "Xem trước", contentSaved: "Nội dung đã được lưu!", contentCopied: "Đã sao chép nội dung!", close: "Đóng" },
};

type LangCode = keyof typeof DICT;

const DOC_TYPES = {
    en: { story: 'Story', article: 'Article', blog: 'Blog Post', email: 'Email', school: 'School Work', work: 'Work Document', recipe: 'Recipe', song: 'Song', poem: 'Poem' },
    he: { story: 'סיפור', article: 'מאמר', blog: 'פוסט לבלוג', email: 'אימייל', school: 'עבודה לבית הספר', work: 'מסמך עבודה', recipe: 'מתכון', song: 'שיר', poem: 'שיר' },
    ar: { story: 'قصة', article: 'مقالة', blog: 'منشور مدونة', email: 'بريد إلكتروني', school: 'عمل مدرسي', work: 'مستند عمل', recipe: 'وصفة', song: 'أغنية', poem: 'قصيدة' },
    es: { story: "Historia", article: "Artículo", blog: "Entrada de blog", email: "Correo electrónico", school: "Trabajo escolar", work: "Documento de trabajo", recipe: "Receta", song: "Canción", poem: "Poema" },
    fr: { story: "Histoire", article: "Article", blog: "Article de blog", email: "E-mail", school: "Travail scolaire", work: "Document de travail", recipe: "Recette", song: "Chanson", poem: "Poème" },
    de: { story: "Geschichte", article: "Artikel", blog: "Blogbeitrag", email: "E-Mail", school: "Schularbeit", work: "Arbeitsdokument", recipe: "Rezept", song: "Lied", poem: "Gedicht" },
    it: { story: "Storia", article: "Articolo", blog: "Post del blog", email: "Email", school: "Compito scolastico", work: "Documento di lavoro", recipe: "Ricetta", song: "Canzone", poem: "Poesia" },
    pt: { story: "História", article: "Artigo", blog: "Postagem no blog", email: "E-mail", school: "Trabalho escolar", work: "Documento de trabalho", recipe: "Receita", song: "Canção", poem: "Poema" },
    ru: { story: "История", article: "Статья", blog: "Пост в блоге", email: "Электронное письмо", school: "Школьная работа", work: "Рабочий документ", recipe: "Рецепт", song: "Песня", poem: "Стихотворение" },
    pl: { story: "Historia", article: "Artykuł", blog: "Wpis na blogu", email: "E-mail", school: "Praca szkolna", work: "Dokument roboczy", recipe: "Przepis", song: "Piosenka", poem: "Wiersz" },
    tr: { story: "Hikaye", article: "Makale", blog: "Blog Yazısı", email: "E-posta", school: "Okul Ödevi", work: "İş Belgesi", recipe: "Tarif", song: "Şarkı", poem: "Şiir" },
    nl: { story: "Verhaal", article: "Artikel", blog: "Blogbericht", email: "E-mail", school: "Schoolwerk", work: "Werkdocument", recipe: "Recept", song: "Lied", poem: "Gedicht" },
    sv: { story: "Berättelse", article: "Artikel", blog: "Blogginlägg", email: "E-post", school: "Skolarbete", work: "Arbetsdokument", recipe: "Recept", song: "Sång", poem: "Dikt" },
    zh: { story: "故事", article: "文章", blog: "博客文章", email: "电子邮件", school: "学校作业", work: "工作文件", recipe: "食谱", song: "歌曲", poem: "诗" },
    ja: { story: "物語", article: "記事", blog: "ブログ投稿", email: "Eメール", school: "学校の課題", work: "作業文書", recipe: "レシピ", song: "歌", poem: "詩" },
    ko: { story: "이야기", article: "기사", blog: "블로그 게시물", email: "이메일", school: "학교 과제", work: "업무 문서", recipe: "레시피", song: "노래", poem: "시" },
    hi: { story: "कहानी", article: "लेख", blog: "ब्लॉग पोस्ट", email: "ईमेल", school: "स्कूल का काम", work: "कार्य दस्तावेज़", recipe: "नुस्खा", song: "गीत", poem: "कविता" },
    id: { story: "Cerita", article: "Artikel", blog: "Postingan Blog", email: "Email", school: "Tugas Sekolah", work: "Dokumen Kerja", recipe: "Resep", song: "Lagu", poem: "Puisi" },
    vi: { story: "Câu chuyện", article: "Bài báo", blog: "Bài đăng trên blog", email: "Email", school: "Bài tập ở trường", work: "Tài liệu công việc", recipe: "Công thức", song: "Bài hát", poem: "Bài thơ" },
};

export default function BuilderPage() {
  const [lang, setLang] = useState<LangCode>('en');
  const [dir, setDir] = useState('ltr');
  const [isStarted, setIsStarted] = useState(false);
  const [docType, setDocType] = useState('story');
  const [prompt, setPrompt] = useState('');
  const [composedText, setComposedText] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // This component now only READS from the DOM, which is set by the provider.
    const currentLang = (document.documentElement.lang || 'en') as LangCode;
    const currentDir = document.documentElement.dir || 'ltr';
    if (currentLang in DICT) {
      setLang(currentLang);
    }
    setDir(currentDir);
  }, []);

  const t = useMemo(() => DICT[lang] || DICT.en, [lang]);
  const t_docs = useMemo(() => DOC_TYPES[lang] || DOC_TYPES.en, [lang]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleStart = () => {
    if (prompt.trim()) {
      (window as any).__builderSeed = { docType, prompt, lang, setComposedText };
      setIsStarted(true);
    }
  };
  
  const buildSentenceFromDom = (): string => {
    const words = Array.from(document.querySelectorAll('#scroller .word'));
    return words.map(w => (w as HTMLElement).innerText).join(' ');
  }

  const handleShare = async () => {
    const textToShare = composedText || buildSentenceFromDom();
    if (navigator.share && textToShare) {
      try {
        await navigator.share({ title: 'My Creation on TextSpot', text: textToShare });
      } catch (error) { console.error('Share failed:', error); }
    } else if (textToShare) {
      navigator.clipboard.writeText(textToShare);
      showToast(t.contentCopied);
    }
  };

  const handleSave = () => {
    const textToSave = composedText || buildSentenceFromDom();
    console.log("Saving content:", textToSave);
    showToast(t.contentSaved);
  };

  return (
    <div className={styles.builderPageContainer} dir={dir}>
      {!isStarted ? (
        <section className={styles.starterPanel} aria-label="Builder Starter">
          <h1 className={styles.starterTitle}>{t.title}</h1>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="doc-type-select">{t.docType}</label>
            <select id="doc-type-select" className={styles.formSelect} value={docType} onChange={(e) => setDocType(e.target.value)} dir={dir}>
              {Object.entries(t_docs).map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
            </select>
          </div>
          <div className={`${styles.formGroup} ${styles.isGrowing}`}>
            <textarea id="prompt-textarea" className={styles.formTextarea} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t.promptPh} dir={dir}/>
          </div>
          <div className={styles.starterActions}>
            <button className={styles.btnPrimary} onClick={handleStart} disabled={!prompt.trim()}>{t.start}</button>
            <button className={styles.btnSecondary} onClick={() => setPrompt('')}>{t.clear}</button>
          </div>
        </section>
      ) : (
        <>
          <main id="scroller" className={styles.scroller} aria-live="polite" />
          <div className={styles.floatingActions}>
            <button id="previewBtn" className={styles.btnPrimary}>{t.preview}</button>
            <button id="shareBtn" onClick={handleShare} className={styles.btnSecondary}>{t.share}</button>
            <button id="saveBtn" onClick={handleSave} className={styles.btnSecondary}>{t.save}</button>
          </div>
          <div id="previewModal" className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="previewTitle">
            <div className={styles.modalBackdrop}></div>
            <div className={styles.modalPanel}>
              <h2 id="previewTitle" className={styles.modalTitle}>{t.previewTitle}</h2>
              <p id="previewSentence" className={styles.previewContent}>…</p>
              <div className={styles.modalActions}>
                <button id="closePreview" className={styles.btnSecondary}>{t.close}</button>
              </div>
            </div>
          </div>
          <Script src="/builder/builder.js" strategy="afterInteractive" />
        </>
      )}
       {toastMessage && (<div className={styles.toast}>{toastMessage}</div>)}
    </div>
  );
}

