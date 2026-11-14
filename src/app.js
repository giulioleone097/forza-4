import { nuovaPartita, mossa, giocatoreCorrente, colonnaPiena, COLONNE, RIGHE } from './logica.js';

const tabellone = document.getElementById('tabellone');
const stato = document.getElementById('stato');
const COL = { Rosso: 'var(--rosso)', Giallo: 'var(--giallo)' };

let partita = nuovaPartita();
let focus = 3;
let evidenziate = []; // celle con classi transitorie (nuova/vincente)
let anteprimaCella = null;
let anteprimaCol = null;

const finita = () => !!(partita.vincitore || partita.patta);
const vibra = () => { try { navigator.vibrate?.(10); } catch {} };

// DOM costruito una sola volta.
const colonne = [];
const celle = [];
for (let c = 0; c < COLONNE; c++) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'colonna';
  b.dataset.col = c;
  b.setAttribute('aria-label', `Colonna ${c + 1}`);
  celle[c] = [];
  for (let r = 0; r < RIGHE; r++) {
    const d = document.createElement('div');
    d.className = 'cella';
    b.appendChild(d);
    celle[c][r] = d;
  }
  colonne.push(b);
  tabellone.appendChild(b);
}

function celleVincenti(r, c) {
  const g = partita.griglia, col = g[r][c];
  for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
    const linea = [[r, c]];
    for (const s of [1, -1]) {
      let y = r + dr * s, x = c + dc * s;
      while (y >= 0 && y < RIGHE && x >= 0 && x < COLONNE && g[y][x] === col) { linea.push([y, x]); y += dr * s; x += dc * s; }
    }
    if (linea.length >= 4) return linea;
  }
  return [];
}

function gioca(c) {
  if (finita() || colonnaPiena(partita.griglia, c)) return;
  const riga = mossa(partita, c);
  if (riga < 0) return;
  focus = c;
  for (const e of evidenziate) e.classList.remove('nuova', 'vincente');
  evidenziate = [];
  const cella = celle[c][riga];
  cella.classList.remove('anteprima');
  cella.classList.add(partita.griglia[riga][c], 'nuova');
  cella.style.setProperty('--da', riga + 1);
  evidenziate.push(cella);
  if (partita.vincitore) {
    for (const [y, x] of celleVincenti(riga, c)) { celle[x][y].classList.add('vincente'); evidenziate.push(celle[x][y]); }
  }
  colonne[c].classList.toggle('piena', colonnaPiena(partita.griglia, c));
  aggiornaStato();
  anteprima(focus);
  vibra();
}

function aggiornaStato() {
  if (partita.vincitore) stato.innerHTML = `🏆 Ha vinto <span class="dot" style="--c:${COL[partita.vincitore]}"></span>${partita.vincitore}!`;
  else if (partita.patta) stato.textContent = 'Partita patta!';
  else { const g = giocatoreCorrente(partita); stato.innerHTML = `Turno: <span class="dot" style="--c:${COL[g]}"></span>${g}`; }
}

// Mostra dove cadrà la pedina nella colonna indicata.
function anteprima(c) {
  if (anteprimaCella) { anteprimaCella.classList.remove('anteprima'); anteprimaCella = null; }
  if (anteprimaCol !== null) { colonne[anteprimaCol].classList.remove('focus'); anteprimaCol = null; }
  if (finita() || c == null || colonnaPiena(partita.griglia, c)) return;
  let r = RIGHE - 1;
  while (partita.griglia[r][c] !== null) r--;
  anteprimaCella = celle[c][r];
  anteprimaCella.classList.add('anteprima');
  anteprimaCella.style.setProperty('--c', COL[giocatoreCorrente(partita)]);
  anteprimaCol = c;
  colonne[c].classList.add('focus');
}

const colDa = (e) => { const b = e.target.closest('.colonna'); return b ? Number(b.dataset.col) : null; };

tabellone.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const c = colDa(e);
  if (c !== null) { e.preventDefault(); gioca(c); }
});
// Click da tastiera (Invio/spazio su colonna con focus); detail 0 = non da puntatore.
tabellone.addEventListener('click', (e) => { if (e.detail === 0) { const c = colDa(e); if (c !== null) gioca(c); } });
tabellone.addEventListener('pointerover', (e) => { const c = colDa(e); if (c !== null && e.pointerType === 'mouse') { focus = c; anteprima(c); } });
tabellone.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') anteprima(focus); });

function nuova() {
  partita = nuovaPartita();
  evidenziate = [];
  for (let c = 0; c < COLONNE; c++) {
    colonne[c].classList.remove('piena');
    for (const d of celle[c]) { d.className = 'cella'; d.style.removeProperty('--da'); d.style.removeProperty('--c'); }
  }
  anteprimaCella = null; anteprimaCol = null;
  aggiornaStato();
  anteprima(focus);
}
document.getElementById('nuova').addEventListener('click', nuova);

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const libero = document.activeElement === document.body;
  if (/^[1-7]$/.test(e.key)) { e.preventDefault(); gioca(Number(e.key) - 1); }
  else if (e.key === 'ArrowLeft') { focus = (focus + COLONNE - 1) % COLONNE; anteprima(focus); }
  else if (e.key === 'ArrowRight') { focus = (focus + 1) % COLONNE; anteprima(focus); }
  else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { if (libero) { e.preventDefault(); gioca(focus); } }
  else if (e.key.toLowerCase() === 'n') nuova();
});

aggiornaStato();
anteprima(focus);
