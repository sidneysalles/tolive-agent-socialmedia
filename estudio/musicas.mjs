// As músicas candidatas de um vídeo, pra aprovação antes do render: busca no catálogo do Incompetech (Kevin MacLeod,
// ~1.400 faixas, todas CC BY 4.0, cada uma com clima, andamento e instrumentos), baixa as que combinam com a marca,
// mede cada uma (batidas.mjs: andamento, energia por compasso, onde cortar) e corta o trecho EXATO que entraria no
// vídeo, pra quem aprova ouvir o que vai sair e não a faixa inteira. Nunca repete uma faixa já oferecida no vídeo.
//
//   node estudio/musicas.mjs videos/<id>              cinco candidatas (a primeira rodada, ou mais uma)
//   node estudio/musicas.mjs videos/<id> --quantas 10 --clima "piano, calmo"   (o pedido de quem aprova, em palavras)
//   node estudio/musicas.mjs videos/<id> --escolher <idDaFaixa>               a escolhida vira a música do filme
//
// Escreve videos/<id>/aprovacao/musicas.json (as rodadas) e aprovacao/musicas/<faixa>.mp3 (os trechos, fora do git).
// A estrutura que o trecho precisa vem do filme: `musica: { antes, depois, compassos }` (compassos calmos antes da
// virada, compassos depois dela, e quantos compassos o filme dura); sem ela, 5, 6 e 13.

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { estimarBatidas, lerAudio, melhoresTrechos } from './batidas.mjs';
import { fichas } from './historico.mjs';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const CATALOGO = 'https://incompetech.com/music/royalty-free/pieces.json';
const ARQUIVO = titulo => `https://incompetech.com/music/royalty-free/mp3-royaltyfree/${encodeURIComponent(titulo)}.mp3`;
const CACHE = join(RAIZ, 'assets', 'musicas', 'candidatas');
const UA = { 'user-agent': 'toLiveEstudio/1.0 (contato@tolive.app)' };

const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const segundos = t => String(t ?? '').split(':').reduce((a, n) => a * 60 + Number(n), 0);

// o que combina com a marca (calma, propósito, inspiração) e o que não combina (humor, terror, medieval, exótico)
const BOM = { uplifting: 3, bright: 1, driving: 1, calming: 0.5, relaxed: 0.3, epic: 0.5 };
const RUIM = /humorous|dark|eerie|unnerving|somber|aggressive|mysterious|suspenseful|medieval|ren faire|mystical|intense/i;
const INSTRUMENTO_FORA = /bagpipe|banjo|accordion|steel drum|tuba|ukulele|kazoo|harmonica|didgeridoo|sitar|guzheng|theremin|bassoon|log drum/i;
const INSTRUMENTO_BOM = /piano|strings|violin|cello|synth|guitar|bells|glockenspiel/i;
// voz cantada briga com a narração; música de festa, folclore e ópera conhecidas puxam outra lembrança (o Manifesto,
// out/2026: a busca trouxe Jingle Bells, Comin' Round the Mountain e a Habanera de Carmen)
const CANTADA = /voice|vocal|choir|singer/i;
const VALSA = /waltz|valse|minuet/i; // em três: o filme corta em compassos de quatro
const CONHECIDA = /holiday|christmas|xmas|jingle|carol|folk song|aria|opera|nursery|lullaby|band program|anthem|wedding/i;

/** A nota de uma faixa só pelos dados do catálogo, e o pedido de quem aprova (palavras soltas: "piano", "calmo"…). */
export function notaDoCatalogo(p, clima = '') {
  const feel = (p.feel ?? '').toLowerCase(), texto = `${p.title} ${p.description ?? ''} ${p.instruments ?? ''} ${feel}`.toLowerCase();
  const bpm = Number(p.bpm) || 0, dur = segundos(p.length);
  if (bpm < 96 || bpm > 136 || dur < 75 || RUIM.test(feel) || INSTRUMENTO_FORA.test(p.instruments ?? '')) return -Infinity;
  if (CANTADA.test(p.instruments ?? '') || CONHECIDA.test(`${p.title} ${p.description ?? ''}`) || VALSA.test(`${p.title} ${p.description ?? ''}`)) return -Infinity;
  let nota = Object.entries(BOM).reduce((a, [k, v]) => a + (feel.includes(k) ? v : 0), 0);
  if (/inspir|hope|motivat|optimis|journey|begin|rise|rising|dream/.test(texto)) nota += 1.5;
  if (INSTRUMENTO_BOM.test(p.instruments ?? '')) nota += 1;
  if (/bouncy/.test(feel)) nota -= 3; // saltitante puxa pro infantil (o Manifesto, out/2026: com -1, metade das dez)
  const sinonimos = { calmo: 'calming relaxed', calma: 'calming relaxed', energia: 'driving', animada: 'driving bright', piano: 'piano', cordas: 'strings violin cello', violao: 'guitar', guitarra: 'guitar', eletronica: 'synth', epica: 'epic', inspiradora: 'uplifting inspir' };
  for (const palavra of clima.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z]+/).filter(Boolean)) {
    for (const termo of (sinonimos[palavra] ?? palavra).split(' ')) if (texto.includes(termo)) nota += 2;
  }
  return nota;
}

async function catalogo() {
  mkdirSync(CACHE, { recursive: true });
  const local = join(CACHE, 'pieces.json');
  if (!existsSync(local)) writeFileSync(local, Buffer.from(await (await fetch(CATALOGO, { headers: UA })).arrayBuffer()));
  return JSON.parse(readFileSync(local, 'utf8'));
}

async function baixar(p) {
  const destino = join(CACHE, `${slug(p.title)}.mp3`);
  if (!existsSync(destino)) {
    const r = await fetch(ARQUIVO(p.title), { headers: UA, signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error(`${p.title}: ${r.status}`);
    writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
  }
  return destino;
}

const lerJson = (arq, padrao) => (existsSync(arq) ? JSON.parse(readFileSync(arq, 'utf8')) : padrao);

/** Mais `quantas` candidatas pro vídeo, que nunca foram oferecidas nele. */
export async function sugerir(pasta, { quantas = 10, clima = '' } = {}) {
  const filme = (await import(pathToFileURL(join(pasta, 'filme.mjs')).href)).default;
  const { antes = 5, depois = 6, compassos = 13 } = filme.musica ?? {};
  const dir = join(pasta, 'aprovacao'), arq = join(dir, 'musicas.json');
  const estado = lerJson(arq, { rodadas: [], escolhida: null });
  // nem a já oferecida aqui, nem a música de outro vídeo (cada filme com a sua)
  const outras = fichas().filter(f => f.musica?.arquivo && !pasta.endsWith(f.id)).map(f => f.musica.arquivo);
  const ja = new Set(estado.rodadas.flatMap(r => r.faixas.map(f => f.id)));
  const deOutro = id => outras.some(a => a.endsWith(`-${id}.mp3`) || a.endsWith(`/${id}.mp3`));
  const lista = (await catalogo())
    .map(p => ({ p, nota: notaDoCatalogo(p, clima) }))
    .filter(x => Number.isFinite(x.nota) && !ja.has(slug(x.p.title)) && !deOutro(slug(x.p.title)))
    .sort((a, b) => b.nota - a.nota || a.p.title.localeCompare(b.p.title))
    .slice(0, quantas * 3);
  const medidas = [];
  for (const { p, nota } of lista) {
    try {
      const mp3 = await baixar(p);
      const analise = estimarBatidas(lerAudio(mp3), undefined, { bpmPerto: Number(p.bpm) || undefined });
      const [trecho] = melhoresTrechos(analise, { antes, depois });
      if (!trecho) continue;
      const fimDaFaixa = analise.compassos.at(-1) ?? 0;
      const dur = Math.min((compassos * 4 * 60) / analise.bpm, fimDaFaixa - trecho.inicio + 4);
      medidas.push({ p, mp3, analise, trecho, dur, nota: +(trecho.nota + 0.6 * nota).toFixed(2) });
      process.stdout.write(`\r${medidas.length} medidas de ${lista.length}`);
    } catch (erro) { process.stdout.write(`\n-- ${p.title}: ${erro.message}\n`); }
  }
  process.stdout.write('\n');
  const escolhidas = medidas.sort((a, b) => b.nota - a.nota).slice(0, quantas);
  mkdirSync(join(dir, 'musicas'), { recursive: true });
  const faixas = escolhidas.map(({ p, mp3, analise, trecho, dur, nota }) => {
    const id = slug(p.title);
    // o trecho que entra no vídeo, com o fim em fade (o filme termina parado no logo)
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', String(trecho.inicio), '-t', String(dur.toFixed(2)), '-i', mp3,
      '-af', `afade=t=in:d=0.05,afade=t=out:st=${Math.max(0, dur - 1.5).toFixed(2)}:d=1.5`, '-ac', '2', '-b:a', '128k', join(dir, 'musicas', `${id}.mp3`)]);
    return {
      id, titulo: p.title, autor: 'Kevin MacLeod', bpm: analise.bpm, bpmDoCatalogo: Number(p.bpm), duracaoDaFaixa: p.length,
      clima: p.feel, instrumentos: p.instruments, descricao: p.description, inicio: trecho.inicio, virada: +(trecho.virada - trecho.inicio).toFixed(2),
      subida: trecho.subida, trecho: +dur.toFixed(1), nota, licenca: 'CC BY 4.0', fonte: 'https://incompetech.com', arquivo: ARQUIVO(p.title),
      credito: `Música: "${p.title}", Kevin MacLeod (incompetech.com), licença CC BY 4.0`,
    };
  });
  estado.rodadas.push({ n: estado.rodadas.length + 1, em: new Date().toISOString(), clima: clima || null, faixas });
  writeFileSync(arq, JSON.stringify(estado, null, 2) + '\n');
  return faixas;
}

/**
 * A escolhida vira a música do filme: copia pra assets/musicas/, registra a licença em LICENCAS.md e escreve
 * videos/<id>/musica.json ({ arquivo, bpm, inicio, virada, credito }), que o filme importa.
 */
export function escolher(pasta, id) {
  const arq = join(pasta, 'aprovacao', 'musicas.json');
  if (id === 'atual') { // "Manter esta": a de hoje fica
    const estado = lerJson(arq, { rodadas: [] });
    estado.escolhida = { id: 'atual', em: new Date().toISOString() };
    writeFileSync(arq, JSON.stringify(estado, null, 2) + '\n');
    return lerJson(join(pasta, 'musica.json'), null);
  }
  const estado = lerJson(arq, { rodadas: [] });
  const f = estado.rodadas.flatMap(r => r.faixas).find(x => x.id === id);
  if (!f) throw new Error(`a faixa ${id} não foi oferecida neste vídeo`);
  const nome = `kevin-macleod-${f.id}.mp3`;
  copyFileSync(join(CACHE, `${f.id}.mp3`), join(RAIZ, 'assets', 'musicas', nome));
  const licencas = join(RAIZ, 'assets', 'musicas', 'LICENCAS.md');
  const texto = readFileSync(licencas, 'utf8');
  if (!texto.includes(`\`${nome}\``)) {
    writeFileSync(licencas, texto.trimEnd() + `\n| \`${nome}\` | "${f.titulo}", Kevin MacLeod | ${f.fonte} (baixada de ${f.arquivo}) | CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ | ${f.credito} | ${new Date().toISOString().slice(0, 10)} |\n`);
  }
  const musica = { arquivo: `assets/musicas/${nome}`, titulo: f.titulo, bpm: f.bpm, inicio: f.inicio, virada: f.virada, credito: f.credito };
  writeFileSync(join(pasta, 'musica.json'), JSON.stringify(musica, null, 2) + '\n');
  estado.escolhida = { id, em: new Date().toISOString() };
  writeFileSync(arq, JSON.stringify(estado, null, 2) + '\n');
  return musica;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pasta = process.argv[2] && resolve(process.argv[2]);
  const op = k => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : undefined; };
  if (!pasta || !existsSync(join(pasta, 'filme.mjs'))) { console.error('uso: node estudio/musicas.mjs videos/<id> [--quantas 10] [--clima "…"] [--escolher <faixa>]'); process.exit(2); }
  if (op('escolher')) console.log(JSON.stringify(escolher(pasta, op('escolher')), null, 2));
  else for (const f of await sugerir(pasta, { quantas: Number(op('quantas') ?? 10), clima: op('clima') ?? '' })) {
    console.log(`${f.titulo.padEnd(34)} ${String(f.bpm).padStart(6)} BPM  sobe ${String(f.subida).padStart(4)} dB  trecho ${f.trecho}s  [${f.clima}]`);
  }
}
