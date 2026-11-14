import { nuovaPartita, mossa, giocatoreCorrente, colonnaPiena, COLONNE, RIGHE } from './logica.js';

const tabellone = document.getElementById('tabellone');
const controlli = document.getElementById('controlli');
const stato = document.getElementById('stato');
const nuova = document.getElementById('nuova');

let partita = nuovaPartita();

function disegna() {
  controlli.innerHTML = '';
  tabellone.innerHTML = '';
  for (let c = 0; c < COLONNE; c++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = '↓';
    b.setAttribute('aria-label', `Colonna ${c + 1}`);
    b.disabled = !!(partita.vincitore || partita.patta) || colonnaPiena(partita.griglia, c);
    b.addEventListener('click', () => {
      mossa(partita, c);
      disegna();
    });
    controlli.appendChild(b);
  }
  for (let r = 0; r < RIGHE; r++) {
    for (let c = 0; c < COLONNE; c++) {
      const cella = document.createElement('div');
      cella.className = 'cella' + (partita.griglia[r][c] ? ' ' + partita.griglia[r][c] : '');
      tabellone.appendChild(cella);
    }
  }
  if (partita.vincitore) stato.textContent = `🏆 Ha vinto ${partita.vincitore}!`;
  else if (partita.patta) stato.textContent = 'Partita patta!';
  else stato.textContent = `Turno: ${giocatoreCorrente(partita)}`;
}

nuova.addEventListener('click', () => {
  partita = nuovaPartita();
  disegna();
});

disegna();
