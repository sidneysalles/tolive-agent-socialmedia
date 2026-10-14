// O palco: carrega um filme (videos/<id>/filme.mjs), as fontes da marca, as imagens e o catálogo, e expõe
// window.seek(t), que pinta o quadro exato do tempo t. O render (Playwright) chama seek quadro a quadro;
// num navegador comum, a prévia toca em loop (espaço pausa, ← → andam um quadro, #t=3.2 vai pro tempo).
//
// O contrato de todo filme: pintar é função pura de t. Nada de timer, Math.random, transição de CSS ou
// estado guardado entre quadros (o mesmo t pinta sempre o mesmo quadro, em qualquer ordem).

import { layout } from './formatos.mjs';
import { COR, DOMINIO, dominio } from './cores.mjs';
import * as m from './movimento.mjs';
import * as d from './desenho.mjs';
import { oQueDizer } from './catalogo-navegador.mjs';

const qs = new URLSearchParams(location.search);
const video = qs.get('video');
const L = layout(qs.get('formato') ?? 'stories');
const render = navigator.webdriver || qs.has('render');
const FPS = Number(qs.get('fps') ?? 30);
// o tempo do começo do quadro: quem decide um corte seco (qual cena está na tela) usa este, pra o borrão de movimento
// (os subquadros dentro de um quadro) nunca misturar as duas cenas de um corte
const corte = t => Math.floor(t * FPS + 1e-6) / FPS;
if (render) document.documentElement.classList.add('render');

const canvas = document.getElementById('c');
canvas.width = L.W; canvas.height = L.H;
const g = canvas.getContext('2d');

async function fontes() {
  const lista = [
    new FontFace('Archivo Black', 'url(/marca/fontes/archivo-black-latin.woff2)', { weight: '400' }),
    new FontFace('Space Grotesk', 'url(/marca/fontes/space-grotesk-latin.woff2)', { weight: '300 700' }),
  ];
  for (const f of lista) document.fonts.add(await f.load());
  await document.fonts.ready;
}

// "marca/logo/logo-escuro.svg#sem-sol": o logo sem o traço laranja, pro desenho.logoComSol fazer o sol nascer;
// "#so-letras": só o "t" e o "Live", sem o símbolo (o símbolo solto que vira o "o" do logo)
async function endereco(src) {
  const caminho = '/' + src.replace(/^\//, '').replace(/#.*$/, '');
  if (!src.endsWith('#sem-sol') && !src.endsWith('#so-letras')) return caminho;
  const svg = await fetch(caminho).then(r => r.text());
  const recortado = src.endsWith('#so-letras')
    ? svg.replace(/<g[^>]*>[\s\S]*?<\/g>/i, '')
    : svg.replace(/<path[^>]*stroke="#(F26B3A|FF7A4A)"[^>]*\/>/i, '');
  return URL.createObjectURL(new Blob([recortado], { type: 'image/svg+xml' }));
}

async function carregar(src) {
  const url = await endereco(src);
  return new Promise((ok, falha) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => falha(new Error(`imagem não carregou: ${src}`));
    img.src = url;
  });
}

async function iniciar() {
  if (!video) throw new Error('falta ?video=videos/<id>');
  const [{ default: filme }] = await Promise.all([import(`/${video}/filme.mjs`), fontes()]);
  const img = Object.fromEntries(await Promise.all(Object.entries(filme.assets ?? {}).map(async ([nome, src]) => [nome, await carregar(src)])));
  const guardado = await fetch('/conhecimento/planos.json').then(r => (r.ok ? r.json() : null)).catch(() => null);
  const ctx = Object.freeze({ L, img, catalogo: oQueDizer(guardado?.resposta), COR, DOMINIO, dominio, m, d, fps: FPS, corte });

  const pintar = t => {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = 1;
    filme.fundo?.(g, t, ctx);
    if (filme.cenas) {
      const tc = corte(t);
      for (const cena of filme.cenas) if (tc >= cena.de && tc < cena.ate) { g.save(); cena.desenhar(g, t - cena.de, ctx, t); g.restore(); }
    }
    filme.desenhar?.(g, t, ctx);
  };
  window.filme = { duracao: filme.duracao, bpm: filme.bpm, poster: filme.poster, formato: L.nome };
  window.seek = t => { pintar(Math.min(t, filme.duracao - 1e-6)); return true; };

  if (!render) previa(filme.duracao, pintar);
  window.pronto = true;
}

function previa(duracao, pintar) {
  const rotulo = document.getElementById('tempo');
  let pausado = false, t = Number(location.hash.slice(3)) || 0, antes = performance.now();
  addEventListener('keydown', e => {
    if (e.key === ' ') { pausado = !pausado; e.preventDefault(); }
    if (e.key === 'ArrowRight') { pausado = true; t += 1 / 30; }
    if (e.key === 'ArrowLeft') { pausado = true; t = Math.max(0, t - 1 / 30); }
  });
  addEventListener('hashchange', () => { t = Number(location.hash.slice(3)) || 0; });
  (function quadro(agora) {
    if (!pausado) t = (t + (agora - antes) / 1000) % duracao;
    antes = agora;
    pintar(t);
    rotulo.textContent = `${t.toFixed(2)} s / ${duracao} s · ${L.nome}${pausado ? ' · pausado' : ''}`;
    requestAnimationFrame(quadro);
  })(performance.now());
}

iniciar().catch(erro => { window.erroDoPalco = String(erro?.stack ?? erro); console.error(erro); });
