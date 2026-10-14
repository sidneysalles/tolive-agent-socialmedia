// Tira as telas reais do site (tolive.app) pra animar: o curso é claro, "nunca redesenhe a interface de
// cabeça; recorte e anime a coisa de verdade". Cada elemento de capturas.json vira um PNG em 3x, com fundo
// transparente (os cantos redondos ficam limpos sobre qualquer cena), em assets/capturas/, mais um
// assets/capturas/indice.json com a data e de onde veio. Tudo ali é dado de exemplo do site (o guia proíbe
// captura com dado real de alguém).
//
//   node estudio/capturar.mjs                       do site no ar
//   node estudio/capturar.mjs --site http://localhost:4181   do site rodando ao lado (npm run local no tolive)
//   node estudio/capturar.mjs --so celular-inicio,aviso-luz

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { abrirNavegador } from './navegador.mjs';

const CONFIG = JSON.parse(readFileSync(new URL('./capturas.json', import.meta.url), 'utf8'));
const DESTINO = fileURLToPath(new URL('../assets/capturas/', import.meta.url));

const arg = (nome, padrao) => { const i = process.argv.indexOf(`--${nome}`); return i > 0 ? process.argv[i + 1] : padrao; };
const site = arg('site', 'https://tolive.app').replace(/\/$/, '');
const so = arg('so')?.split(',');

mkdirSync(DESTINO, { recursive: true });
const navegador = await abrirNavegador();
const pagina = await navegador.newPage({ viewport: { width: CONFIG.largura, height: 900 }, deviceScaleFactor: CONFIG.escala, reducedMotion: 'reduce' });
const indice = { capturado_em: new Date().toISOString(), site, escala: CONFIG.escala, largura: CONFIG.largura, capturas: [] };
const falhas = [];
let atual = null;

/**
 * Com `pecas` (um seletor dentro do elemento), o elemento sai também desmontado, como as telas do app
 * (assets/capturas/camadas/<nome>/): cada peça num PNG transparente com a posição exata, e o fundo sem elas. O filme
 * faz cada barra crescer da base (o gráfico da projeção subindo, o pedido do Sidney, out/2026).
 */
async function camadas(alvo, caixa, c) {
  const dir = `${DESTINO}camadas/${c.nome}/`;
  mkdirSync(dir, { recursive: true });
  const itens = alvo.locator(c.pecas);
  const lista = [];
  for (let i = 0; i < await itens.count(); i++) {
    const b = await itens.nth(i).boundingBox();
    const arquivo = `${String(i).padStart(2, '0')}-${c.tipoPeca ?? 'peca'}.png`;
    await itens.nth(i).screenshot({ path: dir + arquivo, omitBackground: true, animations: 'disabled' });
    lista.push({ i, tipo: c.tipoPeca ?? 'peca', arquivo, x: +(b.x - caixa.x).toFixed(1), y: +(b.y - caixa.y).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1), texto: '', conteudo: '' });
  }
  await alvo.evaluate((el, sel) => { for (const p of el.querySelectorAll(sel)) p.style.setProperty('visibility', 'hidden', 'important'); }, c.pecas);
  await alvo.screenshot({ path: dir + 'fundo.png', omitBackground: true, animations: 'disabled' });
  writeFileSync(dir + 'camadas.json', JSON.stringify({ tela: c.nome, largura: +caixa.width.toFixed(1), altura: +caixa.height.toFixed(1), escala: CONFIG.escala, fundo: 'fundo.png', semAparelho: true, pecas: lista }, null, 2) + '\n');
  return lista.length;
}

for (const c of CONFIG.capturas) {
  if (so && !so.includes(c.nome)) continue;
  try {
    if (atual !== c.pagina) { await pagina.goto(site + c.pagina, { waitUntil: 'networkidle' }); atual = c.pagina; }
    for (const clique of c.cliques ?? []) { await pagina.locator(clique).click(); await pagina.waitForTimeout(700); }
    const alvo = pagina.locator(c.seletor).first();
    await alvo.scrollIntoViewIfNeeded();
    await pagina.waitForTimeout(400);
    // fundo transparente: some o fundo de quem está atrás do elemento (CSSOM, que a CSP do site deixa)
    await alvo.evaluate(el => {
      for (let p = el.parentElement; p; p = p.parentElement) p.style.setProperty('background', 'transparent', 'important');
    });
    await alvo.screenshot({ path: `${DESTINO}${c.nome}.png`, omitBackground: true, animations: 'disabled' });
    const caixa = await alvo.boundingBox();
    const pecas = c.pecas ? await camadas(alvo, caixa, c) : undefined;
    indice.capturas.push({ nome: c.nome, arquivo: `assets/capturas/${c.nome}.png`, o_que: c.o_que, pagina: c.pagina, largura: Math.round(caixa.width * CONFIG.escala), altura: Math.round(caixa.height * CONFIG.escala), ...(pecas ? { camadas: `assets/capturas/camadas/${c.nome}/camadas.json`, pecas } : {}) });
    console.log(`ok  ${c.nome}  ${Math.round(caixa.width * CONFIG.escala)}×${Math.round(caixa.height * CONFIG.escala)}`);
    await pagina.reload({ waitUntil: 'networkidle' });
  } catch (erro) {
    falhas.push(c.nome);
    console.log(`${c.opcional ? '--' : 'ERRO'}  ${c.nome}: ${String(erro.message).split('\n')[0]}`);
  }
}
await navegador.close();
if (!so) writeFileSync(`${DESTINO}indice.json`, JSON.stringify(indice, null, 2) + '\n');
const graves = falhas.filter(n => !CONFIG.capturas.find(c => c.nome === n)?.opcional);
if (graves.length) { console.log(`\nO site mudou: ${graves.join(', ')} não acharam o seletor. Ajuste estudio/capturas.json.`); process.exit(1); }
