# Progetto: Progettazione e Produzione Multimediale

Questo repository contiene l'elaborato per il corso universitario di
"Progettazione e Produzione Multimediale". L'obiettivo del progetto è la
fedele riproduzione del layout della homepage di un quotidiano online sardo,
nel rispetto di rigidi vincoli tecnici, di accessibilità e di design
responsive.

💻 **Live Demo:** https://willybarto.github.io/ppm-lanuovasardegna-bartolucciwilliam/#

---

## 📌 Caratteristiche e Requisiti Soddisfatti

- **Tecnologie:** Sviluppato interamente in HTML5 semantico, CSS3 puro e
  JavaScript, sfruttando intensivamente Flexbox e CSS Grid
  per la gestione del layout, senza l'uso di framework esterni.

- **Responsività:** Design completamente responsive adattato per Desktop,
  Tablet e Mobile tramite Media Queries (`768px`, `1024px`). Su mobile è
  presente un sistema di auto-hide dell'header durante lo scroll e il
  riposizionamento dinamico della sezione video nel DOM.

- **Interattività JS:** Il progetto include funzionalità avanzate sviluppate
  in Vanilla JS: menu laterale con focus trapping, slider orizzontali
  drag-and-drop con Pointer Events API, barra di ricerca a comparsa e
  accordion nel side menu.

- **Accessibilità:** Il codice è stato ottimizzato per superare le verifiche
  del WAVE Evaluation Tool. Sono presenti attributi `alt` per le immagini,
  `aria-label` e `aria-expanded` per la navigazione, focus trapping nel menu
  laterale, skip link verso il contenuto principale, un corretto contrasto
  dei colori e una rigida gerarchia delle intestazioni HTML.

- **Contenuti Fittizi:** In conformità con le istruzioni, non sono stati
  utilizzati asset proprietari del sito originale. I testi sono stati
  sostituiti con Lorem Ipsum e le immagini con placeholder generici.


---

## 📁 Struttura del Progetto
├── index.html # Markup principale della homepage <br>
├── style.css # Foglio di stile (variabili CSS, layout, componenti)<br>
└── script.js # Logica interattiva (menu, slider, scroll, DOM) <br>


---

## 🔧 Funzionalità JavaScript

| Modulo | Descrizione |
|---|---|
| Menu Laterale | Apertura/chiusura con ARIA, focus trapping e overlay |
| Slider Scroller | Drag-and-drop su 4 sezioni (video, network, storie) |
| Search Overlay | Barra di ricerca con apertura/chiusura e tasto ESC |
| Header Auto-Hide | Nasconde l'header su scroll verso il basso (mobile) |
| DOM Reorder | Sposta la sezione video su mobile tramite `matchMedia` |
| Accordion Menu | Sezioni apribili a tendina nel side menu (≤1024px) |

---

## ♿ Accessibilità

- Skip link (`#main`) per navigazione da tastiera
- Attributi `aria-label`, `aria-expanded`, `aria-hidden` aggiornati dinamicamente
- Focus trapping nel menu laterale (compatibile con screen reader)
- Classe `.sr-only` per testi visibili solo agli screen reader
- Gerarchia corretta dei heading (`h1` → `h2` → `h3`)

---

Progetto accademico realizzato per il corso di Progettazione e Produzione
Multimediale.
