import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COR, DOMINIO } from '../estudio/cores.mjs';
import { FORMATOS, layout, formatoDoPedido } from '../estudio/formatos.mjs';
import { conferirTexto, stringsDoCodigo } from '../estudio/texto.mjs';

const tokens = readFileSync(new URL('../marca/tokens.css', import.meta.url), 'utf8');
const claro = tokens.slice(0, tokens.indexOf('@media'));
const dominios = readFileSync(new URL('../marca/dominios.css', import.meta.url), 'utf8');
const token = (css, nome) => css.match(new RegExp(`--${nome}:\\s*(#[0-9A-Fa-f]{6})`))?.[1]?.toUpperCase();

test('as cores do estúdio são as do tokens.css copiado do tolive-base', () => {
  const pares = { papel: 'pagina', cartao: 'cartao', tinta: 'tinta', tinta2: 'tinta-2', apoio: 'tinta-apoio', linha: 'linha', sinal: 'sinal', positivo: 'positivo', negativo: 'negativo', trilho: 'trilho', dado2: 'dado-2', dado3: 'dado-3', dado4: 'dado-4', dado5: 'dado-5' };
  for (const [nosso, deles] of Object.entries(pares)) assert.equal(COR[nosso], token(claro, deles), `${nosso} ≠ --${deles}`);
});

test('as cores de domínio são as do dominios.css (tema claro)', () => {
  for (const [app, d] of Object.entries(DOMINIO)) {
    const linha = dominios.split('\n').find(l => l.startsWith(`:root[data-dominio="${app}"] {`));
    assert.ok(linha, `${app} sumiu do dominios.css`);
    assert.equal(d.tom, token(linha, 'dominio')); assert.equal(d.fundo, token(linha, 'dominio-fundo'));
    assert.equal(d.texto, token(linha, 'dominio-texto')); assert.equal(d.horizonte, token(linha, 'dominio-horizonte'));
  }
});

test('nenhum arquivo do estúdio escreve hexadecimal fora de cores.mjs (nem os filmes)', async () => {
  const { readdirSync } = await import('node:fs');
  const arquivos = [
    ...readdirSync(new URL('../estudio/', import.meta.url)).filter(f => f.endsWith('.mjs') && f !== 'cores.mjs').map(f => new URL(`../estudio/${f}`, import.meta.url)),
    ...readdirSync(new URL('../videos/', import.meta.url)).map(v => new URL(`../videos/${v}/filme.mjs`, import.meta.url)),
    new URL('../estudio/modelo/filme.mjs', import.meta.url),
  ];
  for (const a of arquivos) {
    const codigo = readFileSync(a, 'utf8').replace(/\/\/.*$/gm, '');
    assert.doesNotMatch(codigo.replace(/stroke="#\(F26B3A\|FF7A4A\)"/, ''), /['"`]#[0-9A-Fa-f]{6}\b/, `${a.pathname} escreve cor`);
  }
});

test('a área segura de todo formato fica dentro do quadro', () => {
  for (const nome of Object.keys(FORMATOS)) {
    const L = layout(nome);
    assert.ok(L.seguro.x > 0 && L.seguro.y > 0 && L.seguro.direita < L.W && L.seguro.base < L.H, nome);
    assert.ok(L.seguro.w > 800 && L.seguro.h > 900, `${nome}: área segura pequena demais pra o tipo da marca`);
  }
  assert.throws(() => layout('cinema'));
});

test('o formato sai do pedido em português', () => {
  assert.equal(formatoDoPedido('um vídeo pra stories'), 'stories');
  assert.equal(formatoDoPedido('pro feed'), 'feed');
  assert.equal(formatoDoPedido('reels do Finanças'), 'reels');
  assert.equal(formatoDoPedido('pro YouTube'), 'horizontal');
  assert.equal(formatoDoPedido('qualquer coisa'), null);
});

test('a voz: o que a marca proíbe vira erro, o que ela pede passa', () => {
  const erros = s => conferirTexto(s, { precos: ['14,90'] }).filter(a => a.nivel === 'erro').length;
  for (const s of ['Não perca!', 'Oferta imperdível', 'ToLive Finanças', 'Finance ToLive', 'a Lei 10', 'Parabéns, você economizou', '💸 economize', 'a partir de R$ 14,90', 'só R$ 14,90 por mês', '30 dias grátis']) assert.ok(erros(s) > 0, s);
  for (const s of ['Tudo em ordem.', 'toLive Finanças', 'tolive.app', 'A conta de luz veio 22% acima da média. Pago mesmo assim?', 'R$ 6.840 de R$ 9.500', 'Open Finance Brasil', 'Streaming parado, R$ 39,90 por mês', 'To Live Soluções de Inteligência Artificial Ltda.']) assert.equal(erros(s), 0, s);
  assert.equal(conferirTexto('Achei 3 assinaturas')[0]?.nivel, 'aviso');
});

test('a conferência lê só as strings do código, não o código', () => {
  const s = stringsDoCodigo(`if (!a) x = 'Tudo em ordem'; // não perca!\nconst c = "#111111"; d.texto(g, \`Faltam \${n}\`)`);
  assert.deepEqual(s, ['Tudo em ordem', 'Faltam 0']);
});
