// O movimento dos vídeos: tudo é função pura do tempo (t em segundos), pra que o quadro 812 saia igual
// sem simular os 811 de antes e o render seja idêntico a cada vez. Roda no navegador (o palco) e no Node
// (os testes). Nada de Math.random, timer, transição de CSS ou estado guardado entre quadros.
//
// A marca manda no feitio (guia, seção 6): "tudo se move como quem chega em silêncio e senta". Por isso:
// - as molas são criticamente amortecidas ou mais (z >= 1): desaceleram e param, nunca quicam;
// - as curvas são as do guia (--chegada, --saida, --troca) com as durações dos tokens;
// - entrada nenhuma passa de 0,6 s (o 1,2 s é só do "esvaziar a cor" do fim).

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const mix = (a, b, p) => a + (b - a) * p;

/** As durações da marca, em segundos (marca/tokens.css). */
export const DUR = Object.freeze({ rapido: 0.15, padrao: 0.25, entrada: 0.4, expressivo: 0.6, fim: 1.2, passo: 0.06 });

/** cubic-bezier(x1, y1, x2, y2) como função de p em [0, 1], resolvida por Newton com bisseção de reserva. */
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = s => ((ax * s + bx) * s + cx) * s;
  const Y = s => ((ay * s + by) * s + cy) * s;
  const dX = s => (3 * ax * s + 2 * bx) * s + cx;
  return p => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let s = p;
    for (let i = 0; i < 8; i++) {
      const e = X(s) - p, d = dX(s);
      if (Math.abs(e) < 1e-6) return Y(s);
      if (Math.abs(d) < 1e-6) break;
      s -= e / d;
    }
    let lo = 0, hi = 1; s = p;
    for (let i = 0; i < 30; i++) { if (X(s) < p) lo = s; else hi = s; s = (lo + hi) / 2; }
    return Y(s);
  };
}

/** As curvas do guia: chegada (tudo que entra), saída (tudo que vai embora), troca (estado no lugar). */
export const CURVA = Object.freeze({
  chegada: bezier(0.2, 0.8, 0.2, 1),
  saida: bezier(0.6, 0, 0.8, 0.4),
  troca: bezier(0.42, 0, 0.58, 1),
});

/** Progresso 0 → 1 de uma animação que começa em `inicio` e dura `dur`, na curva dada. */
export function anima(t, inicio, dur = DUR.entrada, curva = CURVA.chegada) {
  return curva(clamp((t - inicio) / dur));
}

/** Entrada da marca: aparece e sobe `sobe` px (8 no app; no vídeo, em unidades do layout). Devolve { a, y }. */
export function entra(t, inicio, { dur = DUR.entrada, sobe = 8 } = {}) {
  const p = anima(t, inicio, dur, CURVA.chegada);
  return { a: p, y: (1 - p) * sobe };
}

/** Saída da marca: some e desliza `vai` px na direção dada. Devolve { a, d }. */
export function sai(t, inicio, { dur = DUR.padrao, vai = 24 } = {}) {
  const p = anima(t, inicio, dur, CURVA.saida);
  return { a: 1 - p, d: p * vai };
}

/**
 * Mola fechada (0 → 1), função pura do tempo. k = rigidez, d = amortecimento. Com z = d / (2√k) >= 1 não
 * passa de 1 (sem quique); a marca só usa essas. Abaixo de 1 ela oscila — existe pra o teste provar que
 * nenhuma predefinição cai lá.
 */
export function mola(t, k = 170, d = 27) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(k), z = d / (2 * w0);
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
  }
  if (z === 1) return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  const r1 = -w0 * (z - Math.sqrt(z * z - 1)), r2 = -w0 * (z + Math.sqrt(z * z - 1));
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

/** As molas que o estúdio usa. Todas com z >= 1 (o teste confere). */
export const MOLAS = Object.freeze({
  ui: { k: 320, d: 36 },      // botão, seletor, borda que lidera
  padrao: { k: 170, d: 27 },  // cartão, celular, câmera
  pesada: { k: 90, d: 19 },   // tipo grande, logo
});

const daMola = m => (typeof m === 'string' ? MOLAS[m] : m) ?? MOLAS.padrao;

/** mola(t - inicio) com uma predefinição pelo nome. */
export const molaEm = (t, inicio, m = 'padrao') => { const { k, d } = daMola(m); return mola(t - inicio, k, d); };

/**
 * Um valor que muda de alvo várias vezes (a câmera, o cursor, a largura de um cartão): soma uma mola por
 * mudança, cada uma começando na sua hora. Continua contínuo e ainda é função pura de t.
 * chaves: [[tempo, valor], ...] em ordem de tempo.
 */
export function trilha(t, chaves, m = 'padrao') {
  const { k, d } = daMola(m);
  let v = chaves[0][1];
  for (let i = 1; i < chaves.length; i++) v += (chaves[i][1] - chaves[i - 1][1]) * mola(t - chaves[i][0], k, d);
  return v;
}

/** Texto dentro de algo que troca: entra depois da troca começar, sai antes da próxima. */
export function trocaAlfa(t, tEntra, tSai = Infinity) {
  return Math.min(clamp((t - tEntra - 0.08) / 0.12), clamp((tSai - 0.1 - t) / 0.1));
}

/** Ruído com semente (mulberry32): o mesmo número a cada render. */
export function semente(n) {
  let s = n | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let x = Math.imul(s ^ (s >>> 15), 1 | s);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** A grade de batidas: o tempo da batida n (pode ser fracionária) num andamento. */
export const batida = (n, bpm) => (n * 60) / bpm;
/** O tempo do compasso n (4/4). */
export const compasso = (n, bpm) => batida(n * 4, bpm);
