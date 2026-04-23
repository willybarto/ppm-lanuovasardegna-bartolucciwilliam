Linee Guida: Layout & CSS per La Nuova Sardegna
La Nuova Sardegna è un quotidiano regionale online con un'architettura tipica da portale editoriale/news: dense, content-first, con gerarchie visive chiare tra notizie di primo piano, sezioni tematiche e contenuti sponsorizzati.

Art Direction & Tono
Il tono è giornalistico, istituzionale, locale-regionale. Il design deve comunicare autorevolezza e leggibilità:

Palette: neutri caldi (bianchi/grigi chiari) come superficie base, rosso/bordeaux come accent editoriale primario, nero per i titoli

Tipografia: serif per i titoli (peso narrativo), sans-serif per body e UI chrome

Densità: alta — il layout è dense, non spacioso. Ogni pixel conta.

Motion: minimo, solo transizioni hover funzionali

css
/* Art direction: Portale news regionale → autorevole, denso, leggibile
   Palette: neutri caldi + accent rosso editoriale
   Typography: Playfair Display (titoli) + Source Sans 3 (body)
   Density: alta — sezione news */
Palette Colori
css
:root, [data-theme="light"] {
  /* Superfici */
  --color-bg:           #f5f4f1;
  --color-surface:      #ffffff;
  --color-surface-2:    #f9f9f7;
  --color-border:       oklch(from #1a1a1a l c h / 0.12);
  --color-divider:      #e2e0db;

  /* Testo */
  --color-text:         #1a1a1a;
  --color-text-muted:   #5c5c5c;
  --color-text-faint:   #a0a0a0;

  /* Accent editoriale — rosso La Nuova Sardegna */
  --color-primary:      #c0001a;
  --color-primary-hover:#990014;
  --color-primary-highlight: #fce8eb;

  /* Categoria label */
  --color-category:     #c0001a;
  --color-breaking:     #d63a00;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;

  /* Shadows */
  --shadow-card: 0 1px 3px oklch(0.15 0.01 50 / 0.08);
}

[data-theme="dark"] {
  --color-bg:           #111110;
  --color-surface:      #191918;
  --color-surface-2:    #1e1e1c;
  --color-border:       oklch(from #fff l c h / 0.10);
  --color-text:         #e8e6e1;
  --color-text-muted:   #8a8882;
  --color-primary:      #ff3355;
  --color-primary-hover:#ff566e;
}
Tipografia
I portali news usano un contrasto forte tra display serif per i titoli e sans-serif pulito per il corpo .

xml
<!-- Google Fonts — Playfair Display (titoli) + Source Sans 3 (body) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Source+Sans+3:wght@300..700&display=swap" rel="stylesheet">
css
:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'Source Sans 3', 'Helvetica Neue', sans-serif;
}

/* Scala tipografica per news portal */
h1, h2, h3, h4 {
  font-family: var(--font-display);
  line-height: 1.2;
  color: var(--color-text);
}

/* Titolo articolo principale (hero) */
.headline-main {
  font-family: var(--font-display);
  font-size: var(--text-2xl);  /* clamp(2rem, 1.2rem + 2.5vw, 3.5rem) */
  font-weight: 700;
}

/* Titoli articoli card */
.headline-card {
  font-family: var(--font-display);
  font-size: var(--text-lg);   /* clamp(1.125rem, 1rem + 0.75vw, 1.5rem) */
  font-weight: 600;
}

/* Label categoria */
.category-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);   /* 12-14px */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-category);
}

/* Body articolo */
.article-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.7;
  max-width: 72ch;
}
Layout — Griglia Editoriale
Il layout è una griglia magazine a più colonne con sezioni che variano struttura, ispirato ai portali GEDI/SAE Network .

css
/* Larghezze contenitore */
:root {
  --content-narrow:  640px;
  --content-default: 980px;
  --content-wide:   1240px;
}

.container {
  max-width: var(--content-wide);
  margin-inline: auto;
  padding-inline: var(--space-4);
}

/* ── HEADER ── */
.site-header {
  display: grid;
  grid-template-rows: auto auto;
  background: var(--color-surface);
  border-bottom: 3px solid var(--color-primary);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-3);
  gap: var(--space-4);
}

.header-nav {
  display: flex;
  gap: var(--space-1);
  border-top: 1px solid var(--color-divider);
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-item {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  white-space: nowrap;
  padding: var(--space-2) var(--space-3);
  color: var(--color-text);
  text-decoration: none;
}
.nav-item:hover { color: var(--color-primary); }
.nav-item.active { color: var(--color-primary); border-bottom: 2px solid var(--color-primary); }

/* ── HOMEPAGE GRID ── */

/* Prima sezione: hero 2 colonne (main + sidebar) */
.section-hero {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-6);
  padding-block: var(--space-6);
}

/* Griglia articoli 3 colonne */
.grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

/* Griglia articoli 4 colonne (sezioni secondarie) */
.grid-4col {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

/* Layout "featured + lista" (1 big + 3 small) */
.grid-featured {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-5);
}
.grid-featured-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  border-left: 1px solid var(--color-divider);
  padding-left: var(--space-5);
}

/* Separatore di sezione */
.section-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-block: var(--space-3);
  border-top: 2px solid var(--color-primary);
  margin-bottom: var(--space-5);
}
.section-title {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-primary);
}
Card Articolo
css
.news-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  background: var(--color-surface);
}

.news-card__image {
  aspect-ratio: 16 / 9;
  width: 100%;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.news-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.news-card__headline {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-text);
  text-decoration: none;
}
.news-card__headline:hover { color: var(--color-primary); }

.news-card__byline {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* Card orizzontale (lista) */
.news-card--horizontal {
  flex-direction: row;
  gap: var(--space-3);
  padding-block: var(--space-3);
  border-top: 1px solid var(--color-divider);
}
.news-card--horizontal .news-card__image {
  width: 96px;
  height: 72px;
  aspect-ratio: auto;
  flex-shrink: 0;
}
Responsive (Mobile-First)
css
/* Mobile: 375px — tutto single column */
.section-hero,
.grid-3col,
.grid-4col,
.grid-featured {
  grid-template-columns: 1fr;
}
.grid-featured-list {
  border-left: none;
  padding-left: 0;
  border-top: 1px solid var(--color-divider);
  padding-top: var(--space-4);
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .grid-3col    { grid-template-columns: repeat(2, 1fr); }
  .grid-4col    { grid-template-columns: repeat(2, 1fr); }
  .grid-featured { grid-template-columns: 1fr 1fr; }
  .grid-featured-list { border-left: 1px solid var(--color-divider); border-top: none; padding-left: var(--space-5); padding-top: 0; }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .section-hero  { grid-template-columns: 1fr 300px; }
  .grid-3col     { grid-template-columns: repeat(3, 1fr); }
  .grid-4col     { grid-template-columns: repeat(4, 1fr); }
  .grid-featured { grid-template-columns: 2fr 1fr; }
}
Pattern Ricorrenti del Sito
Questi sono i blocchi strutturali chiave da replicare basandosi sull'analisi del sito :

Blocco	Struttura CSS	Note
Primo Piano	grid-featured (2fr + 1fr)	Articolo principale + lista verticale
Sezioni tematiche	grid-3col o grid-4col	Sport, Cultura, Italia-Mondo
Sidebar	width: 300-320px, position: sticky	Newsletter, ultimi video, pubblicità
Breaking news bar	border-left: 3px solid var(--color-breaking)	Ticker orizzontale o banner top
Video section	Griglia 2-3 col, thumbnail aspect-ratio: 16/9	Card video con overlay play
Footer	Grid 4-5 colonne, bg scuro	Link sezioni, social, legal
Quick-Start Template
xml
<!DOCTYPE html>
<html lang="it" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>La Nuova Sardegna</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@300..700&display=swap" rel="stylesheet">
  <style>
    /* 1. Incolla qui: Design Tokens + Base CSS */
    /* 2. Incolla qui: Palette & Font */
    /* 3. Incolla qui: Header, Grid, Card CSS */
  </style>
</head>
<body>
  <header class="site-header">
    <div class="container header-top">
      <!-- Logo SVG inline -->
      <nav class="header-nav">...</nav>
    </div>
  </header>
  <main class="container">
    <section class="section-hero">...</section>
    <section>
      <div class="section-header"><span class="section-title">Sardegna</span></div>
      <div class="grid-3col">...</div>
    </section>
  </main>
</body>
</html>
