// A trilha e os sons de interface, sintetizados em código na mesma linha do tempo da imagem (o passo 09 do
// curso): cada corte cai numa batida conhecida, sem medir nada. Determinístico (ruído com semente).
//
// A marca não define som (guia: "não definido"). A proposta daqui segue o movimento dela: calmo, sem
// urgência, termina parado. Por isso: andamento de 84 a 100, acordes abertos (maj7/maj9), um piano elétrico
// suave em colcheias, baixo nos tempos fortes, pulso quase inaudível, nada de "drop", riser ou sirene.
// O fim resolve no acorde da tônica e some devagar, junto com o último quadro parado.
//
//   node estudio/som.mjs videos/<id>        escreve videos/<id>/saida/som.wav a partir do `som` do filme.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { semente } from './movimento.mjs';

export const SR = 48000;
const midi = n => 440 * 2 ** ((n - 69) / 12);

/** Os acordes que a trilha sabe tocar, em notas MIDI (vozes abertas, região média). Tom: Ré maior. */
export const ACORDES = Object.freeze({
  I: [50, 57, 61, 64, 66],    // Dmaj9
  ii: [52, 59, 62, 66, 69],   // Em9
  iii: [54, 61, 64, 69, 71],  // F#m7(add11)
  IV: [43, 50, 54, 57, 59],   // Gmaj9 (G no baixo)
  V: [45, 52, 55, 59, 62],    // A7sus
  vi: [47, 54, 57, 62, 64],   // Bm9
});

/** O que cada som de interface é: [duração em s, função do tempo local]. Baixos de propósito. */
function vozes(r) {
  return {
    toque: [0.06, t => (Math.sin(2 * Math.PI * 1900 * t) * 0.5 + (r() * 2 - 1) * 0.15) * Math.exp(-t * 110) * 0.22],
    entra: [0.42, t => (r() * 2 - 1) * Math.sin(Math.PI * Math.min(1, t / 0.42)) ** 2 * 0.06],
    assenta: [0.3, t => Math.sin(2 * Math.PI * (120 - 50 * t) * t) * Math.exp(-t * 14) * 0.35],
    troca: [0.5, t => Math.sin(2 * Math.PI * midi(81) * t + 1.2 * Math.exp(-t * 9) * Math.sin(2 * Math.PI * midi(81) * t)) * Math.exp(-t * 7) * 0.09],
  };
}

/** Reverberação de Schroeder (quatro pentes e dois passa-tudo), pra trilha não soar seca. */
function reverb(entrada, mistura = 0.22) {
  const saida = new Float32Array(entrada.length);
  const pentes = [1557, 1617, 1491, 1422].map(n => ({ buf: new Float32Array(Math.round(n * SR / 44100)), i: 0, g: 0.8 }));
  const passa = [225, 556].map(n => ({ buf: new Float32Array(Math.round(n * SR / 44100)), i: 0, g: 0.5 }));
  let lp = 0;
  for (let n = 0; n < entrada.length; n++) {
    let s = 0;
    for (const p of pentes) {
      const y = p.buf[p.i];
      lp = y * 0.7 + lp * 0.3;
      p.buf[p.i] = entrada[n] + lp * p.g;
      p.i = (p.i + 1) % p.buf.length;
      s += y;
    }
    s /= 4;
    for (const a of passa) {
      const y = a.buf[a.i];
      const x = s + y * a.g;
      a.buf[a.i] = x;
      a.i = (a.i + 1) % a.buf.length;
      s = y - x * a.g;
    }
    saida[n] = entrada[n] * (1 - mistura) + s * mistura;
  }
  return saida;
}

/**
 * Sintetiza a trilha: { bpm, duracao, progressao: ['I','vi','IV','V',…] (um por compasso), pulso, sons }.
 * Devolve Float32Array mono em SR, já com fim em fade e pico em −1 dBFS.
 */
export function sintetizar({ bpm = 92, duracao, progressao = ['I', 'vi', 'IV', 'V'], pulso = true, sons = [], fimDe = 1.6, seed = 7 }) {
  const n = Math.ceil(duracao * SR);
  const musica = new Float32Array(n);
  const b = 60 / bpm, compasso = 4 * b;
  const totalCompassos = Math.ceil(duracao / compasso);
  // o último compasso inteiro vira a tônica, pra resolver
  const acordeDo = c => (c >= totalCompassos - 1 ? 'I' : progressao[c % progressao.length]);

  for (let c = 0; c < totalCompassos; c++) {
    const t0 = c * compasso, notas = ACORDES[acordeDo(c)];
    const dur = c === totalCompassos - 1 ? duracao - t0 : compasso;
    // o colchão: senoides levemente desafinadas, ataque e soltura lentos
    for (const nota of notas.slice(1)) {
      const f = midi(nota);
      for (let i = 0; i < (dur + 0.6) * SR && t0 * SR + i < n; i++) {
        const t = i / SR;
        const env = Math.min(1, t / 0.35) * Math.min(1, Math.max(0, (dur + 0.6 - t) / 0.6));
        const v = Math.sin(2 * Math.PI * f * 0.9983 * t) + Math.sin(2 * Math.PI * f * 1.0017 * t) + 0.25 * Math.sin(2 * Math.PI * 2 * f * t);
        musica[Math.floor(t0 * SR) + i] += v * env * 0.018;
      }
    }
    // o piano elétrico (FM) em colcheias, subindo e descendo nas notas do acorde, uma oitava acima
    const arpejo = [1, 2, 3, 4, 3, 2, 4, 3];
    for (let k = 0; k < 8 && t0 + k * b / 2 < duracao; k++) {
      const f = midi(notas[arpejo[k]] + 12), inicio = Math.floor((t0 + (k * b) / 2) * SR);
      const forte = k % 2 === 0 ? 1 : 0.7;
      for (let i = 0; i < 1.6 * SR && inicio + i < n; i++) {
        const t = i / SR;
        const v = Math.sin(2 * Math.PI * f * t + 1.6 * Math.exp(-t * 6) * Math.sin(2 * Math.PI * f * t));
        musica[inicio + i] += v * Math.exp(-t * 3.2) * Math.min(1, t / 0.004) * 0.05 * forte;
      }
    }
    // o baixo nos tempos 1 e 3
    for (const tempo of [0, 2]) {
      const f = midi(notas[0] - 12), inicio = Math.floor((t0 + tempo * b) * SR);
      if (t0 + tempo * b >= duracao) continue;
      for (let i = 0; i < 2 * b * SR && inicio + i < n; i++) {
        const t = i / SR;
        musica[inicio + i] += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 1.8) * Math.min(1, t / 0.01) * 0.11;
      }
    }
    // o pulso: um bumbo macio nos tempos fortes, quase só sentido
    if (pulso && c < totalCompassos - 1) {
      for (const tempo of [0, 2]) {
        const inicio = Math.floor((t0 + tempo * b) * SR);
        for (let i = 0; i < 0.3 * SR && inicio + i < n; i++) {
          const t = i / SR;
          musica[inicio + i] += Math.sin(2 * Math.PI * (55 + 50 * Math.exp(-t * 30)) * t) * Math.exp(-t * 12) * 0.12;
        }
      }
    }
  }

  const molhada = reverb(musica);
  // os sons de interface, por cima, secos
  const r = semente(seed), V = vozes(r);
  for (const { t: tc, tipo } of sons) {
    const voz = V[tipo];
    if (!voz) throw new Error(`som desconhecido: ${tipo} (use ${Object.keys(V).join(', ')})`);
    const [dur, fn] = voz, inicio = Math.floor(tc * SR);
    for (let i = 0; i < dur * SR && inicio + i < n; i++) molhada[inicio + i] += fn(i / SR);
  }
  // fim: some devagar junto com o último quadro parado; começo sem clique
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    molhada[i] *= Math.min(1, t / 0.02) * Math.min(1, Math.max(0, (duracao - t) / fimDe));
  }
  let pico = 0;
  for (const v of molhada) pico = Math.max(pico, Math.abs(v));
  const ganho = pico > 0 ? 0.891 / pico : 1; // −1 dBFS
  for (let i = 0; i < n; i++) molhada[i] *= ganho;
  return molhada;
}

/** WAV 16 bits, mono. */
export function wav(amostras) {
  const n = amostras.length, b = Buffer.alloc(44 + n * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, amostras[i])) * 32767), 44 + i * 2);
  return b;
}

export async function somDoVideo(pasta) {
  const filme = (await import(pathToFileURL(resolve(pasta, 'filme.mjs')).href)).default;
  const som = { duracao: filme.duracao, bpm: filme.bpm, ...filme.som };
  mkdirSync(join(pasta, 'saida'), { recursive: true });
  const destino = join(pasta, 'saida', 'som.wav');
  writeFileSync(destino, wav(sintetizar(som)));
  return destino;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pasta = process.argv[2];
  if (!pasta) { console.error('uso: node estudio/som.mjs videos/<id>'); process.exit(2); }
  console.log(await somDoVideo(pasta));
}
