import test from 'node:test';
import assert from 'node:assert/strict';
import { ordemDePintura, projetar } from '../estudio/cena3d.mjs';
import { parear } from '../estudio/desenho.mjs';
import { poses, CURVA } from '../estudio/movimento.mjs';

test('a peça pousada na metade de trás do aparelho inclinado é pintada depois do corpo (não some)', () => {
  // o aparelho com o topo pra perto: o fundo dele fica mais longe; a peça embaixo tem a média projetada atrás do corpo
  const cam = { rx: 8, ry: -12, distancia: 2600 };
  const corpo = { nome: 'corpo', z: 0 }, peca = { nome: 'peça', z: 1 };
  const zMedioPeca = [[-100, 500], [100, 500], [-100, 560], [100, 560]].map(([x, y]) => projetar(x, y, 1, cam).z).reduce((a, b) => a + b) / 4;
  assert.ok(zMedioPeca < 0, 'o caso do bug: pela profundidade projetada, a peça ficaria atrás do corpo');
  assert.deepEqual(ordemDePintura([peca, corpo]).map(p => p.nome), ['corpo', 'peça']);
});

test('o toque: o que tem o mesmo texto fica, o que mudou sai, o novo entra', () => {
  const antes = { pecas: [{ i: 0, tipo: 'veredito', conteudo: 'Faltam dez' }, { i: 1, tipo: 'bloco', conteudo: 'Certo Outra categoria' }] };
  const depois = { pecas: [{ i: 0, tipo: 'veredito', conteudo: 'Faltam nove' }, { i: 1, tipo: 'bloco', conteudo: 'Certo Outra categoria' }, { i: 2, tipo: 'aviso', conteudo: 'Desfazer' }] };
  const { par, novas } = parear(antes, depois);
  assert.equal(par.get(1).i, 1);
  assert.equal(par.has(0), false);
  assert.deepEqual(novas.map(p => p.i), [0, 2]);
});

test('a câmera anda entre as chaves e fica parada entre elas (nada flutua)', () => {
  const chaves = [[0, { escala: 1 }], [1, { escala: 2 }, 0.5], [3, { escala: 3 }, 0.5, CURVA.forte]];
  assert.equal(poses(0.9, chaves).escala, 1);
  assert.equal(poses(1.5, chaves).escala, 2);
  assert.equal(poses(2.9, chaves).escala, 2);
  assert.equal(poses(4, chaves).escala, 3);
  const meio = poses(1.25, chaves).escala;
  assert.ok(meio > 1 && meio < 2);
});
