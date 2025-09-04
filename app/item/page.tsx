/* -- Item Page Styles - "Evolve" V1.0 -- */

.itemPageWrapper {
  padding: 48px 0;
  background-color: var(--background);
}

.itemPage {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.loading {
  text-align: center;
  padding: 80px;
  color: var(--muted-foreground);
}

/* -- ============================================= -- */
/* -- Item Header & Metadata -- */
/* -- ============================================= -- */

.itemHeader {
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 32px;
}

.backLink {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
  margin-bottom: 24px;
  transition: color var(--transition);
}
.backLink:hover {
  color: var(--brand-primary);
}

.category {
  font-size: 14px;
  font-weight: 600;
  color: var(--brand-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.title {
  font-family: var(--font-serif-display);
  font-size: clamp(36px, 5vw, 52px);
  line-height: 1.2;
  color: var(--foreground);
  margin-bottom: 16px;
}

.meta {
  font-size: 14px;
  color: var(--muted-foreground);
}
.author {
  font-weight: 600;
  color: var(--foreground);
}

/* -- ============================================= -- */
/* -- Equalizer Controls -- */
/* -- ============================================= -- */

.equalizer {
  margin-top: 32px;
  background-color: var(--muted);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.equalizerSection {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.equalizerTitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.controlGroup {
  display: flex;
  align-items: center;
  gap: 12px;
}
.controlGroup > span {
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
}
.controlGroup button {
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background-color: var(--card);
  color: var(--muted-foreground);
  cursor: pointer;
  transition: all var(--transition);
}
.controlGroup button:hover {
  background-color: var(--accent);
  color: var(--foreground);
}
.controlGroup button.active {
  background-color: var(--brand-primary);
  color: white;
  border-color: var(--brand-primary);
}

/* -- ============================================= -- */
/* -- Content Body -- */
/* -- ============================================= -- */

.content {
  color: var(--foreground);
  transition: all var(--transition);
}
.content p {
  line-height: 1.8;
  margin-bottom: 1em;
}

/* Font Size Classes */
.small { font-size: 16px; }
.medium { font-size: 18px; }
.large { font-size: 20px; }

/* Font Family Classes */
.serif { font-family: var(--font-serif-display); }
.sansSerif { font-family: var(--font-sans); }


/* -- ============================================= -- */
/* -- Related Content Section (Slider) -- */
/* -- ============================================= -- */
.relatedSection {
  margin-top: 64px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
}

.relatedTitle {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  padding: 0 24px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.relatedGrid {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 4px 24px 24px;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.relatedGrid::-webkit-scrollbar {
  display: none;
}

.relatedCard {
  scroll-snap-align: start;
  flex: 0 0 280px;
  height: 180px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background-color: var(--card);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all var(--transition);
}
.relatedCard:hover {
  transform: translateY(-4px);
  border-color: var(--brand-primary);
}

.relatedCategory {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
}

.relatedCardTitle {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--foreground);
}


/* -- ============================================= -- */
/* -- RTL & Responsive -- */
/* -- ============================================= -- */

html[dir="rtl"] .title,
html[dir="rtl"] .meta,
html[dir="rtl"] .content,
html[dir="rtl"] .relatedTitle {
  text-align: right;
}

html[dir="rtl"] .backLink {
  /* No change needed for arrow, it's universal */
}

@media (max-width: 768px) {
    .itemPageWrapper { padding: 24px 0; }
    .itemPage { padding: 0 16px; }
    .title { font-size: 32px; }
    .equalizer { flex-direction: column; }
    .relatedGrid { padding: 4px 16px 16px; }
    .relatedCard { flex: 0 0 240px; }
}
