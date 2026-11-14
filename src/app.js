import { nuovaPartita, mossa, giocatoreCorrente, colonnaPiena, COLONNE, RIGHE } from './logica.js';

const tabellone = document.getElementById('tabellone');
const stato = document.getElementById('stato');
const COL = { Rosso: 'var(--rosso)', Giallo: 'var(--giallo)' };

let partita = nuovaPartita();
let focus = 3;
let ultima = null; // { riga, col }
let vincenti = [];

const finita = () => !!(partita.vincitore || partita.patta);

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
  ultima = { riga, col: c };
  vincenti = partita.vincitore ? celleVincenti(riga, c) : [];
  focus = c;
  disegna();
}

function disegna() {
  tabellone.innerHTML = '';
  const corrente = giocatoreCorrente(partita);
  for (let r = 0; r < RIGHE; r++) {
    for (let c = 0; c < COLONNE; c++) {
      const v = partita.griglia[r][c];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cella' + (v ? ' ' + v : '');
      b.dataset.col = c;
      b.setAttribute('aria-label', `Colonna ${c + 1}, riga ${r + 1}${v ? ': ' + v : ''}`);
      b.tabIndex = -1;
      b.disabled = finita() || colonnaPiena(partita.griglia, c);
      if (ultima && ultima.riga === r && ultima.col === c) { b.classList.add('nuova'); b.style.setProperty('--da', r + 1); }
      if (vincenti.some(([y, x]) => y === r && x === c)) b.classList.add('vincente');
      tabellone.appendChild(b);
    }
  }
  if (partita.vincitore) stato.innerHTML = `🏆 Ha vinto <span class="dot" style="--c:${COL[partita.vincitore]}"></span>${partita.vincitore}!`;
  else if (partita.patta) stato.textContent = 'Partita patta!';
  else stato.innerHTML = `Turno: <span class="dot" style="--c:${COL[corrente]}"></span>${corrente}`;
  anteprima(focus);
}

// Mostra dove cadrà la pedina nella colonna indicata.
function anteprima(c) {
  tabellone.querySelectorAll('.anteprima,.focus').forEach((e) => e.classList.remove('anteprima', 'focus'));
  if (finita() || c == null || colonnaPiena(partita.griglia, c)) return;
  let r = RIGHE - 1;
  while (partita.griglia[r][c] !== null) r--;
  const cella = tabellone.children[r * COLONNE + c];
  cella.classList.add('anteprima');
  cella.style.setProperty('--c', COL[giocatoreCorrente(partita)]);
  tabellone.children[c].classList.add('focus');
}

const colDa = (e) => { const b = e.target.closest('.cella'); return b ? Number(b.dataset.col) : null; };
tabellone.addEventListener('click', (e) => { const c = colDa(e); if (c !== null) gioca(c); });
tabellone.addEventListener('pointerover', (e) => { const c = colDa(e); if (c !== null && e.pointerType === 'mouse') { focus = c; anteprima(c); } });

function nuova() { partita = nuovaPartita(); ultima = null; vincenti = []; disegna(); }
document.getElementById('nuova').addEventListener('click', nuova);

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (/^[1-7]$/.test(e.key)) { e.preventDefault(); gioca(Number(e.key) - 1); }
  else if (e.key === 'ArrowLeft') { focus = (focus + COLONNE - 1) % COLONNE; anteprima(focus); }
  else if (e.key === 'ArrowRight') { focus = (focus + 1) % COLONNE; anteprima(focus); }
  else if (e.key === 'ArrowDown' || (e.key === 'Enter' && document.activeElement === document.body) || e.key === ' ') { if (document.activeElement === document.body) { e.preventDefault(); gioca(focus); } }
  else if (e.key.toLowerCase() === 'n') nuova();
});

disegna();
