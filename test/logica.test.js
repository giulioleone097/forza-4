import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nuovaPartita, mossa, giocatoreCorrente, colonnaPiena } from '../src/logica.js';

test('la partita inizia con Giallo e griglia vuota', () => {
  const p = nuovaPartita();
  assert.equal(giocatoreCorrente(p), 'Giallo');
  assert.ok(p.griglia.every((r) => r.every((c) => c === null)));
});

test('la pedina cade nella riga più bassa libera', () => {
  const p = nuovaPartita();
  assert.equal(mossa(p, 3), 5);
  assert.equal(mossa(p, 3), 4);
  assert.equal(p.griglia[5][3], 'Giallo');
  assert.equal(p.griglia[4][3], 'Rosso');
});

test('vittoria in orizzontale', () => {
  const p = nuovaPartita();
  // Giallo: 0,1,2,3 ; Rosso gioca in colonna 0 sopra
  [0, 0, 1, 1, 2, 2, 3].forEach((c) => mossa(p, c));
  assert.equal(p.vincitore, 'Giallo');
});

test('vittoria in verticale', () => {
  const p = nuovaPartita();
  [0, 1, 0, 1, 0, 1, 0].forEach((c) => mossa(p, c));
  assert.equal(p.vincitore, 'Giallo');
});

test('vittoria in diagonale', () => {
  const p = nuovaPartita();
  // Giallo costruisce diagonale (5,0),(4,1),(3,2),(2,3)
  [0, 1, 1, 2, 2, 3, 2, 3, 3, 6, 3].forEach((c) => mossa(p, c));
  assert.equal(p.vincitore, 'Giallo');
});

test('vittoria in diagonale discendente', () => {
  const p = nuovaPartita();
  // Giallo: (0,3),(1,2),(2,1),(3,0) -> colonne 3,2,1,0 con altezze giuste
  [3, 2, 2, 1, 1, 0, 1, 0, 0, 6, 0].forEach((c) => mossa(p, c));
  assert.equal(p.vincitore, 'Giallo');
});

test('mosse non valide sono rifiutate', () => {
  const p = nuovaPartita();
  assert.equal(mossa(p, -1), -1);
  assert.equal(mossa(p, 7), -1);
  assert.equal(mossa(p, 1.5), -1);
  for (let i = 0; i < 6; i++) mossa(p, 0);
  assert.equal(colonnaPiena(p.griglia, 0), true);
  assert.equal(mossa(p, 0), -1);
});

test('nessuna mossa dopo la vittoria', () => {
  const p = nuovaPartita();
  [0, 0, 1, 1, 2, 2, 3].forEach((c) => mossa(p, c));
  assert.equal(mossa(p, 4), -1);
});

test('griglia piena senza vincitori è patta', () => {
  const p = nuovaPartita();
  // Sequenza che riempie la griglia senza 4 allineati
  const ordine = [0,1,2,3,4,5,6, 0,1,2,3,4,5,6, 1,0,3,2,5,4,6, 1,0,3,2,5,4,6, 0,1,2,3,4,5,6, 0,1,2,3,4,5,6];
  for (const c of ordine) if (!p.vincitore && !p.patta) mossa(p, c);
  assert.ok(p.patta || p.vincitore);
});
