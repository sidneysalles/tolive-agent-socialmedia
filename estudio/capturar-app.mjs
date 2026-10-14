// Tira as telas do app de verdade (toLive Finanças) pra animar: o app inteiro rodando em memória sobre os dados
// simulados (o `npm run local` do tolive-financas), num celular de 390 px em 3x (1170 × 2532: aguenta a câmera
// chegar perto). Cada tela sai em dois arquivos: <nome>.png (a tela do celular) e <nome>-inteira.png (a página
// inteira, pra câmera rolar). Antes da foto, os nomes reais do modo local viram os fictícios de capturas-app.json.
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
    indice.capturas = indice.capturas.filter(x => x.nome !== c.nome);
    indice.capturas.push({ nome: c.nome, arquivo: `assets/capturas/${c.nome}.png`, inteira: `assets/capturas/${c.nome}-inteira.png`, rota: c.rota, estado: c.estado, o_que: c.o_que, largura: CONFIG.largura * CONFIG.escala, altura: CONFIG.altura * CONFIG.escala, alturaInteira: altura * CONFIG.escala });
    console.log(`ok  ${c.nome}  (${c.estado})  "${texto.split('\n').filter(Boolean).slice(3, 5).join(' / ').slice(0, 70)}"`);
  } catch (erro) {
    falhas.push(c.nome);
    console.log(`ERRO  ${c.nome}: ${String(erro.message).split('\n')[0]}`);
  }
}
await navegador.close();
writeFileSync(indiceArq, JSON.stringify(indice, null, 2) + '\n');
if (falhas.length) process.exit(1);
