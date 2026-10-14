import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MOLAS, mola, molaEm, trilha, CURVA, entra, sai, anima, semente, batida, compasso, trocaAlfa, DUR } from '../estudio/movimento.mjs';

const tempos = Array.from({ length: 400 }, (_, i) => i / 100);

test('nenhuma mola do estúdio quica (z >= 1): nunca passa de 1 e nunca volta', () => {
  for (const [nome, { k, d }] of Object.entries(MOLAS)) {
    assert.ok(d / (2 * Math.sqrt(k)) >= 1, `${nome} oscila`);
    let antes = 0;
    for (const t of tempos) {
      const v = mola(t, k, d);
      assert.ok(v <= 1 + 1e-9, `${nome} passou de 1 em ${t}`);
      assert.ok(v >= antes - 1e-9, `${nome} voltou em ${t}`);
      antes = v;
    }
    assert.ok(mola(3, k, d) > 0.98, `${nome} não assenta em 3 s`);
  }
});

test('a mola subamortecida quica (o teste acima pegaria uma predefinição errada)', () => {
  assert.ok(tempos.some(t => mola(t, 300, 10) > 1.01));
});

test('as curvas da marca começam em 0, terminam em 1 e não passam disso', () => {
  for (const [nome, c] of Object.entries(CURVA)) {
    assert.equal(c(0), 0); assert.equal(c(1), 1);
    for (let p = 0; p <= 1; p += 0.01) assert.ok(c(p) >= -1e-6 && c(p) <= 1 + 1e-6, `${nome} em ${p}`);
  }
  assert.ok(CURVA.chegada(0.5) > 0.8, 'a chegada desacelera no fim (quase toda no começo)');
  assert.ok(CURVA.saida(0.5) < 0.3, 'a saída acelera no fim');
});

test('entrada e saída ficam dentro das durações da marca', () => {
  assert.equal(entra(1 + DUR.entrada, 1).a, 1);
  assert.equal(entra(1, 1).a, 0);
  assert.equal(sai(2 + DUR.padrao, 2).a, 0);
  assert.equal(anima(5, 1, DUR.expressivo), 1);
  assert.ok(Object.values(DUR).every(d => d <= 0.6 || d === DUR.fim), 'nada passa de 600 ms, fora o fim');
});

test('a trilha é contínua e chega em cada alvo', () => {
  const chaves = [[0, 0], [1, 100], [2, 40]];
  assert.ok(Math.abs(trilha(1.99, chaves) - 100) < 2);
  assert.ok(Math.abs(trilha(5, chaves) - 40) < 0.5);
  for (let t = 0; t < 4; t += 0.01) assert.ok(Math.abs(trilha(t + 0.01, chaves) - trilha(t, chaves)) < 5, `pulo em ${t}`);
  assert.equal(molaEm(0, 0), 0);
});

test('tudo é função pura do tempo: a mesma semente dá a mesma sequência', () => {
  const a = semente(7), b = semente(7);
  for (let i = 0; i < 50; i++) assert.equal(a(), b());
  assert.notEqual(semente(7)(), semente(8)());
});

test('a grade de batidas e a troca de texto', () => {
  assert.equal(batida(4, 120), 2);
  assert.equal(compasso(1, 90), (4 * 60) / 90);
  assert.equal(trocaAlfa(0, 1, 3), 0);
  assert.equal(trocaAlfa(2, 1, 3), 1);
  assert.equal(trocaAlfa(3, 1, 3), 0);
});
