# Riassunto Progetto — Giacomo Zeni (Sito Personale)

## Task: Sezione "In Primo Piano" — Layout mobile snello con carosello orizzontale
**Data:** 2026-04-09
**Durata stimata:** ~10 min Claude + ~3 min prompt utente

### Modifiche effettuate
- Trasformata la griglia delle card in un carosello orizzontale con scroll snap su mobile (<600px)
- Resa la featured card (Le Fonti Awards) compatta su mobile con layout a due colonne (thumbnail + testo)
- Ridotti padding, font size e troncato il testo delle card su mobile
- Nascosta la scrollbar per un look pulito
- Desktop e tablet invariati

### Decisioni prese
- Breakpoint mobile a 600px (coerente con il breakpoint grid esistente)
- Card a 75vw / max 300px per mostrare un "peek" della card successiva e invogliare lo scroll
- Scroll snap con `scroll-snap-type: x mandatory` per un'esperienza fluida
- Featured card con thumbnail 100px a sinistra e testo troncato a 3 righe

### File toccati
- `css/style.css` — Aggiunto media query mobile per featured card e card grid; trasformata griglia in flex con overflow-x scroll su mobile
