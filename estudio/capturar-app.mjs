// Tira as telas do app de verdade (toLive Finanças) pra animar: o app inteiro rodando em memória sobre os dados
// simulados (o `npm run local` do tolive-financas), num celular de 390 px em 3x (1170 × 2532: aguenta a câmera
// chegar perto). Cada tela sai em dois arquivos: <nome>.png (a tela do celular) e <nome>-inteira.png (a página
// inteira, pra câmera rolar). Antes da foto, os nomes reais do modo local viram os fictícios de capturas-app.json.
//
// E cada tela sai também desmontada em camadas (assets/capturas/camadas/<nome>/): o fundo sem as peças e cada peça
// num PNG transparente com a posição exata (camadas.json). As peças são os blocos que o próprio app anima ao abrir
// (`.entra`, o padrão da marca), com as listas quebradas linha a linha e os gráficos à parte: o filme remonta a tela
// peça por peça (desenho.telaMontada), a tela de verdade sendo construída, não um print parado (o pedido do Sidney
// depois do vídeo do SFX v2 da ElevenLabs, out/2026).
//
//   (no tolive-financas, ao lado)  node local/local.mjs --dia=2026-10-13
//   node estudio/capturar-app.mjs [--so app-aprovar,app-mes]

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { abrirNavegador } from './navegador.mjs';

const CONFIG = JSON.parse(readFileSync(new URL('./capturas-app.json', import.meta.url), 'utf8'));
const DESTINO = fileURLToPath(new URL('../assets/capturas/', import.meta.url));
const arg = nome => { const i = process.argv.indexOf(`--${nome}`); return i > 0 ? process.argv[i + 1] : undefined; };
const so = arg('so')?.split(',');

try { await fetch(CONFIG.app, { signal: AbortSignal.timeout(3000) }); } catch {
  console.error(`O app não respondeu em ${CONFIG.app}. No tolive-financas: node local/local.mjs --dia=${CONFIG.dia}`);
  process.exit(1);
}

mkdirSync(DESTINO, { recursive: true });
const navegador = await abrirNavegador();
const contexto = await navegador.newContext({ viewport: { width: CONFIG.largura, height: CONFIG.altura }, deviceScaleFactor: CONFIG.escala, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
const pagina = await contexto.newPage();
const indiceArq = `${DESTINO}indice-app.json`;
const indice = existsSync(indiceArq) && so ? JSON.parse(readFileSync(indiceArq, 'utf8')) : { capturas: [] };
Object.assign(indice, { capturado_em: new Date().toISOString(), app: 'toLive Finanças (npm run local, dados simulados)', dia: CONFIG.dia, escala: CONFIG.escala });

// troca os nomes reais pelos fictícios em todo texto e atributo visível (e de novo se a tela repintar)
const trocarNomes = nomes => {
  const pares = Object.entries(nomes).sort((a, b) => b[0].length - a[0].length);
  const trocar = s => pares.reduce((t, [de, para]) => t.split(de).join(para), s);
  const varrer = raiz => {
    const andar = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    for (let n = andar.nextNode(); n; n = andar.nextNode()) { const novo = trocar(n.nodeValue); if (novo !== n.nodeValue) n.nodeValue = novo; }
    for (const el of raiz.querySelectorAll?.('[alt],[title],[aria-label]') ?? []) for (const a of ['alt', 'title', 'aria-label']) if (el.hasAttribute(a)) el.setAttribute(a, trocar(el.getAttribute(a)));
  };
  varrer(document.body);
  return document.body.innerText;
};

/**
 * Desmonta a tela visível em peças: a faixa e o topo, cada `.entra` do conteúdo (o veredito, a frase, o cartão…),
 * a lista linha a linha (o título dela e cada <li>) e o gráfico à parte. Cada peça sai com fundo transparente; o fundo
 * sai sem nenhuma delas. Só o que aparece na tela do celular (o resto não entra no vídeo).
 */
async function camadas(pagina, nome) {
  const dir = `${DESTINO}camadas/${nome}/`;
  mkdirSync(dir, { recursive: true });
  const lista = await pagina.evaluate(altura => {
    const pecas = [];
    const visivel = el => { const b = el.getBoundingClientRect(); return b.height > 4 && b.width > 4 && b.top < altura && b.bottom > 0; };
    const tipo = el => (el.matches('h1') ? 'veredito' : el.matches('.cartao-alerta, [class*="alerta"]') ? 'alerta' : el.matches('figure, .grafico, svg') ? 'grafico' : el.matches('li') ? 'linha' : el.matches('h2') ? 'rotulo' : el.matches('p') ? 'texto' : 'bloco');
    const marcar = (el, t) => { el.dataset.camada = String(pecas.length); pecas.push({ i: pecas.length, tipo: t ?? tipo(el) }); };
    for (const el of document.querySelectorAll('.faixa, header.topo')) if (visivel(el)) marcar(el, 'topo');
    const entram = [...document.querySelectorAll('main .entra')].filter(el => !el.parentElement.closest('.entra') && visivel(el));
    for (const el of entram) {
      const itens = el.querySelectorAll(':scope li, :scope figure');
      if (itens.length) {
        // a seção com lista ou gráfico: cada filho direto que não é a lista, e cada item, cada um uma peça
        for (const filho of el.querySelectorAll(':scope > *, :scope > div > *')) {
          if (!visivel(filho) || filho.querySelector('li') || filho.closest('[data-camada]')) continue;
          if (filho.matches('ul, ol')) continue;
          marcar(filho);
        }
        for (const li of el.querySelectorAll('li')) if (visivel(li) && !li.parentElement.closest('li') && !li.closest('[data-camada]')) marcar(li, 'linha');
      } else marcar(el);
    }
    return pecas.map(p => {
      const el = document.querySelector(`[data-camada="${p.i}"]`), b = el.getBoundingClientRect();
      return { ...p, x: b.left, y: b.top, w: b.width, h: b.height, texto: (el.innerText || '').trim().split('\n')[0].slice(0, 60) };
    });
  }, CONFIG.altura);
  // cada peça com fundo transparente: some o fundo de quem está atrás (CSSOM, que a CSP deixa)
  await pagina.evaluate(() => { for (const el of [document.documentElement, document.body, ...document.querySelectorAll('.casca, .casca-corpo, main')]) el.style.setProperty('background', 'transparent', 'important'); });
  for (const p of lista) {
    p.arquivo = `${String(p.i).padStart(2, '0')}-${p.tipo}.png`;
    await pagina.locator(`[data-camada="${p.i}"]`).screenshot({ path: dir + p.arquivo, omitBackground: true, animations: 'disabled' });
  }
  await pagina.evaluate(() => {
    for (const el of [document.documentElement, document.body, ...document.querySelectorAll('.casca, .casca-corpo, main')]) el.style.removeProperty('background');
    for (const el of document.querySelectorAll('[data-camada]')) el.style.setProperty('visibility', 'hidden', 'important');
  });
  await pagina.screenshot({ path: dir + 'fundo.png', animations: 'disabled' });
  await pagina.evaluate(() => { for (const el of document.querySelectorAll('[data-camada]')) { el.style.removeProperty('visibility'); delete el.dataset.camada; } });
  writeFileSync(dir + 'camadas.json', JSON.stringify({ tela: nome, largura: CONFIG.largura, altura: CONFIG.altura, escala: CONFIG.escala, fundo: 'fundo.png', pecas: lista.map(p => ({ ...p, x: +p.x.toFixed(1), y: +p.y.toFixed(1), w: +p.w.toFixed(1), h: +p.h.toFixed(1) })) }, null, 2) + '\n');
  return lista.length;
}

const falhas = [];
for (const c of CONFIG.capturas) {
  if (so && !so.includes(c.nome)) continue;
  try {
    await pagina.goto(CONFIG.app + c.rota, { waitUntil: 'networkidle' });
    await pagina.waitForTimeout(1200);
    const pular = pagina.getByText('Pular', { exact: true });
    if (await pular.isVisible().catch(() => false)) { await pular.click(); await pagina.waitForTimeout(600); }
    const texto = await pagina.evaluate(trocarNomes, CONFIG.nomes);
    const sobrou = Object.keys(CONFIG.nomes).filter(n => texto.includes(n));
    if (sobrou.length) throw new Error(`nome real na tela depois da troca: ${sobrou.join(', ')}`);
    await pagina.screenshot({ path: `${DESTINO}${c.nome}.png`, animations: 'disabled' });
    await pagina.screenshot({ path: `${DESTINO}${c.nome}-inteira.png`, fullPage: true, animations: 'disabled' });
    const altura = await pagina.evaluate(() => document.documentElement.scrollHeight);
    const pecas = await camadas(pagina, c.nome);
    indice.capturas = indice.capturas.filter(x => x.nome !== c.nome);
    indice.capturas.push({ nome: c.nome, arquivo: `assets/capturas/${c.nome}.png`, inteira: `assets/capturas/${c.nome}-inteira.png`, rota: c.rota, estado: c.estado, o_que: c.o_que, largura: CONFIG.largura * CONFIG.escala, altura: CONFIG.altura * CONFIG.escala, alturaInteira: altura * CONFIG.escala, camadas: `assets/capturas/camadas/${c.nome}/camadas.json`, pecas });
    console.log(`ok  ${c.nome}  (${c.estado}, ${pecas} peças)  "${texto.split('\n').filter(Boolean).slice(3, 5).join(' / ').slice(0, 70)}"`);
  } catch (erro) {
    falhas.push(c.nome);
    console.log(`ERRO  ${c.nome}: ${String(erro.message).split('\n')[0]}`);
  }
}
await navegador.close();
writeFileSync(indiceArq, JSON.stringify(indice, null, 2) + '\n');
if (falhas.length) process.exit(1);
