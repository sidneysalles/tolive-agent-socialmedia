// O que as cenas desenham, já do jeito da marca: tipo, veredito com o ponto, cartões, pílulas, etiqueta de
// domínio, imagens recortadas, o logo e o símbolo (com o sol nascendo). Roda no navegador, sobre o canvas
// do palco. As medidas vêm em pixels do formato (multiplique pelo L.u); as cores, de cores.mjs.

import { COR, dominio } from './cores.mjs';
import { clamp, anima, CURVA } from './movimento.mjs';
import { ordemDeChegada } from './camadas.mjs';
import { pintar3d } from './cena3d.mjs';

export const FONTE = Object.freeze({ display: '"Archivo Black"', texto: '"Space Grotesk"' });

/** Pinta o quadro todo. */
export function fundo(g, L, cor = COR.papel) {
  g.save(); g.globalAlpha = 1; g.fillStyle = cor; g.fillRect(0, 0, L.W, L.H); g.restore();
}

function fonte(g, { tam, fonte: f = 'texto', peso = 400, letra = 0 }) {
  g.font = `${f === 'display' ? 400 : peso} ${tam}px ${FONTE[f] ?? f}`;
  g.letterSpacing = `${letra * tam}px`;
}

/** Uma linha de texto. letra = tracking em em (−0.04 no veredito). Devolve a largura. */
export function texto(g, s, x, y, { tam = 40, fonte: f = 'texto', peso = 400, cor = COR.tinta, letra = 0, alinhar = 'left', base = 'alphabetic', alfa = 1, caixaAlta = false } = {}) {
  if (alfa <= 0) return 0;
  g.save();
  fonte(g, { tam, fonte: f, peso, letra });
  g.fillStyle = cor; g.globalAlpha *= alfa; g.textAlign = alinhar; g.textBaseline = base;
  const t = caixaAlta ? s.toUpperCase() : s;
  g.fillText(t, x, y);
  const w = g.measureText(t).width;
  g.restore();
  return w;
}

/** Quebra um texto em linhas que caibam em maxW, com a fonte dada. */
export function quebrar(g, s, maxW, opcoes) {
  g.save(); fonte(g, opcoes);
  const linhas = [];
  for (const paragrafo of s.split('\n')) {
    let atual = '';
    for (const palavra of paragrafo.split(' ')) {
      const tentativa = atual ? `${atual} ${palavra}` : palavra;
      if (g.measureText(tentativa).width > maxW && atual) { linhas.push(atual); atual = palavra; } else atual = tentativa;
    }
    linhas.push(atual);
  }
  g.restore();
  return linhas;
}

/** Um parágrafo quebrado em maxW. y é a linha de base da primeira linha. Devolve { linhas, h }. */
export function paragrafo(g, s, x, y, { maxW, entrelinha = 1.3, ...op } = {}) {
  const tam = op.tam ?? 40;
  const linhas = quebrar(g, s, maxW, { tam, ...op });
  linhas.forEach((l, i) => texto(g, l, x, y + i * tam * entrelinha, { ...op, tam }));
  return { linhas, h: linhas.length * tam * entrelinha };
}

/**
 * O tipo revelado por máscara (o corte de filme de produto): cada linha sobe de trás da própria base. desloc[i] é
 * 1 (escondida) → 0 (no lugar), de movimento.revela. Display em Archivo Black por padrão; devolve { h, larguras }.
 * Com ponto: o ponto final desenhado da marca na última linha (pontoEscala 0 → 1).
 */
export function textoRevelado(g, linhas, x, y, desloc, { tam = 160, fonte: f = 'display', peso = 400, cor = COR.tinta, letra = f === 'display' ? -0.04 : -0.01, entrelinha = 0.92, alinhar = 'left', ponto: comPonto = false, corPonto = COR.sinal, pontoEscala = 1, maxW = Infinity } = {}) {
  let t = tam;
  if (Number.isFinite(maxW)) {
    g.save(); fonte(g, { tam: t, fonte: f, peso, letra });
    const maior = Math.max(...linhas.map(l => g.measureText(l).width)) + (comPonto ? t * 0.3 : 0);
    g.restore();
    if (maior > maxW) t *= maxW / maior;
  }
  const passo = t * entrelinha, larguras = [];
  linhas.forEach((l, i) => {
    const d = Array.isArray(desloc) ? desloc[i] ?? 1 : desloc;
    const yy = y + i * passo;
    g.save();
    g.beginPath(); g.rect(-1e4, yy - t * 1.02, 2e4, t * 1.3); g.clip();
    const w = texto(g, l, x, yy + d * t * 1.15, { tam: t, fonte: f, peso, cor, letra, alinhar });
    larguras.push(w);
    if (comPonto && i === linhas.length - 1) {
      const x0 = alinhar === 'center' ? x - w / 2 : alinhar === 'right' ? x - w : x;
      const r = (t * 0.21) / 2;
      ponto(g, x0 + w + t * 0.09 + r, yy + d * t * 1.15 - r, r * clamp(pontoEscala, 0, 1), corPonto);
    }
    g.restore();
  });
  return { h: linhas.length * passo, larguras, tam: t };
}

/**
 * A câmera: escala em volta de um ponto focal e desloca (dx, dy). Chame com g.save() antes e g.restore() depois do
 * que ela filma. Sem rotação (o guia: nada gira).
 */
export function camera(g, { escala = 1, fx = 0, fy = 0, dx = 0, dy = 0 } = {}) {
  g.translate(fx + dx, fy + dy); g.scale(escala, escala); g.translate(-fx, -fy);
}

/** Um círculo cheio. */
export function ponto(g, x, y, r, cor = COR.sinal, alfa = 1) {
  if (r <= 0 || alfa <= 0) return;
  g.save(); g.globalAlpha *= alfa; g.fillStyle = cor; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.restore();
}

/**
 * O veredito: Archivo Black, tracking −0.04em, entrelinha 0.92, e o ponto final desenhado (0,21 em de
 * diâmetro, 0,05 em de margem, na linha de base), nunca o ponto da fonte. pontoEscala anima o ponto
 * assentando (0 → 1, guia: depois do veredito, 250 ms). Escreva o texto SEM o ponto final.
 * linhas: força a quebra (array); com maxW, o tamanho encolhe até a linha mais larga caber. alfas: um alfa por
 * linha (entrada em sequência). Passe sempre maxW: L.seguro.w (texto fora da área segura some sob a interface).
 */
export function veredito(g, s, x, y, { tam: tamPedido = 140, cor = COR.tinta, corPonto = COR.sinal, pontoEscala = 1, maxW = Infinity, linhas, alfa = 1, alfas, sobe = 0, alinhar = 'left' } = {}) {
  let tam = tamPedido;
  // linhas forçadas que não cabem em maxW (com o ponto): o tamanho encolhe até caber, nunca vaza da área segura
  if (linhas && Number.isFinite(maxW)) {
    g.save(); fonte(g, { tam, fonte: 'display', letra: -0.04 });
    const maior = Math.max(...linhas.map((l, i) => g.measureText(l).width + (i === linhas.length - 1 ? tam * 0.3 : 0)));
    g.restore();
    if (maior > maxW) tam *= maxW / maior;
  }
  const op = { tam, fonte: 'display', letra: -0.04 };
  const ls = linhas ?? quebrar(g, s, maxW - tam * 0.3, op);
  const passo = tam * 0.92;
  let ultimo = { x, y, w: 0 };
  ls.forEach((l, i) => {
    const a = (alfas?.[i] ?? 1) * alfa;
    const yy = y + i * passo + (Array.isArray(sobe) ? sobe[i] ?? 0 : sobe);
    const w = texto(g, l, x, yy, { ...op, cor, alfa: a, alinhar });
    const x0 = alinhar === 'center' ? x - w / 2 : alinhar === 'right' ? x - w : x;
    ultimo = { x: x0, y: yy, w, a };
  });
  // o tracking negativo também vale depois da última letra: o ponto encosta na letra, com a margem do guia
  const r = (tam * 0.21) / 2;
  ponto(g, ultimo.x + ultimo.w + tam * 0.05 + r + tam * 0.04, ultimo.y - r, r * clamp(pontoEscala, 0, 1.2), corPonto, alfa);
  return { linhas: ls, h: ls.length * passo, larguraUltima: ultimo.w, tam };
}

/** Caminho de retângulo com cantos redondos. */
export function retangulo(g, x, y, w, h, r = 0) {
  const rr = Math.min(r, w / 2, h / 2);
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y, w, h, rr); else g.rect(x, y, w, h);
}

/** Cartão: sem sombra (a marca é plana), profundidade é tom. */
export function cartao(g, x, y, w, h, { raio = 40, cor = COR.cartao, borda, larguraBorda = 2, alfa = 1 } = {}) {
  if (alfa <= 0) return;
  g.save(); g.globalAlpha *= alfa;
  retangulo(g, x, y, w, h, raio);
  if (cor) { g.fillStyle = cor; g.fill(); }
  if (borda) { g.strokeStyle = borda; g.lineWidth = larguraBorda; g.stroke(); }
  g.restore();
}

/** Pílula com texto (botão, selo). Devolve { w, h }. Botão primário: fundo tinta, texto papel, 700. */
export function pilula(g, s, x, y, { tam = 34, peso = 700, fundo: f = COR.tinta, cor = COR.papel, borda, padX = 0.9, altura = 2.2, alfa = 1, alinhar = 'left', letra = 0, caixaAlta = false } = {}) {
  g.save(); fonte(g, { tam, peso, letra });
  const tw = g.measureText(caixaAlta ? s.toUpperCase() : s).width;
  g.restore();
  const h = tam * altura, w = tw + tam * padX * 2;
  const x0 = alinhar === 'center' ? x - w / 2 : alinhar === 'right' ? x - w : x;
  cartao(g, x0, y, w, h, { raio: h / 2, cor: f, borda, larguraBorda: tam * 0.09, alfa });
  texto(g, s, x0 + w / 2, y + h / 2, { tam, peso, cor, alinhar: 'center', base: 'middle', alfa, letra, caixaAlta });
  return { w, h, x: x0 };
}

/** A etiqueta do app (pílula: fundo claro do domínio, texto no tom de texto, caixa alta 700 com +6%). */
export function etiqueta(g, app, x, y, { tam = 30, alfa = 1, texto: rotulo, alinhar = 'left' } = {}) {
  const d = dominio(app);
  return pilula(g, rotulo ?? d.nome, x, y, { tam, peso: 700, fundo: d.fundo, cor: d.texto, letra: 0.06, caixaAlta: true, altura: 1.9, padX: 0.75, alfa, alinhar });
}

/** Uma imagem com largura w (altura pela proporção), cantos opcionais. Devolve { w, h }. */
export function imagem(g, img, x, y, w, { raio = 0, alfa = 1, h: hForcada } = {}) {
  if (!img || alfa <= 0) return { w: 0, h: 0 };
  const h = hForcada ?? (w * img.naturalHeight) / img.naturalWidth;
  g.save(); g.globalAlpha *= alfa;
  if (raio) { retangulo(g, x, y, w, h, raio); g.clip(); }
  g.drawImage(img, x, y, w, h);
  g.restore();
  return { w, h };
}

/**
 * Uma tela do app (assets/capturas/app-*.png, 1170 × 2532) dentro de um celular: corpo em tinta, a tela recortada
 * com os cantos do aparelho. Sem sombra (a marca é plana). w = largura do aparelho; o resto pode sair do quadro
 * (o celular cortado embaixo é de propósito: o que importa é o veredito no topo da tela). Devolve { w, h }.
 */
export function celular(g, img, x, y, w, { alfa = 1, cor = COR.tinta } = {}) {
  if (!img || alfa <= 0) return { w: 0, h: 0 };
  const borda = w * 0.035, wt = w - 2 * borda, ht = wt * img.naturalHeight / img.naturalWidth, h = ht + 2 * borda;
  g.save(); g.globalAlpha *= alfa;
  retangulo(g, x, y, w, h, w * 0.14); g.fillStyle = cor; g.fill();
  retangulo(g, x + borda, y + borda, wt, ht, w * 0.11); g.clip();
  g.drawImage(img, x + borda, y + borda, wt, ht);
  g.restore();
  return { w, h };
}

/**
 * Uma tela do app sendo construída peça por peça dentro do celular (as camadas do capturar-app.mjs): o aparelho e o
 * fundo da tela aparecem, e cada peça (o veredito, o cartão, cada linha, o gráfico) chega de uma posição afastada e
 * encaixa no lugar exato, na ordem da leitura. No fim, a tela é idêntica à do app. As peças voam por fora da tela
 * enquanto chegam (é a "vista explodida"); o gráfico, além disso, se desenha da esquerda pra direita.
 * t = tempo desde o começo da montagem. Devolve { w, h } do aparelho.
 */
export function telaMontada(g, cam, img, apelido, x, y, w, t, { passo = 0.055, dur = 0.55, afasta = 1, cor = COR.tinta, fundoEm = -0.1 } = {}) {
  const borda = w * 0.035, wt = w - 2 * borda, s = wt / cam.largura, ht = cam.altura * s, h = ht + 2 * borda;
  const ax = x + borda, ay = y + borda;
  // o aparelho e o fundo da tela
  const pf = anima(t, fundoEm, 0.18, CURVA.forte);
  g.save(); g.globalAlpha *= pf;
  retangulo(g, x, y, w, h, w * 0.14); g.fillStyle = cor; g.fill();
  g.save(); retangulo(g, ax, ay, wt, ht, w * 0.11); g.clip();
  const fundo = img[`${apelido}:fundo`];
  if (fundo) g.drawImage(fundo, ax, ay, wt, ht);
  g.restore(); g.restore();
  // as peças, na ordem da leitura
  const ordem = ordemDeChegada(cam), meio = cam.altura / 2;
  for (const p of cam.pecas) {
    const im = img[`${apelido}:${p.i}`];
    if (!im) continue;
    const k = ordem.get(p.i), pr = anima(t, k * passo, dur, CURVA.forte);
    if (pr <= 0) continue;
    // de onde vem: de baixo e um pouco pro lado, mais longe quanto mais longe do meio; a linha vem da direita
    const linha = p.tipo === 'linha';
    const dx = (linha ? 1 : (k % 2 ? -1 : 1)) * (linha ? 160 : 46) * afasta;
    const dy = (linha ? 20 : 120 + (p.y + p.h / 2 - meio) * 0.25) * afasta;
    const esc = 1 - 0.08 * (1 - pr) * afasta;
    const px = ax + p.x * s, py = ay + p.y * s, pw = p.w * s, ph = p.h * s;
    g.save();
    g.globalAlpha *= clamp(pr * 2.5);
    g.translate(px + pw / 2 + dx * s * (1 - pr), py + ph / 2 + dy * s * (1 - pr));
    g.scale(esc, esc);
    if (p.tipo === 'grafico') { g.beginPath(); g.rect(-pw / 2, -ph / 2, pw * clamp(pr * 1.2), ph); g.clip(); }
    g.drawImage(im, -pw / 2, -ph / 2, pw, ph);
    g.restore();
  }
  return { w, h };
}

// o corpo do celular com o fundo da tela, desenhado uma vez por tela e tamanho (vira a textura do plano de trás)
const corpos = new Map();
function corpoDoCelular(cam, fundo, w, cor) {
  const chave = `${cam.tela}:${Math.round(w)}:${cor}`;
  if (corpos.has(chave)) return corpos.get(chave);
  const borda = w * 0.035, wt = w - 2 * borda, ht = cam.altura * (wt / cam.largura), h = ht + 2 * borda;
  const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h);
  const k = c.getContext('2d');
  retangulo(k, 0, 0, w, h, w * 0.14); k.fillStyle = cor; k.fill();
  k.save(); retangulo(k, borda, borda, wt, ht, w * 0.11); k.clip(); if (fundo) k.drawImage(fundo, borda, borda, wt, ht); k.restore();
  const r = { canvas: c, w, h, borda, s: wt / cam.largura };
  corpos.set(chave, r);
  return r;
}

// a tela do aparelho num canvas do tamanho do corpo (o recorte e a tela apagada)
const telas = new Map();
function telaDoCelular(corpo, cor) {
  const chave = `${corpo.canvas.width}x${corpo.canvas.height}:${cor}`;
  if (telas.has(chave)) return telas.get(chave);
  const c = document.createElement('canvas'); c.width = corpo.canvas.width; c.height = corpo.canvas.height;
  const k = c.getContext('2d'), wt = corpo.w - 2 * corpo.borda, ht = corpo.h - 2 * corpo.borda;
  retangulo(k, corpo.borda, corpo.borda, wt, ht, corpo.w * 0.11); k.fillStyle = cor; k.fill();
  telas.set(chave, c);
  return c;
}

// o toque: um círculo cinza com aro claro (aparece sobre botão escuro e sobre botão claro), desenhado uma vez
let marcaDoToque = null;
function toqueCanvas() {
  if (marcaDoToque) return marcaDoToque;
  const c = document.createElement('canvas'); c.width = c.height = 160;
  const k = c.getContext('2d');
  k.beginPath(); k.arc(80, 80, 72, 0, Math.PI * 2); k.fillStyle = COR.tinta2; k.globalAlpha = 0.55; k.fill();
  k.globalAlpha = 1; k.lineWidth = 7; k.strokeStyle = COR.papel; k.stroke();
  return (marcaDoToque = c);
}

// como cada tipo de peça troca num toque: a frase troca no lugar (sai subindo, a nova vem de baixo); o cartão e a
// linha deslizam (sai pela esquerda, o novo vem da direita, como no app); o aviso do app sobe da borda de baixo
const TROCA_NO_LUGAR = new Set(['topo', 'veredito', 'texto', 'rotulo']);

/** Pareia as peças do antes com as do depois de um toque: o mesmo tipo e o mesmo texto ficam (e só andam). */
export function parear(antes, depois) {
  const livres = [...depois.pecas];
  const par = new Map();
  for (const p of antes.pecas) {
    const j = livres.findIndex(q => q.tipo === p.tipo && (q.conteudo ?? q.texto) === (p.conteudo ?? p.texto));
    if (j >= 0) { par.set(p.i, livres[j]); livres.splice(j, 1); }
  }
  return { par, novas: livres };
}

/**
 * O app em uso, em 3D (os pedidos do Sidney, out/2026: a tela construída peça por peça como no vídeo da ElevenLabs,
 * a câmera em ângulos diferentes, o app inteiro e o foco num detalhe, o botão apertado e a confirmação do app depois).
 * O aparelho é um plano no espaço; as peças da tela (as camadas do capturar-app.mjs) chegam voando de perto de quem
 * olha e pousam no lugar, na ordem da leitura; tudo dentro da tela fica recortado por ela.
 *
 * - cam, img, apelido: a tela desmontada e o prefixo dos assets dela. Com cam.semAparelho (um cartão do site), o plano
 *   é o próprio cartão, sem o celular.
 * - w: a largura do aparelho (px do quadro, na escala 1); t: o tempo desde o começo da montagem.
 * - pose: { rx, ry (graus), escala, fx, fy (o ponto da tela do app, em px do app, que a câmera olha), x, y (onde esse
 *   ponto cai no quadro) }. Anime com m.poses (a câmera anda e para; nunca flutua).
 * - montagem: { passo, dur, profundidade }: o ritmo das peças chegando.
 * - toque: { em }: o dedo aperta o botão de cam.uso.alvo nessa hora. depois: { cam, apelido, em }: a tela depois do toque
 *   (o que é igual fica e anda até o lugar novo; o que mudou sai e o novo entra; o aviso sobe de baixo).
 * - graficos: { em, dur }: quando o gráfico se desenha (da esquerda pra direita); barras: { em, passo, dur }: cada
 *   barra cresce da base, uma depois da outra. Sem eles, o gráfico se desenha na montagem.
 * - apaga: 0 → 1, a tela apaga (a noite cobre a tela, como o celular desligando).
 */
export function app3d(g, L, { cam, img, apelido, w, t, pose, montagem = {}, toque, depois, graficos, barras, apaga = 0, cor = COR.tinta, distancia: dist = 2600 }) {
  // as distâncias em px do formato cheio, na escala do layout (a prévia de rascunho pinta em meia resolução)
  const k1 = L.u, distancia = dist * k1;
  const { passo = 0.055, dur = 0.6, profundidade = 520 } = montagem;
  const fundo = img[`${apelido}:fundo`];
  const corpo = cam.semAparelho
    ? { canvas: fundo, w, h: (w * cam.altura) / cam.largura, borda: 0, s: w / cam.largura }
    : corpoDoCelular(cam, fundo, w, cor);
  const mascara = cam.semAparelho ? fundo : telaDoCelular(corpo, cor);
  const noApp = (x, y) => [corpo.borda + x * corpo.s, corpo.borda + y * corpo.s];
  const planos = [
    { fonte: corpo.canvas, x: 0, y: 0, w: corpo.w, h: corpo.h, z: 0, alfa: anima(t, -0.1, 0.18, CURVA.forte) },
    { fonte: mascara, x: 0, y: 0, w: corpo.w, h: corpo.h, mascara: true },
  ];
  const ordem = ordemDeChegada(cam), meio = cam.altura / 2;
  const troca = depois && t >= depois.em ? parear(cam, depois.cam) : null;
  const larguraApp = cam.largura;
  let saindo = 0;
  for (const p of cam.pecas) {
    const fonte = img[`${apelido}:${p.i}`];
    const k = ordem.get(p.i), pr = p.tipo === 'barra' ? 1 : anima(t, k * passo, dur, CURVA.forte);
    if (!fonte || pr <= 0) continue;
    const linha = p.tipo === 'linha', vem = 1 - pr;
    let [x, y] = noApp(p.x, p.y), alfa = clamp(pr * 2.5);
    x += vem * (linha ? 140 : (k % 2 ? -40 : 40)) * k1;
    y += vem * (linha ? 10 : 60 + (p.y + p.h / 2 - meio) * 0.15) * k1;
    let pw = p.w * corpo.s, ph = p.h * corpo.s;
    if (troca) {
      const alvo = troca.par.get(p.i);
      if (alvo) { // fica: anda até o lugar novo
        const q = anima(t, depois.em + 0.08, 0.45, CURVA.forte);
        const [x2, y2] = noApp(alvo.x, alvo.y);
        x += (x2 - x) * q; y += (y2 - y) * q;
      } else { // sai: no lugar (sobe e some) ou deslizando pra esquerda, recortado pela tela
        const q = anima(t, depois.em + 0.03 * saindo++, 0.32, CURVA.empurra);
        if (TROCA_NO_LUGAR.has(p.tipo)) { y -= q * 18 * corpo.s; alfa *= 1 - clamp(q * 1.6); } else x -= q * larguraApp * corpo.s;
      }
    }
    const corte = p.tipo === 'grafico' ? (graficos ? anima(t, graficos.em, graficos.dur, CURVA.forte) : clamp(pr * 1.2)) : 1;
    const sobe = p.tipo === 'barra' ? (barras ? anima(t, barras.em + p.i * (barras.passo ?? 0.06), barras.dur ?? 0.5, CURVA.forte) : 1) : 1;
    planos.push({ fonte, x, y, w: pw, h: ph, z: 1 + vem * (profundidade + (k % 3) * 160) * k1, alfa, corte, sobe, recorta: true });
  }
  if (troca) { // o que só existe depois do toque: entra (a frase no lugar, o cartão pela direita, o aviso por baixo)
    troca.novas.forEach((p, n) => {
      const fonte = img[`${depois.apelido}:${p.i}`];
      if (!fonte) return;
      let [x, y] = noApp(p.x, p.y), alfa = 1;
      if (p.tipo === 'aviso') {
        y += (1 - anima(t, depois.em + 0.3, 0.5, CURVA.forte)) * (cam.altura - p.y) * corpo.s;
      } else if (TROCA_NO_LUGAR.has(p.tipo)) {
        const q = anima(t, depois.em + 0.14 + 0.04 * n, 0.4, CURVA.forte);
        y += (1 - q) * 18 * corpo.s; alfa = clamp(q * 2);
      } else {
        x += (1 - anima(t, depois.em + 0.12 + 0.04 * n, 0.5, CURVA.forte)) * larguraApp * corpo.s;
      }
      planos.push({ fonte, x, y, w: p.w * corpo.s, h: p.h * corpo.s, z: p.tipo === 'aviso' ? 2 : 1, alfa, recorta: true });
    });
  }
  if (toque && cam.uso?.alvo) { // o dedo: aparece no botão, fica um instante e some
    const a = cam.uso.alvo, r = 30 * corpo.s;
    const cresce = anima(t, toque.em - 0.1, 0.12, CURVA.forte), some = anima(t, toque.em + 0.14, 0.28, CURVA.chegada);
    if (cresce > 0 && some < 1) {
      const [x, y] = noApp(a.x + a.w / 2, a.y + a.h / 2), rr = r * (0.7 + 0.3 * cresce);
      planos.push({ fonte: toqueCanvas(), x: x - rr, y: y - rr, w: rr * 2, h: rr * 2, z: 3, alfa: cresce * (1 - some), recorta: true });
    }
  }
  if (apaga > 0) planos.push({ fonte: telaDoCelular(corpo, COR.noite), x: 0, y: 0, w: corpo.w, h: corpo.h, z: 4, alfa: clamp(apaga), recorta: true });
  const [fx, fy] = noApp(pose.fx ?? cam.largura / 2, pose.fy ?? cam.altura / 2);
  pintar3d(g, L.W, L.H, planos, { largura: corpo.w, altura: corpo.h, foco: [fx, fy], cx: pose.x, cy: pose.y, rx: pose.rx ?? 0, ry: pose.ry ?? 0, escala: pose.escala ?? 1, distancia });
  return { w: corpo.w, h: corpo.h };
}

/**
 * A montagem em 3D com a pose de antes (a primeira versão, mantida pra quem já usa): o aparelho endireita de `inicio`
 * até `fim` enquanto as peças pousam. cx = centro horizontal; topo = onde começa o aparelho.
 */
export function telaMontada3d(g, L, cam, img, apelido, cx, topo, w, t, { passo = 0.055, dur = 0.6, inicio = { rx: 22, ry: -30 }, fim = { rx: 8, ry: -12 }, profundidade = 520, cor = COR.tinta, distancia = 2600 } = {}) {
  const pg = anima(t, -0.05, passo * cam.pecas.length + dur, CURVA.forte);
  const h = (w - 2 * w * 0.035) * (cam.altura / cam.largura) + 2 * w * 0.035;
  const pose = { rx: inicio.rx + (fim.rx - inicio.rx) * pg, ry: inicio.ry + (fim.ry - inicio.ry) * pg, x: cx, y: topo + h / 2 };
  return app3d(g, L, { cam, img, apelido, w, t, pose, montagem: { passo, dur, profundidade }, cor, distancia });
}

/** O logo (um dos SVGs de marca/logo) com altura h; x pela esquerda (ou centro). Área de proteção é sua. */
export function logo(g, img, x, y, h, { alfa = 1, alinhar = 'left' } = {}) {
  const w = (h * img.naturalWidth) / img.naturalHeight;
  const x0 = alinhar === 'center' ? x - w / 2 : x;
  imagem(g, img, x0, y, w, { alfa });
  return { w, h };
}

// A geometria do símbolo (guia, seção 7), no viewBox 100 × 92.
const HORIZONTE = { cx: 50, cy: 120.67, r: 48.67, a0: Math.atan2(84 - 120.67, 18 - 50), a1: Math.atan2(84 - 120.67, 82 - 50) };
const SOL = { cx: 50, cy: 38.04, r: 30, b0: Math.atan2(57.3 - 38.04, 27 - 50), b1: Math.atan2(57.3 - 38.04, 73 - 50) + Math.PI * 2 };

/**
 * O sol nascendo de trás do horizonte, nas coordenadas do símbolo (quem chama faz o translate/scale): sobe 70
 * unidades até o lugar, recortado pelo disco do horizonte (raio + meio traço), opaco na primeira metade.
 * Nada gira, nada brilha (guia: não girar, sem efeito).
 */
function solNascendo(g, p, cor, traco, tracoHorizonte) {
  if (p <= 0) return;
  g.save();
  g.beginPath(); g.rect(-60, -120, 220, 320); g.arc(HORIZONTE.cx, HORIZONTE.cy, HORIZONTE.r + tracoHorizonte / 2, 0, Math.PI * 2); g.clip('evenodd');
  g.translate(0, (1 - p) * 70);
  g.globalAlpha *= clamp(p * 2);
  g.strokeStyle = cor; g.lineWidth = traco; g.lineCap = 'butt';
  g.beginPath(); g.arc(SOL.cx, SOL.cy, SOL.r, SOL.b0, SOL.b1); g.stroke();
  g.restore();
}

/**
 * O símbolo animável: o horizonte se desenha da esquerda pra direita (horizonte 0 → 1) e o sol nasce de trás
 * dele (sol 0 → 1). tam = altura em px; traço 15/14 (o do guia pra 48 px ou mais; o do logo é 17/16, pra quem
 * passa do símbolo solto pro símbolo dentro do logo).
 */
export function simbolo(g, x, y, tam, { sol = 1, horizonte = 1, corSol = COR.sinal, corHorizonte = COR.tinta, alfa = 1, tracoSol = 15, tracoHorizonte = 14 } = {}) {
  const s = tam / 92;
  g.save(); g.globalAlpha *= alfa; g.translate(x, y); g.scale(s, s);
  if (horizonte > 0) {
    g.strokeStyle = corHorizonte; g.lineWidth = tracoHorizonte; g.lineCap = 'butt';
    g.beginPath(); g.arc(HORIZONTE.cx, HORIZONTE.cy, HORIZONTE.r, HORIZONTE.a0, HORIZONTE.a0 + (HORIZONTE.a1 - HORIZONTE.a0) * clamp(horizonte)); g.stroke();
  }
  solNascendo(g, clamp(sol), corSol, tracoSol, tracoHorizonte);
  g.restore();
  return { w: tam * (100 / 92), h: tam };
}

/**
 * O logotipo com o sol nascendo: img é o logo SEM o sol (no filme, assets: { logo: 'marca/logo/logo-escuro.svg#sem-sol' },
 * que o palco monta tirando o traço laranja do SVG), e o sol é desenhado por cima, no lugar exato (o símbolo
 * do logo fica em translate(43.5 14.3) scale(0.612) do viewBox 289.2 × 72.1, traços 17/16).
 * h = altura do logo em px. Devolve { w, h }.
 */
export function logoComSol(g, img, x, y, h, { sol = 1, corSol = COR.sinal, alfa = 1, alinhar = 'left' } = {}) {
  const s = h / 72.1, w = 289.2 * s;
  const x0 = alinhar === 'center' ? x - w / 2 : x;
  if (alfa <= 0) return { w, h };
  imagem(g, img, x0, y, w, { alfa, h });
  g.save(); g.globalAlpha *= alfa; g.translate(x0 + 43.5 * s, y + 14.3 * s); g.scale(0.612 * s, 0.612 * s);
  solNascendo(g, clamp(sol), corSol, 17, 16);
  g.restore();
  return { w, h };
}

/** A faixa de domínio no topo (8 px no app; no vídeo, 8 × L.u × 2). */
export function faixa(g, L, app, { alfa = 1 } = {}) {
  g.save(); g.globalAlpha *= alfa; g.fillStyle = dominio(app).tom; g.fillRect(0, 0, L.W, 16 * L.u); g.restore();
}
