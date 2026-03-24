# TODO — Configurazione Form Contatti

## Formspree (richiesto per ricevere le richieste dal sito)

1. [ ] Registrati su [formspree.io](https://formspree.io) con l'email dove vuoi ricevere le richieste
2. [ ] Crea un nuovo form nel dashboard di Formspree
3. [ ] Copia il Form ID (es. `xyzabcde`) dalla pagina del form
4. [ ] In `index.html` riga ~460, sostituisci `YOUR_FORM_ID` con il tuo ID:
   ```
   action="https://formspree.io/f/IL_TUO_ID"
   ```
5. [ ] Fai un commit e push della modifica
6. [ ] Testa il form dal sito live per verificare che le email arrivino

## Note
- Piano gratuito Formspree: 50 invii/mese
- L'email di destinazione è quella usata per la registrazione (modificabile dal dashboard)
- Nessun backend necessario, funziona tutto con GitHub Pages
