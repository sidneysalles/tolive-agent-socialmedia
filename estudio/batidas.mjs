// A grade de batidas de uma música que alguém trouxe (o passo 09 do curso, sem Python): mede o andamento,
// onde cai cada batida, os compassos (as mudanças grandes vão neles) e os picos (os sons de interface vão
// neles). Quando a música é sintetizada pelo som.mjs, a grade já é conhecida e isto não é preciso.
//
//   node estudio/batidas.mjs musica.mp3 > videos/<id>/batidas.json
//   node estudio/batidas.mjs musica.mp3 --trecho 4,6     onde cortar a música pra o filme: 4 compassos calmos e a
//                                                         virada (a energia sobe) no começo dos 6 seguintes

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SR = 22050, JANELA = 1024, PASSO = 512;

function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ar = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, ai = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k + len / 2] = re[i + k] - ar; im[i + k + len / 2] = im[i + k] - ai;
        re[i + k] += ar; im[i + k] += ai;
        [cr, ci] = [cr * wr - ci * wi, cr * wi + ci * wr];
      }
    }
  }
}

/** As curvas de ataques (fluxo espectral positivo, total e só dos graves), um valor por PASSO amostras. */
export function curvaDeAtaques(amostras) {
  const quadros = Math.max(0, Math.floor((amostras.length - JANELA) / PASSO));
  const curva = new Float32Array(quadros), grave = new Float32Array(quadros);
  let antes = new Float32Array(JANELA / 2);
  const hann = Float32Array.from({ length: JANELA }, (_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / JANELA));
  for (let q = 0; q < quadros; q++) {
    const re = new Float64Array(JANELA), im = new Float64Array(JANELA);
    for (let i = 0; i < JANELA; i++) re[i] = amostras[q * PASSO + i] * hann[i];
    fft(re, im);
    const mag = new Float32Array(JANELA / 2);
    let fluxo = 0, fluxoGrave = 0;
    for (let k = 0; k < JANELA / 2; k++) {
      mag[k] = Math.log1p(100 * Math.hypot(re[k], im[k]));
      const d = Math.max(0, mag[k] - antes[k]);
      fluxo += d;
      if (k <= 12) fluxoGrave += d; // até ~260 Hz: bumbo e baixo dizem onde é o tempo
    }
    curva[q] = fluxo;
    grave[q] = fluxoGrave;
    antes = mag;
  }
  return { curva, grave };
}

/**
 * Andamento, batidas, compassos e picos (em segundos) a partir das amostras mono. `bpmPerto`: o andamento que a fonte
 * informa (o catálogo do Incompetech diz o de cada faixa): a busca fica a 6% dele, o que evita medir a metade ou o
 * dobro (a rodada 2 do "Propósito" mediu 60 numa faixa de 120 e esticou o trecho pra 56 s).
 */
export function estimarBatidas(amostras, sr = SR, { bpmPerto } = {}) {
  const { curva, grave } = curvaDeAtaques(amostras);
  const qps = sr / PASSO; // quadros por segundo
  const media = curva.reduce((a, b) => a + b, 0) / (curva.length || 1);
  const c = Float32Array.from(curva, v => Math.max(0, v - media));
  // autocorrelação nos períodos de 60 a 180 BPM, com preferência suave em torno de 100 (evita o dobro e a metade)
  let melhor = { bpm: 120, nota: -Infinity };
  const [bpmMin, bpmMax] = bpmPerto ? [bpmPerto * 0.94, bpmPerto * 1.06] : [60, 180];
  for (let bpm = bpmMin; bpm <= bpmMax; bpm += 0.25) {
    const lag = (60 / bpm) * qps;
    let soma = 0;
    for (let i = 0; i + lag + 1 < c.length; i++) {
      const j = i + lag, j0 = Math.floor(j), f = j - j0;
      soma += c[i] * (c[j0] * (1 - f) + c[j0 + 1] * f);
    }
    const nota = soma * (bpmPerto ? 1 : Math.exp(-0.5 * (Math.log2(bpm / 100) / 0.9) ** 2));
    if (nota > melhor.nota) melhor = { bpm, nota };
  }
  const periodo = (60 / melhor.bpm) * qps;
  // a fase: o deslocamento que mais cai em cima dos ataques graves (as colcheias de um arpejo enganam a curva total)
  let fase = 0, maior = -Infinity;
  for (let d = 0; d < periodo; d += 0.25) {
    let s = 0;
    for (let p = d; p < grave.length; p += periodo) s += (grave[Math.round(p)] ?? 0) + 0.25 * (c[Math.round(p)] ?? 0);
    if (s > maior) { maior = s; fase = d; }
  }
  const batidas = [];
  for (let p = fase; p < c.length; p += periodo) batidas.push(+(p / qps).toFixed(3));
  // picos: acima da média + 1,5 desvio, com 0,1 s entre um e outro
  const desvio = Math.sqrt(curva.reduce((a, v) => a + (v - media) ** 2, 0) / (curva.length || 1));
  const picos = [];
  for (let i = 1; i < curva.length - 1; i++) {
    if (curva[i] > media + 1.5 * desvio && curva[i] >= curva[i - 1] && curva[i] >= curva[i + 1]) {
      const t = i / qps;
      if (!picos.length || t - picos.at(-1) > 0.1) picos.push(+t.toFixed(3));
    }
  }
  const compassos = batidas.filter((_, i) => i % 4 === 0);
  return { bpm: +melhor.bpm.toFixed(2), batidas, compassos, picos, energia: energiaPorCompasso(amostras, sr, compassos, periodo / qps) };
}

/** A energia (dB RMS) de cada compasso, pela grade de batidas. */
export function energiaPorCompasso(amostras, sr, compassos, periodo) {
  return compassos.map(t0 => {
    const i0 = Math.floor(t0 * sr), i1 = Math.min(amostras.length, Math.floor((t0 + 4 * periodo) * sr));
    let soma = 0;
    for (let i = i0; i < i1; i++) soma += amostras[i] * amostras[i];
    return +(10 * Math.log10(soma / Math.max(1, i1 - i0) + 1e-10)).toFixed(1);
  });
}

/**
 * Onde cortar a música pra estrutura do filme: `antes` compassos mais baixos e, no compasso seguinte, a virada
 * (a energia sobe e fica em cima por `depois` compassos). Devolve os melhores começos, cada um com o tempo da
 * música em que o filme começa (`inicio`), o compasso da virada e o salto em dB.
 */
export function melhoresTrechos({ compassos, energia }, { antes = 4, depois = 6, quantos = 3 } = {}) {
  const media = l => l.reduce((a, b) => a + b, 0) / l.length;
  const opcoes = [];
  for (let c = antes; c + depois <= energia.length; c++) {
    const calmo = energia.slice(c - antes, c), cheio = energia.slice(c, c + depois);
    const salto = energia[c] - energia[c - 1];
    const nota = (media(cheio) - media(calmo)) + 0.5 * salto - 0.3 * (Math.max(...cheio) - Math.min(...cheio));
    opcoes.push({ inicio: compassos[c - antes], virada: compassos[c], compasso: c, salto: +salto.toFixed(1), subida: +(media(cheio) - media(calmo)).toFixed(1), nota: +nota.toFixed(2) });
  }
  return opcoes.sort((a, b) => b.nota - a.nota).slice(0, quantos);
}

export function lerAudio(arquivo) {
  const bruto = execFileSync('ffmpeg', ['-v', 'error', '-i', arquivo, '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-'], { maxBuffer: 1 << 30 });
  return new Float32Array(bruto.buffer, bruto.byteOffset, bruto.length / 4);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arquivo = process.argv[2];
  if (!arquivo) { console.error('uso: node estudio/batidas.mjs <musica> > batidas.json'); process.exit(2); }
  const analise = estimarBatidas(lerAudio(arquivo));
  const i = process.argv.indexOf('--trecho');
  if (i > 0) {
    const [antes, depois] = process.argv[i + 1].split(',').map(Number);
    analise.trechos = melhoresTrechos(analise, { antes, depois });
  }
  process.stdout.write(JSON.stringify(analise, null, 1) + '\n');
}
