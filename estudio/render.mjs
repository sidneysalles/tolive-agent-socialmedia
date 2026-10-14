// O render: anda no tempo, pede cada quadro ao palco (window.seek) e manda pro ffmpeg; depois a trilha
// (som.mjs), a mixagem em −14 LUFS e as folhas da crítica (critica.mjs). Mesmo filme, todos os formatos.
//
//   node estudio/render.mjs videos/<id>                          stories, 30 fps, tudo
//   node estudio/render.mjs videos/<id> --formato stories,feed   mais de um formato da mesma linha do tempo
//   node estudio/render.mjs videos/<id> --batidas                só um quadro por batida (a folha antes do render)
//   node estudio/render.mjs videos/<id> --quadros 0.5,2,7.25     só esses quadros, em PNG
//   node estudio/render.mjs videos/<id> --de 4 --ate 8           só um trecho (refazer o que a crítica apontou)
//   node estudio/render.mjs videos/<id> --so-som                 só a trilha e a mixagem, sobre o mudo.mp4 que já existe
//   opções: --fps 30 (60 pra movimento rápido) · --sub 4 (subquadros misturados: borrão de movimento) ·
//           --obturador 0.5 (o borrão cobre meio quadro, os 180° do cinema; 1 borra o quadro inteiro e o empurrão vira
//           cópias fantasmas)
//   --rascunho: a prévia rápida (o "animatic" do curso): meia resolução, quadros em JPEG, sem borrão, em 3 páginas ao
//           mesmo tempo (--escala 0.5 --jpeg --sub 1 --paralelo 3; cada um também vale sozinho). Pra aprovar ritmo e
//           conteúdo; o borrão, a nitidez e o detalhe só no render final.
//
// Sai em videos/<id>/saida/<formato>/: final.mp4 (H.264 yuv420p, CRF 16, AAC), poster.png e as folhas.

import { spawn, spawnSync, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { servir } from './servidor.mjs';
import { abrirNavegador } from './navegador.mjs';
import { atualizar, guardado, oQueDizer } from './catalogo.mjs';
import { somDoVideo } from './som.mjs';
import { folhas, folhaDeQuadros } from './critica.mjs';
import { conferirVideo } from './texto.mjs';
import { FORMATOS } from './formatos.mjs';
import { batida } from './movimento.mjs';

const RAIZ = resolve(fileURLToPath(new URL('..', import.meta.url)));

function opcoes(argv) {
  const o = { formatos: ['stories'], fps: 30, sub: 1, obturador: 0.5, escala: 1, jpeg: false, paralelo: 1 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], prox = () => argv[++i];
    if (a === '--formato') o.formatos = prox().split(',');
    else if (a === '--fps') o.fps = Number(prox());
    else if (a === '--sub') o.sub = Number(prox());
    else if (a === '--obturador') o.obturador = Number(prox());
    else if (a === '--quadros') o.quadros = prox().split(',').map(Number);
    else if (a === '--batidas') o.batidas = true;
    else if (a === '--so-som') o.soSom = true;
    else if (a === '--de') o.de = Number(prox());
    else if (a === '--ate') o.ate = Number(prox());
    else if (a === '--escala') o.escala = Number(prox());
    else if (a === '--jpeg') o.jpeg = true;
    else if (a === '--paralelo') o.paralelo = Math.max(1, Number(prox()));
    else if (a === '--rascunho') Object.assign(o, { escala: 0.5, jpeg: true, sub: 1, paralelo: 3, rascunho: true });
    else if (!a.startsWith('--')) o.pasta = a;
  }
  for (const f of o.formatos) if (!FORMATOS[f]) throw new Error(`formato desconhecido: ${f}`);
  return o;
}

/** A mixagem em duas passadas: mede a trilha e aplica o ganho linear até −14 LUFS (uma passada só fica 1 dB abaixo num clipe curto). */
function volume(som) {
  const alvo = 'I=-14:TP=-1.5:LRA=11';
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', som, '-af', `loudnorm=${alvo}:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' });
  const json = r.stderr.slice(r.stderr.lastIndexOf('{'), r.stderr.lastIndexOf('}') + 1);
  try {
    const m = JSON.parse(json);
    // o limitador depois: o loudnorm linear não segura o pico verdadeiro, e o AAC passava de 0 dBFS (+0,4 no "Propósito")
    return `loudnorm=${alvo}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,alimiter=limit=0.79:level=false`;
  } catch {
    return `loudnorm=${alvo},alimiter=limit=0.79:level=false`;
  }
}

/** A trilha e a mixagem sobre o vídeo mudo: −14 LUFS (o alvo das redes), pico abaixo de −1,5 dBTP. */
async function mixar(pasta, mudo, saida) {
  if (!existsSync(mudo)) throw new Error(`falta ${mudo}: renderize a imagem antes do --so-som`);
  const som = await somDoVideo(pasta);
  const final = join(saida, 'final.mp4');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', mudo, '-i', som, '-af', volume(som), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', final]);
  return final;
}

/** A ficha guarda com que catálogo o vídeo saiu e em que formatos: o historico.mjs avisa quando o preço mudar. */
function anotarNaFicha(pasta, formato) {
  const arquivo = join(pasta, 'ficha.json');
  if (!existsSync(arquivo)) return;
  const ficha = JSON.parse(readFileSync(arquivo, 'utf8'));
  const { lido_em, resposta } = guardado();
  const { menorPreco, teste } = oQueDizer(resposta);
  ficha.catalogo = { lido_em, menorPreco, teste };
  ficha.formatos = [...new Set([...(ficha.formatos ?? []), formato])];
  ficha.renderizado_em = new Date().toISOString();
  writeFileSync(arquivo, JSON.stringify(ficha, null, 2) + '\n');
}

export async function abrirPalco(navegador, url, pasta, formato, fps = 30, escala = 1) {
  const W = Math.round(FORMATOS[formato].W * escala), H = Math.round(FORMATOS[formato].H * escala);
  const pagina = await navegador.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const erros = [];
  pagina.on('pageerror', e => erros.push(String(e)));
  pagina.on('console', m => m.type() === 'error' && erros.push(m.text()));
  await pagina.goto(`${url}/estudio/palco.html?render&video=${encodeURIComponent(relative(RAIZ, pasta))}&formato=${formato}&fps=${fps}&escala=${escala}`);
  await pagina.waitForFunction(() => window.pronto || window.erroDoPalco, null, { timeout: 30000 });
  const erro = await pagina.evaluate(() => window.erroDoPalco);
  if (erro || erros.length) throw new Error(`o palco falhou:\n${erro ?? erros.join('\n')}`);
  return pagina;
}

// o quadro t em PNG (sem perda: o render final) ou JPEG (o rascunho: codifica umas cinco vezes mais rápido)
export const quadro = (pagina, t, tipo = 'image/png') => pagina.evaluate(([t, tipo]) => { window.seek(t); return document.getElementById('c').toDataURL(tipo, 0.9); }, [t, tipo])
  .then(url => Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));

export async function renderizar(argv) {
  const o = opcoes(argv);
  if (!o.pasta || !existsSync(join(o.pasta, 'filme.mjs'))) throw new Error('uso: node estudio/render.mjs videos/<id> [opções]');
  const pasta = resolve(o.pasta);

  const texto = conferirVideo(pasta).filter(a => a.nivel === 'erro');
  if (texto.length) throw new Error(`o texto não passa na voz da marca (node estudio/texto.mjs ${o.pasta}):\n${texto.map(a => `- ${a.regra}: "${a.trecho}"`).join('\n')}`);

  await atualizar(); // o preço e o teste grátis do dia, ou o último guardado
  const filme = (await import(pathToFileURL(join(pasta, 'filme.mjs')).href)).default;
  const { url, fechar } = await servir();
  const navegador = await abrirNavegador();
  const feitos = [];
  try {
    for (const formato of o.formatos) {
      const saida = join(pasta, 'saida', formato);
      mkdirSync(saida, { recursive: true });
      if (o.soSom) {
        const final = await mixar(pasta, join(saida, 'mudo.mp4'), saida);
        feitos.push(final, ...folhas(final, { poster: filme.poster ?? filme.duracao - 0.5, duracao: filme.duracao }));
        continue;
      }
      const pagina = await abrirPalco(navegador, url, pasta, formato, o.fps, o.quadros || o.batidas ? 1 : o.escala);

      if (o.quadros || o.batidas) {
        const tempos = o.quadros ?? Array.from({ length: Math.floor((filme.duracao * filme.bpm) / 60) }, (_, n) => +batida(n, filme.bpm).toFixed(3));
        const dir = join(saida, 'quadros');
        mkdirSync(dir, { recursive: true });
        const arquivos = [];
        for (const t of tempos) {
          const arq = join(dir, `t${t.toFixed(2).padStart(6, '0')}.png`);
          writeFileSync(arq, await quadro(pagina, t));
          arquivos.push(arq);
        }
        const folha = folhaDeQuadros(arquivos, join(saida, o.batidas ? 'batidas.png' : 'quadros.png'), tempos);
        feitos.push(folha);
        await pagina.close();
        continue;
      }

      const de = o.de ?? 0, ate = Math.min(o.ate ?? filme.duracao, filme.duracao);
      const trecho = o.de !== undefined || o.ate !== undefined;
      const mudo = join(saida, `${o.rascunho ? 'rascunho-' : ''}${trecho ? `trecho-${de}-${ate}-mudo` : 'mudo'}.mp4`);
      const SUB = Math.max(1, o.sub), FPS = o.fps, tipo = o.jpeg ? 'image/jpeg' : 'image/png';
      const total = Math.round((ate - de) * FPS * SUB);
      // em paralelo: cada página pinta um pedaço contínuo (em quadros inteiros) num arquivo próprio; o ffmpeg emenda
      const quadros = total / SUB, partes = Math.min(o.paralelo, Math.max(1, Math.floor(quadros / FPS)));
      const limites = Array.from({ length: partes + 1 }, (_, p) => Math.round((quadros * p) / partes) * SUB);
      const t0 = Date.now();
      let feitosQ = 0;
      const pedaco = async (p, pag) => {
        const arq = partes > 1 ? join(saida, `.pedaco-${p}.mp4`) : mudo;
        const filtro = SUB > 1 ? ['-vf', `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB`] : [];
        const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', ...(o.jpeg ? ['-c:v', 'mjpeg'] : []), '-framerate', String(FPS * SUB), '-i', '-', ...filtro,
          '-r', String(FPS), '-c:v', 'libx264', '-preset', o.rascunho ? 'veryfast' : 'medium', '-crf', o.rascunho ? '23' : '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', arq], { stdio: ['pipe', 'inherit', 'inherit'] });
        const fim = new Promise((ok, falha) => ff.on('close', c => (c === 0 ? ok() : falha(new Error(`ffmpeg saiu com ${c}`)))));
        for (let i = limites[p]; i < limites[p + 1]; i++) {
          // o subquadro j do quadro k: dentro da fração do quadro em que o obturador fica aberto
          const k = Math.floor(i / SUB), j = i % SUB;
          const img = await quadro(pag, de + k / FPS + (j * o.obturador) / (FPS * SUB), tipo);
          if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
          if (++feitosQ % (FPS * SUB * 2) === 0) process.stdout.write(`\r${formato}: ${(feitosQ / (FPS * SUB)).toFixed(0)} s de ${(ate - de).toFixed(0)} s`);
        }
        ff.stdin.end();
        await fim;
        return arq;
      };
      const paginas = [pagina, ...(await Promise.all(Array.from({ length: partes - 1 }, () => abrirPalco(navegador, url, pasta, formato, o.fps, o.escala))))];
      const arquivos = await Promise.all(paginas.map((pag, p) => pedaco(p, pag)));
      if (partes > 1) {
        const lista = join(saida, '.pedacos.txt');
        writeFileSync(lista, arquivos.map(a => `file '${a}'`).join('\n') + '\n');
        execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', '-movflags', '+faststart', mudo]);
        for (const a of [...arquivos, lista]) rmSync(a, { force: true });
      }
      process.stdout.write(`\r${formato}: ${total} quadros em ${((Date.now() - t0) / 1000).toFixed(0)} s${partes > 1 ? ` (${partes} páginas)` : ''}\n`);
      for (const pag of paginas) await pag.close();
      if (trecho) { feitos.push(mudo); continue; }

      const final = await mixar(pasta, mudo, saida);
      feitos.push(final, ...folhas(final, { poster: filme.poster ?? filme.duracao - 0.5, duracao: filme.duracao }));
      anotarNaFicha(pasta, formato);
    }
  } finally {
    await navegador.close();
    fechar();
  }
  return feitos;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const feitos = await renderizar(process.argv.slice(2));
    console.log(feitos.map(f => relative(process.cwd(), f)).join('\n'));
  } catch (erro) {
    console.error(erro.message);
    process.exit(1);
  }
}
