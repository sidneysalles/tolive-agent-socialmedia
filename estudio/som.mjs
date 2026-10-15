// A trilha e os sons de interface, sintetizados em código na mesma linha do tempo da imagem (o passo 09 do
// curso): cada corte cai numa batida conhecida, sem medir nada. Determinístico (ruído com semente).
//
// Dois estilos. 'inspiradora' (trilha-inspiradora.mjs) é o padrão desde 14/10/2026: o Sidney achou a 'calma'
// "horrível" e pediu a pegada da Apple (intro, subida, virada nas features, fim). 'calma' fica só pro primeiro
// vídeo. Os dois resolvem na tônica e somem junto com o quadro parado do fim. Música licenciada (som.musica)
// ganha de qualquer síntese: o motor mede as batidas dela (batidas.mjs) e mixa os sons de interface por cima.
//
//   node estudio/som.mjs videos/<id>        escreve videos/<id>/saida/som.wav a partir do `som` do filme.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { semente } from './movimento.mjs';
import { sintetizarInspiradora } from './trilha-inspiradora.mjs';

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
    // do registro do filme: a cena que empurra a outra e o tipo que bate
    passa: [0.5, (() => { let y = 0; return t => { const x = r() * 2 - 1; y += (0.05 + 0.4 * Math.sin(Math.PI * Math.min(1, t / 0.5))) * (x - y); return y * Math.sin(Math.PI * Math.min(1, t / 0.5)) ** 1.5 * 0.5; }; })()],
    // a notificação do caos (o Manifesto, out/2026): dois tons curtos subindo, genérico (não imita o som de app nenhum)
    aviso: [0.32, t => (Math.sin(2 * Math.PI * (t < 0.09 ? 1318.5 : 1760) * t) * Math.exp(-(t < 0.09 ? t : t - 0.09) * 18) * (t < 0.09 ? 0.7 : 1)) * Math.min(1, t / 0.003) * 0.16],
    bate: [0.18, t => (Math.sin(2 * Math.PI * (160 - 90 * t) * t) * 0.6 + (r() * 2 - 1) * Math.exp(-t * 90) * 0.4) * Math.exp(-t * 22) * 0.4],
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
 * Sintetiza a trilha e os sons de interface: { estilo: 'inspiradora' | 'calma' | 'nenhuma', bpm, duracao,
 * progressao (um acorde por compasso), secoes (inspiradora), sons: [{ t, tipo, vol, pan }] }. Devolve [esquerda, direita]
 * em SR, com pico em −1 dBFS. 'nenhuma': só os sons (pra mixar com uma música trazida).
 */
export function sintetizar({ estilo = 'calma', sons = [], seed = 7, ...op }) {
  const n = Math.ceil(op.duracao * SR);
  const [E, D] = estilo === 'inspiradora' ? sintetizarInspiradora(op)
    : estilo === 'nenhuma' ? [new Float32Array(n), new Float32Array(n)]
      : (m => [m, Float32Array.from(m)])(sintetizarCalma(op));
  const r = semente(seed), V = vozes(r);
  // cada som com o volume dele (vol) e o lado (pan, −1 esquerda … 1 direita: o celular que entra pela direita soa da direita)
  for (const { t: tc, tipo, vol = 1, pan = 0 } of sons) {
    const voz = V[tipo];
    if (!voz) throw new Error(`som desconhecido: ${tipo} (use ${Object.keys(V).join(', ')})`);
    const [dur, fn] = voz, inicio = Math.floor(tc * SR), gE = vol * Math.min(1, 1 - pan), gD = vol * Math.min(1, 1 + pan);
    for (let i = 0; i < dur * SR && inicio + i < n; i++) { const v = fn(i / SR); E[inicio + i] += v * gE; D[inicio + i] += v * gD; }
  }
  let pico = 0;
  for (let i = 0; i < n; i++) pico = Math.max(pico, Math.abs(E[i]), Math.abs(D[i]));
  const ganho = pico > 0 ? 0.891 / pico : 1; // −1 dBFS
  for (let i = 0; i < n; i++) { E[i] *= ganho; D[i] *= ganho; }
  return [E, D];
}

/** A trilha calma do primeiro vídeo (mono, sem os sons de interface). */
function sintetizarCalma({ bpm = 92, duracao, progressao = ['I', 'vi', 'IV', 'V'], pulso = true, fimDe = 1.6 }) {
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
  // fim: some devagar junto com o último quadro parado; começo sem clique
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    molhada[i] *= Math.min(1, t / 0.02) * Math.min(1, Math.max(0, (duracao - t) / fimDe));
  }
  return molhada;
}

/** WAV 16 bits, estéreo, de [esquerda, direita]. */
export function wav([E, D]) {
  const n = E.length, b = Buffer.alloc(44 + n * 4);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 4, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28); b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(n * 4, 40);
  const q = v => Math.round(Math.max(-1, Math.min(1, v)) * 32767);
  for (let i = 0; i < n; i++) { b.writeInt16LE(q(E[i]), 44 + i * 4); b.writeInt16LE(q(D[i]), 46 + i * 4); }
  return b;
}

/**
 * O som do vídeo em saida/som.wav. Com som.musica (um arquivo licenciado em assets/musicas/, ver o LICENCAS.md de
 * lá), a música entra a partir de som.inicio, com fade no fim, e os sons de interface por cima; sem, a trilha
 * sintetizada no estilo do filme. Com som.narracao ({ arquivo, falas: [{ de, ate, em }] }), a voz entra por cima e a
 * música baixa sob ela.
 */
export async function somDoVideo(pasta) {
  const filme = (await import(pathToFileURL(resolve(pasta, 'filme.mjs')).href)).default;
  const som = { duracao: filme.duracao, bpm: filme.bpm, ...filme.som };
  mkdirSync(join(pasta, 'saida'), { recursive: true });
  const destino = join(pasta, 'saida', 'som.wav');
  if (!som.musica) { writeFileSync(destino, wav(sintetizar(som))); return destino; }
  const efeitos = join(pasta, 'saida', 'efeitos.wav');
  writeFileSync(efeitos, wav(sintetizar({ ...som, estilo: 'nenhuma' })));
  const raiz = fileURLToPath(new URL('..', import.meta.url));
  const musica = resolve(raiz, som.musica);
  // a música pode entrar depois do começo (som.musicaEm, com fade de som.musicaSobe s): o Manifesto abre só com os
  // avisos do caos e o silêncio, e a música chega por baixo das frases da noite
  const em = som.musicaEm ?? 0;
  const fim = Math.max(0, som.duracao - em - (som.fimDe ?? 1.8));
  const entradas = ['-ss', String(som.inicio ?? 0), '-t', String(som.duracao - em), '-i', musica, '-i', efeitos];
  const entra = em > 0 ? `,afade=t=in:d=${som.musicaSobe ?? 0.8},adelay=${Math.round(em * 1000)}:all=1,apad=whole_dur=${som.duracao}` : '';
  let filtro = `[0:a]aresample=${SR},volume=${som.volumeMusica ?? 1},afade=t=out:st=${fim}:d=${som.fimDe ?? 1.8}${entra}[m0];[1:a]volume=${som.volumeEfeitos ?? 0.5}[e];`;
  const n = som.narracao;
  if (n?.falas?.length) {
    // a voz: cada fala cortada no arquivo dela e posta na hora da cena; a música baixa enquanto a voz fala (sidechain)
    entradas.push('-i', resolve(raiz, n.arquivo));
    n.falas.forEach((f, k) => {
      const atraso = Math.round(f.em * 1000);
      const dur = (f.ate - f.de) / (n.tempo ?? 1); // com o filme acelerado, a voz também (atempo: mais rápida, mesmo tom)
      filtro += `[2:a]atrim=start=${f.de}:end=${f.ate},asetpts=PTS-STARTPTS,${n.tempo && n.tempo !== 1 ? `atempo=${n.tempo},` : ''}aresample=${SR},afade=t=in:d=0.02,afade=t=out:st=${(dur - 0.03).toFixed(3)}:d=0.03,adelay=${atraso}:all=1[v${k}];`;
    });
    filtro += `${n.falas.map((_, k) => `[v${k}]`).join('')}amix=inputs=${n.falas.length}:normalize=0,volume=${n.volume ?? 1},apad=whole_dur=${som.duracao},aformat=channel_layouts=stereo,asplit=2[voz][chave];`;
    filtro += `[m0][chave]sidechaincompress=threshold=${n.limiar ?? 0.03}:ratio=${n.razao ?? 5}:attack=25:release=450:makeup=1[m];`;
    filtro += '[m][e][voz]amix=inputs=3:normalize=0[s]';
  } else filtro += '[m0][e]amix=inputs=2:normalize=0[s]';
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...entradas, '-filter_complex', filtro, '-map', '[s]', '-t', String(som.duracao), '-ac', '2', '-ar', String(SR), destino]);
  return destino;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pasta = process.argv[2];
  if (!pasta) { console.error('uso: node estudio/som.mjs videos/<id>'); process.exit(2); }
  console.log(await somDoVideo(pasta));
}
