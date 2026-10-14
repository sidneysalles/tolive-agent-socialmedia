// O que as cenas desenham, já do jeito da marca: tipo, veredito com o ponto, cartões, pílulas, etiqueta de
// domínio, imagens recortadas, o logo e o símbolo (com o sol nascendo). Roda no navegador, sobre o canvas
// do palco. As medidas vêm em pixels do formato (multiplique pelo L.u); as cores, de cores.mjs.

import { COR, dominio } from './cores.mjs';
import { clamp } from './movimento.mjs';

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
 * dele (sol 0 → 1). tam = altura em px; traço 15/14 (o do guia pra 48 px ou mais).
 */
export function simbolo(g, x, y, tam, { sol = 1, horizonte = 1, corSol = COR.sinal, corHorizonte = COR.tinta, alfa = 1 } = {}) {
  const s = tam / 92;
  g.save(); g.globalAlpha *= alfa; g.translate(x, y); g.scale(s, s);
  if (horizonte > 0) {
    g.strokeStyle = corHorizonte; g.lineWidth = 14; g.lineCap = 'butt';
    g.beginPath(); g.arc(HORIZONTE.cx, HORIZONTE.cy, HORIZONTE.r, HORIZONTE.a0, HORIZONTE.a0 + (HORIZONTE.a1 - HORIZONTE.a0) * clamp(horizonte)); g.stroke();
  }
  solNascendo(g, clamp(sol), corSol, 15, 14);
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
