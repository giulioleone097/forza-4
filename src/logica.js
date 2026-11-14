export const RIGHE = 6;
export const COLONNE = 7;
export const GIOCATORI = ['Giallo', 'Rosso'];

export function nuovaPartita() {
  return {
    griglia: Array.from({ length: RIGHE }, () => Array(COLONNE).fill(null)),
    turno: 0,
    vincitore: null,
    patta: false,
  };
}

export function giocatoreCorrente(partita) {
  return GIOCATORI[partita.turno % 2];
}

export function colonnaPiena(griglia, col) {
  return griglia[0][col] !== null;
}

// Inserisce la pedina nella colonna indicata. Restituisce la riga usata o -1.
export function mossa(partita, col) {
  if (partita.vincitore || partita.patta) return -1;
  if (!Number.isInteger(col) || col < 0 || col >= COLONNE) return -1;
  if (colonnaPiena(partita.griglia, col)) return -1;

  let riga = RIGHE - 1;
  while (partita.griglia[riga][col] !== null) riga--;

  const colore = giocatoreCorrente(partita);
  partita.griglia[riga][col] = colore;
  partita.turno++;

  if (verificaVittoria(partita.griglia, riga, col)) {
    partita.vincitore = colore;
  } else if (partita.griglia[0].every((c) => c !== null)) {
    partita.patta = true;
  }
  return riga;
}

const DIREZIONI = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

// Controlla se la pedina in (riga, col) forma una linea di almeno 4.
export function verificaVittoria(griglia, riga, col) {
  const colore = griglia[riga][col];
  if (colore === null) return false;
  for (const [dr, dc] of DIREZIONI) {
    let conteggio = 1;
    for (const segno of [1, -1]) {
      let r = riga + dr * segno;
      let c = col + dc * segno;
      while (r >= 0 && r < RIGHE && c >= 0 && c < COLONNE && griglia[r][c] === colore) {
        conteggio++;
        r += dr * segno;
        c += dc * segno;
      }
    }
    if (conteggio >= 4) return true;
  }
  return false;
}
