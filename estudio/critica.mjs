// As folhas que o diretor olha antes de dar o vídeo por pronto (os passos 07 e 11 do curso): contato (dois
// quadros por segundo), celular (como lê a 360 px de largura), faixa (12 quadros seguidos em volta de um
// movimento rápido: pega pulo e sobreposição) e o pôster. A rubrica está em
// .claude/skills/tolive-video-critica/SKILL.md; a nota e os problemas vão em videos/<id>/critica.md.
//
//   node estudio/critica.mjs videos/<id>/saida/stories/final.mp4 [--faixa 4.2]

import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ff = args => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args]);

export function duracaoDe(mp4) {
  return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4], { encoding: 'utf8' }).trim());
}

/** Contato, celular e pôster (e a faixa, se pedida) ao lado do mp4. Devolve os caminhos. */
export function folhas(mp4, { poster, duracao = duracaoDe(mp4), faixa } = {}) {
  const dir = dirname(mp4), feitos = [];
  const linhas = n => Math.ceil(n / 6);
  const contato = join(dir, 'contato.png');
  ff(['-i', mp4, '-vf', `fps=2,scale=270:-1,drawtext=text='%{pts\\:hms}':x=8:y=8:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x${linhas(Math.ceil(duracao * 2))}:padding=4`, '-frames:v', '1', contato]);
  feitos.push(contato);
  const celular = join(dir, 'celular.png');
  ff(['-i', mp4, '-vf', `fps=1,scale=360:-1,tile=5x${Math.ceil(Math.ceil(duracao) / 5)}:padding=6`, '-frames:v', '1', celular]);
  feitos.push(celular);
  if (poster !== undefined) {
    const p = join(dir, 'poster.png');
    ff(['-ss', String(poster), '-i', mp4, '-frames:v', '1', p]);
    feitos.push(p);
  }
  if (faixa !== undefined) {
    const f = join(dir, `faixa-${faixa}.png`);
    ff(['-ss', String(Math.max(0, faixa - 0.2)), '-i', mp4, '-vf', 'scale=320:-1,tile=12x1:padding=2', '-frames:v', '1', f]);
    feitos.push(f);
  }
  return feitos;
}

/** Junta PNGs soltos (os quadros de --batidas ou --quadros) numa folha, com o tempo em cada um. */
export function folhaDeQuadros(arquivos, destino, tempos) {
  const colunas = Math.min(6, arquivos.length);
  const entradas = arquivos.flatMap(a => ['-i', a]);
  const rotulos = arquivos.map((_, i) => `[${i}:v]scale=270:-1,drawtext=text='${tempos[i].toFixed(2)} s':x=8:y=8:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6[q${i}]`).join(';');
  const pilha = arquivos.map((_, i) => `[q${i}]`).join('');
  const grade = arquivos.map((_, i) => `${(i % colunas) === 0 ? '0' : Array.from({ length: i % colunas }, () => 'w0').join('+')}_${Math.floor(i / colunas) === 0 ? '0' : Array.from({ length: Math.floor(i / colunas) }, () => 'h0').join('+')}`).join('|');
  const filtro = arquivos.length === 1 ? `${rotulos};[q0]copy` : `${rotulos};${pilha}xstack=inputs=${arquivos.length}:layout=${grade}:fill=black`;
  ff([...entradas, '-filter_complex', filtro, '-frames:v', '1', destino]);
  return destino;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const mp4 = process.argv[2];
  const i = process.argv.indexOf('--faixa');
  if (!mp4) { console.error('uso: node estudio/critica.mjs <final.mp4> [--faixa <s>]'); process.exit(2); }
  console.log(folhas(mp4, { faixa: i > 0 ? Number(process.argv[i + 1]) : undefined }).join('\n'));
}
