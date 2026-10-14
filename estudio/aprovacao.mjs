// A aprovação antes do render (pedido do Sidney, 14/10/2026: "um cenário de aprovação anterior a renderizar"):
// uma página por vídeo onde quem aprova ouve as músicas candidatas (o trecho exato que entraria) e escolhe uma ou
// pede outras, e vê os quadros-chave (cada cena assentada) e comenta ou aprova cada um. A página é um Artifact com
// o `db`: as escolhas ficam guardadas lá e o Claude as lê (ArtifactData), sem depender do chat.
//
// A ordem: a música primeiro (os cortes caem na batida dela), depois os quadros, depois o render.
//
//   node estudio/musicas.mjs videos/<id>                as candidatas (rodada nova a cada pedido de "outras")
//   node estudio/aprovacao.mjs videos/<id> quadros      os quadros-chave (filme.quadros), em JPEG
//   node estudio/aprovacao.mjs videos/<id> previa       um trecho com movimento e som (filme.previa { de, ate }), leve
//   node estudio/aprovacao.mjs videos/<id> pagina       monta aprovacao/index.html e diz o que publicar
//   node estudio/aprovacao.mjs videos/<id> registrar <decisoes.json>   guarda na ficha o que a página decidiu
//
// Publicar (o Claude): Artifact com file_path aprovacao/index.html, files = o mapa que `pagina` imprime e
// capabilities { db: {}, user: {} }; a URL vai em ficha.aprovacao.pagina e as próximas rodadas republicam nela.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { servir } from './servidor.mjs';
import { abrirNavegador } from './navegador.mjs';
import { abrirPalco, renderizar } from './render.mjs';
import { somDoVideo } from './som.mjs';
import { COR } from './cores.mjs';
import { execFileSync } from 'node:child_process';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const lerJson = (arq, padrao) => (existsSync(arq) ? JSON.parse(readFileSync(arq, 'utf8')) : padrao);

/** Os quadros-chave do filme (filme.quadros: [{ id, t, nome, texto }]) em JPEG de 540 px, por formato. */
export async function quadros(pasta, { formatos = ['stories'] } = {}) {
  const filme = (await import(pathToFileURL(join(pasta, 'filme.mjs')).href)).default;
  if (!filme.quadros?.length) throw new Error('o filme não diz os quadros-chave (export default { quadros: [{ id, t, nome, texto }] })');
  const dir = join(pasta, 'aprovacao', 'quadros');
  mkdirSync(dir, { recursive: true });
  const { url, fechar } = await servir();
  const navegador = await abrirNavegador();
  const lista = [];
  try {
    for (const formato of formatos) {
      const pagina = await abrirPalco(navegador, url, pasta, formato);
      for (const q of filme.quadros) {
        const dados = await pagina.evaluate(t => {
          window.seek(t);
          const c = document.getElementById('c'), p = document.createElement('canvas');
          p.width = 540; p.height = Math.round((540 * c.height) / c.width);
          p.getContext('2d').drawImage(c, 0, 0, p.width, p.height);
          return p.toDataURL('image/jpeg', 0.86);
        }, q.t);
        const arquivo = `quadros/${formato}-${q.id}.jpg`;
        writeFileSync(join(pasta, 'aprovacao', arquivo), Buffer.from(dados.slice(dados.indexOf(',') + 1), 'base64'));
        lista.push({ ...q, t: +q.t.toFixed(2), formato, arquivo });
      }
      await pagina.close();
    }
  } finally {
    await navegador.close();
    fechar();
  }
  const estado = { em: new Date().toISOString(), formatos, quadros: lista };
  writeFileSync(join(pasta, 'aprovacao', 'quadros.json'), JSON.stringify(estado, null, 2) + '\n');
  return estado;
}

/** Um trecho do filme com o movimento e a música, em 540 px, pra quem aprova ver como as cenas se constroem. */
export async function previa(pasta) {
  const filme = (await import(pathToFileURL(join(pasta, 'filme.mjs')).href)).default;
  const { de = 0, ate = Math.min(filme.duracao, 6) } = filme.previa ?? {};
  const [mudo] = await renderizar([pasta, '--de', String(de), '--ate', String(ate), '--sub', '4']);
  const som = await somDoVideo(pasta);
  const destino = join(pasta, 'aprovacao', 'previa.mp4');
  mkdirSync(join(pasta, 'aprovacao'), { recursive: true });
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', mudo, '-ss', String(de), '-t', String(ate - de), '-i', som,
    '-vf', 'scale=540:-2', '-c:v', 'libx264', '-crf', '24', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', destino]);
  writeFileSync(join(pasta, 'aprovacao', 'previa.json'), JSON.stringify({ em: new Date().toISOString(), de, ate, arquivo: 'previa.mp4' }, null, 2) + '\n');
  return destino;
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** A página de aprovação (aprovacao/index.html) e o mapa de arquivos a publicar junto. */
export async function pagina(pasta) {
  const filme = (await import(pathToFileURL(join(pasta, 'filme.mjs')).href)).default;
  const ficha = lerJson(join(pasta, 'ficha.json'), {});
  const musicas = lerJson(join(pasta, 'aprovacao', 'musicas.json'), { rodadas: [] });
  const qs = lerJson(join(pasta, 'aprovacao', 'quadros.json'), { quadros: [] });
  const atual = lerJson(join(pasta, 'musica.json'), null);
  const prev = lerJson(join(pasta, 'aprovacao', 'previa.json'), null);
  const rodada = musicas.rodadas.at(-1);
  // a música de hoje, cortada do mesmo jeito, pra comparar com as candidatas
  let atualNaPagina = null;
  if (atual) {
    const dur = Math.min(filme.duracao + 1, 40);
    mkdirSync(join(pasta, 'aprovacao', 'musicas'), { recursive: true });
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', String(atual.inicio), '-t', String(dur), '-i', join(RAIZ, atual.arquivo),
      '-af', `afade=t=in:d=0.05,afade=t=out:st=${dur - 1.5}:d=1.5`, '-ac', '2', '-b:a', '128k', join(pasta, 'aprovacao', 'musicas', 'atual.mp3')]);
    atualNaPagina = { id: 'atual', titulo: atual.titulo, autor: 'Kevin MacLeod', bpm: Math.round(atual.bpm), clima: 'a que está no vídeo hoje', instrumentos: '', virada: atual.virada, trecho: dur, licenca: 'CC BY 4.0', arquivo: 'musicas/atual.mp3', atual: true };
  }
  const dados = {
    video: ficha.titulo ?? filme.titulo, apelido: ficha.apelido ?? ficha.titulo ?? filme.titulo, id: filme.id, produto: ficha.produto ?? filme.produto, duracao: filme.duracao,
    rodada: rodada?.n ?? 0, gerada: new Date().toISOString(), previa: prev && { de: prev.de, ate: prev.ate, arquivo: prev.arquivo },
    atual: atual && { titulo: atual.titulo, bpm: atual.bpm },
    faixas: [...(atualNaPagina ? [atualNaPagina] : []), ...(rodada?.faixas ?? []).map(f => ({ id: f.id, titulo: f.titulo, autor: f.autor, bpm: Math.round(f.bpm), clima: f.clima, instrumentos: f.instrumentos, descricao: f.descricao, virada: f.virada, subida: f.subida, trecho: f.trecho, licenca: f.licenca, arquivo: `musicas/${f.id}.mp3` }))],
    quadros: qs.quadros.filter(q => q.formato === (qs.formatos?.[0] ?? 'stories')).map(q => ({ id: q.id, t: q.t, nome: q.nome, texto: q.texto, arquivo: q.arquivo })),
  };
  const files = Object.fromEntries([
    ...dados.faixas.map(f => [f.arquivo, relative(RAIZ, join(pasta, 'aprovacao', f.arquivo))]),
    ...dados.quadros.map(q => [q.arquivo, relative(RAIZ, join(pasta, 'aprovacao', q.arquivo))]),
    ...(dados.previa ? [[dados.previa.arquivo, relative(RAIZ, join(pasta, 'aprovacao', dados.previa.arquivo))]] : []),
  ]);
  for (const origem of Object.values(files)) if (!existsSync(join(RAIZ, origem))) throw new Error(`falta ${origem}`);
  writeFileSync(join(pasta, 'aprovacao', 'index.html'), html(dados));
  return { arquivo: relative(RAIZ, join(pasta, 'aprovacao', 'index.html')), files };
}

/** Guarda na ficha o que a página decidiu (o JSON lido do db: { musica, quadros }). */
export function registrar(pasta, decisoes) {
  const arq = join(pasta, 'ficha.json');
  const ficha = lerJson(arq, {});
  ficha.aprovacao = { ...(ficha.aprovacao ?? {}), ...decisoes, registrado_em: new Date().toISOString() };
  writeFileSync(arq, JSON.stringify(ficha, null, 2) + '\n');
  return ficha.aprovacao;
}

function html(dados) {
  // Layout: uma coluna de leitura com dois passos numerados (a ordem é a do processo: música, depois quadros);
  // a música em cartões que tocam, os quadros numa grade de celulares com o comentário embaixo de cada um.
  return `<title>Aprovação do ${esc(dados.apelido)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&display=swap">
<style>
:root {
  --papel: ${COR.papel}; --cartao: ${COR.cartao}; --tinta: ${COR.tinta}; --tinta-2: ${COR.tinta2}; --linha: ${COR.linha};
  --sinal: ${COR.sinal}; --ok: ${COR.positivo}; --ok-fundo: ${COR.positivoFundo}; --realce: ${COR.selecionado};
  --display: "Archivo Black", "Arial Black", system-ui, sans-serif;
  --texto: "Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --papel: ${COR.noite}; --cartao: ${COR.noiteCartao}; --tinta: ${COR.noiteTinta}; --tinta-2: ${COR.noiteTinta2}; --linha: ${COR.noiteLinha};
  --sinal: ${COR.noiteSinal}; --ok: ${COR.noitePositivo}; --ok-fundo: ${COR.noitePositivoFundo}; --realce: ${COR.noiteBorda}; color-scheme: dark } }
:root[data-theme="dark"] {
  --papel: ${COR.noite}; --cartao: ${COR.noiteCartao}; --tinta: ${COR.noiteTinta}; --tinta-2: ${COR.noiteTinta2}; --linha: ${COR.noiteLinha};
  --sinal: ${COR.noiteSinal}; --ok: ${COR.noitePositivo}; --ok-fundo: ${COR.noitePositivoFundo}; --realce: ${COR.noiteBorda}; color-scheme: dark }
body { background: var(--papel); color: var(--tinta); font: 16px/1.45 var(--texto);
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
main { max-width: 1080px; margin: 0 auto; padding-block: 32px 64px; display: grid; gap: 48px; }
h1, h2 { font-family: var(--display); font-weight: 400; letter-spacing: -0.03em; line-height: 0.95; margin: 0; text-wrap: balance; }
h1 { font-size: clamp(2.4rem, 7vw, 4.2rem); }
h2 { font-size: clamp(1.6rem, 4vw, 2.2rem); }
.ponto { display: inline-block; width: 0.21em; height: 0.21em; border-radius: 50%; background: var(--sinal); margin-left: 0.05em; vertical-align: baseline; }
.rotulo { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--tinta-2); margin: 0; }
p { margin: 0; max-width: 65ch; }
.apoio { color: var(--tinta-2); }
header { display: grid; gap: 14px; }
.estado { display: flex; flex-wrap: wrap; gap: 8px; }
.selo { border: 2px solid var(--linha); border-radius: 999px; padding: 4px 12px; font-size: 13px; font-weight: 700; }
.selo.ok { background: var(--ok-fundo); color: var(--ok); border-color: transparent; }
section { display: grid; gap: 20px; border-top: 2px solid var(--tinta); padding-top: 20px; }
.cabeca { display: grid; gap: 8px; }
.musicas { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 16px; }
.faixa { background: var(--cartao); border: 2px solid transparent; border-radius: 20px; padding: 18px; display: grid; gap: 12px; align-content: start; min-width: 0; }
.faixa.escolhida { border-color: var(--tinta); }
.faixa h3 { margin: 0; font-size: 20px; font-weight: 700; }
.dados { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 14px; color: var(--tinta-2); font-variant-numeric: tabular-nums; }
.descricao { font-size: 14px; color: var(--tinta-2); }
audio { width: 100%; height: 40px; }
button { font: 700 15px var(--texto); border-radius: 999px; min-height: 44px; padding: 0 20px; cursor: pointer; border: 2px solid var(--tinta); background: transparent; color: var(--tinta); }
button.primario { background: var(--tinta); color: var(--papel); }
button:focus-visible, textarea:focus-visible, input:focus-visible { outline: 2px solid var(--sinal); outline-offset: 2px; }
button:disabled { opacity: 0.5; cursor: default; }
.mais { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.mais input { flex: 1 1 240px; min-width: 0; font: 16px var(--texto); border: 2px solid var(--linha); background: var(--cartao); color: var(--tinta); border-radius: 999px; min-height: 44px; padding: 0 16px; }
.previa { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 20px; align-items: start; }
.previa video { width: 100%; height: auto; aspect-ratio: 9 / 16; border-radius: 18px; background: var(--cartao); display: block; }
@media (max-width: 640px) { .previa { grid-template-columns: 1fr; } .previa video { max-width: 320px; } }
.quadros { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr)); gap: 24px 16px; }
.quadro { display: grid; gap: 10px; align-content: start; min-width: 0; }
.quadro img { width: 100%; height: auto; aspect-ratio: 9 / 16; object-fit: cover; border-radius: 18px; background: var(--cartao); display: block; }
.quadro.aprovado img { outline: 3px solid var(--ok); outline-offset: 3px; }
.quadro h3 { margin: 0; font-size: 15px; font-weight: 700; }
.tempo { font-variant-numeric: tabular-nums; color: var(--tinta-2); font-weight: 500; }
.na-tela { font-size: 13px; color: var(--tinta-2); }
textarea { font: 15px/1.4 var(--texto); width: 100%; box-sizing: border-box; min-height: 72px; resize: vertical; border: 2px solid var(--linha); border-radius: 14px; background: var(--cartao); color: var(--tinta); padding: 10px 12px; }
label.marca { display: flex; gap: 8px; align-items: center; font-size: 14px; font-weight: 600; min-height: 44px; cursor: pointer; }
label.marca input { width: 20px; height: 20px; accent-color: var(--ok); }
.aviso { font-size: 14px; color: var(--tinta-2); min-height: 1.4em; }
.vazio { background: var(--cartao); border-radius: 20px; padding: 20px; color: var(--tinta-2); }
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
</style>
<main>
  <header>
    <p class="rotulo">Estúdio toLive · aprovação antes do render</p>
    <h1>${esc(dados.video)}<span class="ponto" aria-hidden="true"></span></h1>
    <p class="apoio">toLive ${esc(dados.produto === 'financas' ? 'Finanças' : dados.produto)} · ${String(dados.duracao).replace('.', ',')} s. Primeiro a música, porque os cortes caem na batida dela; depois os quadros. O vídeo só é renderizado com os dois aprovados.</p>
    <div class="estado" id="estado"></div>
  </header>

  <section aria-labelledby="t-musica">
    <div class="cabeca">
      <p class="rotulo">Passo 1 · rodada ${dados.rodada}</p>
      <h2 id="t-musica">Escolha a música</h2>
      <p class="apoio">Cada player toca só o trecho que entraria no vídeo, já cortado: a música sobe na hora das features. Todas são de Kevin MacLeod, licença CC BY 4.0 (o crédito vai na legenda do post).</p>
    </div>
    <div class="musicas" id="musicas"></div>
    <div class="mais">
      <input id="pedido" type="text" maxlength="200" placeholder="Nenhuma serve? Diga o que procura (mais calma, mais piano, mais energia)" aria-label="O que procura nas próximas músicas">
      <button type="button" id="pedir-mais">Quero ouvir outras 5</button>
    </div>
    <p class="aviso" id="aviso-musica" aria-live="polite"></p>
  </section>

  ${dados.previa ? `<section aria-labelledby="t-previa">
    <div class="cabeca">
      <p class="rotulo">Prévia do movimento · ${String(dados.previa.de).replace('.', ',')} a ${String(dados.previa.ate).replace('.', ',')} s</p>
      <h2 id="t-previa">As telas se constroem</h2>
    </div>
    <div class="previa">
      <video controls playsinline preload="metadata" src="${esc(dados.previa.arquivo)}"></video>
      <p class="apoio">Cada tela do app chega desmontada e se monta no celular, peça por peça, na ordem da leitura: o veredito, o cartão, os números, cada linha. São as peças da tela de verdade (dados de exemplo), não um desenho. Com som: é o trecho em que a música sobe. Comente no quadro da feature que quiser mudar.</p>
    </div>
  </section>` : ''}

  <section aria-labelledby="t-quadros">
    <div class="cabeca">
      <p class="rotulo">Passo 2</p>
      <h2 id="t-quadros">Comente os quadros</h2>
      <p class="apoio">Cada imagem é uma cena já assentada, no formato stories. Escreva o que mudar (texto, tela, ordem, cor) ou marque como aprovado. O movimento vem depois; aqui decidimos o que aparece.</p>
    </div>
    <div class="quadros" id="quadros"></div>
    <div class="mais">
      <button type="button" class="primario" id="aprovar-todos">Aprovar todos os quadros</button>
    </div>
    <p class="aviso" id="aviso-quadros" aria-live="polite"></p>
  </section>
</main>
<script type="application/json" id="dados">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>
<script>
(() => {
  const dados = JSON.parse(document.getElementById('dados').textContent);
  const estado = { escolha: null, pedido: null, quadros: {} };
  let db = null;
  const $ = id => document.getElementById(id);
  const el = (tag, attrs = {}, ...filhos) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) if (k === 'class') n.className = v; else if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v);
    for (const f of filhos) n.append(f);
    return n;
  };
  const avisar = (id, texto) => { $(id).textContent = texto; };

  function pintarEstado() {
    const caixa = $('estado'); caixa.replaceChildren();
    const faixa = dados.faixas.find(f => f.id === estado.escolha);
    caixa.append(el('span', { class: 'selo' + (faixa ? ' ok' : '') }, faixa ? 'Música: ' + faixa.titulo : 'Música: a escolher'));
    const aprovados = dados.quadros.filter(q => estado.quadros[q.id]?.aprovado).length;
    caixa.append(el('span', { class: 'selo' + (dados.quadros.length && aprovados === dados.quadros.length ? ' ok' : '') }, 'Quadros: ' + aprovados + ' de ' + dados.quadros.length + ' aprovados'));
  }

  function pintarMusicas() {
    const caixa = $('musicas'); caixa.replaceChildren();
    if (!dados.faixas.length) { caixa.append(el('p', { class: 'vazio' }, 'As músicas desta rodada ainda não foram buscadas.')); return; }
    for (const f of dados.faixas) {
      const escolhida = estado.escolha === f.id;
      const botao = el('button', { type: 'button', class: escolhida ? 'primario' : '', 'aria-pressed': String(escolhida), onclick: () => escolher(f.id) }, escolhida ? 'Escolhida' : f.atual ? 'Manter esta' : 'Escolher esta');
      caixa.append(el('article', { class: 'faixa' + (escolhida ? ' escolhida' : '') },
        ...(f.atual ? [el('p', { class: 'rotulo' }, 'No vídeo hoje')] : []),
        el('h3', {}, f.titulo),
        el('div', { class: 'dados' }, el('span', {}, f.bpm + ' BPM'), el('span', {}, 'trecho de ' + Math.round(f.trecho) + ' s'), el('span', {}, 'sobe aos ' + String(Math.round(f.virada * 10) / 10).replace('.', ',') + ' s')),
        ...(f.atual ? [] : [el('p', { class: 'descricao' }, (f.clima || '') + (f.instrumentos ? ' · ' + f.instrumentos : ''))]),
        el('audio', { controls: '', preload: 'none', src: f.arquivo }),
        botao));
    }
  }

  function pintarQuadros() {
    const caixa = $('quadros'); caixa.replaceChildren();
    if (!dados.quadros.length) { caixa.append(el('p', { class: 'vazio' }, 'Os quadros aparecem aqui quando o roteiro estiver montado.')); return; }
    dados.quadros.forEach((q, i) => {
      const salvo = estado.quadros[q.id] ?? {};
      const area = el('textarea', { id: 'c-' + q.id, placeholder: 'O que mudar neste quadro?', 'aria-label': 'O que mudar no quadro ' + (i + 1) });
      area.value = salvo.comentario ?? '';
      let espera = null;
      area.addEventListener('input', () => { clearTimeout(espera); espera = setTimeout(() => salvarQuadro(q.id, { comentario: area.value.trim() }), 900); });
      area.addEventListener('blur', () => { clearTimeout(espera); if ((salvo.comentario ?? '') !== area.value.trim()) salvarQuadro(q.id, { comentario: area.value.trim() }); });
      const marca = el('input', { type: 'checkbox', id: 'a-' + q.id });
      marca.checked = !!salvo.aprovado;
      marca.addEventListener('change', () => salvarQuadro(q.id, { aprovado: marca.checked }));
      caixa.append(el('article', { class: 'quadro' + (salvo.aprovado ? ' aprovado' : '') },
        el('img', { src: q.arquivo, alt: q.nome + ': ' + q.texto, loading: 'lazy', width: '540', height: '960' }),
        el('h3', {}, el('span', { class: 'tempo' }, (i + 1) + ' · ' + String(q.t).replace('.', ',') + ' s · '), q.nome),
        el('p', { class: 'na-tela' }, q.texto),
        area,
        el('label', { class: 'marca', for: 'a-' + q.id }, marca, 'Aprovado')));
    });
  }

  function pintar() { pintarEstado(); pintarMusicas(); pintarQuadros(); }

  async function escolher(id) {
    if (!db) { avisar('aviso-musica', 'Esta visualização não guarda escolhas. Abra a página no claude.ai, com a sua conta.'); return; }
    estado.escolha = id; pintar();
    try { await db.doc('musica/escolha').set({ faixa: id, rodada: dados.rodada, em: new Date().toISOString() }); avisar('aviso-musica', 'Escolha guardada. Diga no chat que escolheu e eu monto o filme na grade dela.'); }
    catch { avisar('aviso-musica', 'Não consegui guardar a escolha. Tente de novo em instantes.'); }
  }

  async function pedirMais() {
    if (!db) { avisar('aviso-musica', 'Esta visualização não guarda pedidos. Abra a página no claude.ai, com a sua conta.'); return; }
    const nota = $('pedido').value.trim();
    try { await db.doc('musica/pedido').set({ nota, rodada: dados.rodada, em: new Date().toISOString() }); avisar('aviso-musica', 'Pedido anotado' + (nota ? ' ("' + nota + '")' : '') + '. Diga no chat e eu trago outras 5 nesta mesma página.'); }
    catch { avisar('aviso-musica', 'Não consegui guardar o pedido. Tente de novo em instantes.'); }
  }

  async function salvarQuadro(id, mudanca) {
    if (!db) { avisar('aviso-quadros', 'Esta visualização não guarda comentários. Abra a página no claude.ai, com a sua conta.'); return; }
    const novo = { ...(estado.quadros[id] ?? {}), ...mudanca, em: new Date().toISOString() };
    estado.quadros[id] = novo;
    pintarEstado();
    try { await db.doc('quadros/' + id).set(novo); avisar('aviso-quadros', 'Guardado.'); }
    catch { avisar('aviso-quadros', 'Não consegui guardar. Tente de novo em instantes.'); }
  }

  async function aprovarTodos() {
    for (const q of dados.quadros) if (!estado.quadros[q.id]?.aprovado) await salvarQuadro(q.id, { aprovado: true });
    pintarQuadros();
    avisar('aviso-quadros', 'Todos aprovados. Diga no chat e eu renderizo.');
  }

  $('pedir-mais').addEventListener('click', pedirMais);
  $('aprovar-todos').addEventListener('click', aprovarTodos);
  pintar();

  (async () => {
    db = window.claude?.use ? await window.claude.use('db') : null;
    if (!db) { avisar('aviso-musica', 'Só leitura: para escolher e comentar, abra a página no claude.ai com a sua conta.'); return; }
    db.doc('musica/escolha').onSnapshot(s => { const d = s.data(); estado.escolha = d && d.rodada === dados.rodada ? d.faixa : null; pintarEstado(); pintarMusicas(); }, () => {});
    db.collection('quadros').onSnapshot(s => {
      let mudou = false;
      for (const doc of s.docs ?? []) { const d = doc.data(); if (JSON.stringify(estado.quadros[doc.id]) !== JSON.stringify(d)) { estado.quadros[doc.id] = d; mudou = true; } }
      if (mudou && !document.activeElement?.matches?.('textarea')) pintarQuadros();
      pintarEstado();
    }, () => {});
  })();
})();
</script>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , alvo, comando, extra] = process.argv;
  const pasta = alvo && resolve(alvo);
  if (!pasta || !existsSync(join(pasta, 'filme.mjs')) || !['quadros', 'previa', 'pagina', 'registrar'].includes(comando)) {
    console.error('uso: node estudio/aprovacao.mjs videos/<id> quadros|previa|pagina|registrar <decisoes.json>');
    process.exit(2);
  }
  if (comando === 'quadros') { const e = await quadros(pasta); console.log(`${e.quadros.length} quadros em ${relative(RAIZ, join(pasta, 'aprovacao', 'quadros'))}`); }
  if (comando === 'previa') console.log(relative(RAIZ, await previa(pasta)));
  if (comando === 'pagina') console.log(JSON.stringify(await pagina(pasta), null, 2));
  if (comando === 'registrar') console.log(JSON.stringify(registrar(pasta, JSON.parse(readFileSync(extra, 'utf8'))), null, 2));
}
