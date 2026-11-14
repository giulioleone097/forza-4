# Forza 4

Gioco minimale di Forza 4 (Connect Four) per due giocatori sullo stesso dispositivo, in italiano.

## Avvio

Apri `index.html` nel browser, oppure avvia un server statico:

    npm start

poi visita http://localhost:8000

## Regole

- Griglia 6 righe × 7 colonne.
- Giocatori a turno (Giallo inizia) scelgono una colonna: la pedina cade nella posizione libera più bassa.
- Vince chi allinea 4 pedine in orizzontale, verticale o diagonale.
- Se la griglia si riempie senza vincitori, la partita è patta.

## Test

    npm test

## Struttura

- `src/logica.js` — logica pura di gioco (testabile, senza DOM)
- `src/app.js` — interfaccia nel browser
- `index.html`, `src/style.css` — pagina e stile
- `test/logica.test.js` — test unitari con `node:test`
