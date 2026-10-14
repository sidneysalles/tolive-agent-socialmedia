// O roteiro de locução de um vídeo (videos/<id>/narracao.md), do `narracao` do filme: cada fala com a janela dela, o
// limite de palavras pra caber e o nome do arquivo que o áudio deve ter. A fala diz o que a tela escreve (o pedido do
// Sidney, out/2026: olhar e ouvir ao mesmo tempo; e quem vê sem som lê a mesma coisa). A do teste grátis sai do
// catálogo da conta, por extenso.
//
//   node estudio/narracao.mjs videos/<id>
//   node estudio/narracao.mjs videos/<id> --medir <audio> <transcricao.json>
//
// Com o áudio de volta (um arquivo só, com as falas na ordem do `narracao` do filme), --medir lê a transcrição do
// estudio/transcrever.py e o volume do próprio áudio e escreve videos/<id>/narracao.json: onde cada fala começa e acaba
// no arquivo (o corte no silêncio entre duas falas, pelo volume, nunca no meio de uma consoante), quando a voz entra e
// o tempo de cada palavra. O filme importa esse arquivo e põe cada fala na hora da cena dela (as palavras puxam os
// cortes); o som.mjs corta e mistura a voz, com a música baixando por baixo.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, basename, relative } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { oQueDizer } from './catalogo-navegador.mjs';

// fala a ~2,6 palavras por segundo (calma, sem pressa); a janela inteira, menos meio segundo de respiro
const PALAVRAS_POR_SEGUNDO = 2.6;
const POR_EXTENSO = { 7: 'sete', 10: 'dez', 14: 'catorze', 15: 'quinze', 30: 'trinta', 45: 'quarenta e cinco', 60: 'sessenta' };
const extenso = s => s.replace(/\b(\d+) dias\b/, (_, n) => `${POR_EXTENSO[n] ?? n} dias`);
const virgula = n => n.toFixed(1).replace('.', ',');

export function linhasDaNarracao(filme, catalogo) {
  return filme.narracao.map((l, i) => {
    const texto = l.catalogo && catalogo?.testeDestaque
      ? `${extenso(catalogo.testeDestaque.grande).replace(/^./, c => c.toUpperCase())}${catalogo.testeDestaque.resto ? `, ${catalogo.testeDestaque.resto}` : ''}. ${l.texto}`
      : l.texto;
    const janela = l.ate - l.de;
    return { ...l, texto, arquivo: `${String(i + 1).padStart(2, '0')}-${l.id}.mp3`, janela, palavras: texto.split(/\s+/).length, cabe: Math.floor((janela - 0.5) * PALAVRAS_POR_SEGUNDO) };
  });
}

export function roteiroDeLocucao(filme, catalogo) {
  const linhas = linhasDaNarracao(filme, catalogo);
  const total = linhas.reduce((s, l) => s + l.palavras, 0);
  return `# Roteiro de locução · ${filme.titulo}

Gerado de \`filme.mjs\` (\`node estudio/narracao.mjs videos/${filme.id}\`): não edite à mão; mude a fala no filme.
${linhas.length} falas, ${total} palavras em ${virgula(filme.duracao)} s. A fala diz o que a tela escreve, na hora em que ela escreve.

${filme.som?.narracao ? `## A gravação

Gravada (um arquivo só, \`${filme.som.narracao.arquivo}\`), transcrita (\`estudio/transcrever.py\`) e medida
(\`--medir\`): a tabela abaixo é o que foi dito e a hora em que cada fala entra no filme. Pra regravar uma fala, grave
de novo o arquivo inteiro na mesma ordem (ou só ela, e meça de novo).

` : ''}## Como gravar

- **Um arquivo por fala**, com o nome da tabela (\`01-abertura.mp3\`…), a mesma voz e os mesmos ajustes em todos. Sem
  música, sem silêncio sobrando no começo e no fim (até 0,2 s). MP3 ou WAV, 44,1 ou 48 kHz.
- **O tom**: calmo, perto, sem locução de comercial; frase curta, ponto final de verdade (a voz desce). Nada de animação
  na voz: a energia é da música e do corte.
- **Pronúncia**: "toLive" é "tu-láiv"; "tolive.app" é "tu-láiv ponto app"; "Open Finance" em inglês.
- **Caber na janela**: a coluna "cabe" é o máximo de palavras numa fala calma. Passou, a cena cresce em batidas inteiras
  e o filme fica mais longo; ficou curta, a cena segura a imagem.
- **A fala ${linhas.findIndex(l => l.catalogo) + 1} (o teste grátis) é do catálogo da conta**: se o teste mudar na conta, só ela se grava de novo.
- Os arquivos vão em \`assets/narracao/${filme.id}/\` (ou numa pasta do Google Drive: o Claude baixa de lá).

## O que o estúdio faz com o áudio

Mede onde cada fala começa e termina; cada cena passa a começar na fala dela (encaixada na batida mais perto), cada
palavra da abertura troca a tela, o toque cai na palavra dele, a tela apaga depois do "app", e a música baixa enquanto
a voz fala.

## As falas

| Arquivo | Janela (s) | Fala | Palavras / cabe | Na tela, junto |
| --- | --- | --- | --- | --- |
${linhas.map(l => `| \`${l.arquivo}\` | ${virgula(l.de)}–${virgula(l.ate)} | ${l.texto} | ${l.palavras} / ${l.cabe}${l.palavras > l.cabe ? ' ⚠' : ''} | ${l.nota} |`).join('\n')}
`;
}

/** O volume (RMS) do áudio em janelas de 20 ms. */
function volume(audio) {
  const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', audio, '-f', 's16le', '-ac', '1', '-ar', '1000', '-'], { maxBuffer: 1 << 28 });
  const amostras = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length >> 1), rms = [];
  for (let i = 0; i < amostras.length; i += 20) {
    let soma = 0; const fim = Math.min(amostras.length, i + 20);
    for (let k = i; k < fim; k++) soma += amostras[k] * amostras[k];
    rms.push(Math.sqrt(soma / Math.max(1, fim - i)));
  }
  return rms;
}

/**
 * As falas medidas: cada trecho da transcrição vira uma fala do filme (na ordem), com o corte no ponto mais quieto entre
 * o fim de uma e o começo da outra, e a entrada da voz (o primeiro trecho acima do limiar depois do corte).
 */
export function medirFalas(trechos, rms, ids) {
  if (trechos.length !== ids.length) throw new Error(`a transcrição tem ${trechos.length} falas e o filme, ${ids.length}: confira a ordem e junte ou separe trechos`);
  const t = i => i * 0.02, idx = s => Math.max(0, Math.min(rms.length - 1, Math.round(s / 0.02)));
  const limiar = Math.max(...rms) * 0.06;
  const cortes = [0];
  for (let k = 1; k < trechos.length; k++) {
    let melhor = idx(trechos[k - 1].fim - 0.1);
    for (let i = melhor; i <= idx(trechos[k].inicio + 0.25); i++) if (rms[i] < rms[melhor]) melhor = i;
    cortes.push(+t(melhor).toFixed(2));
  }
  cortes.push(+t(rms.length).toFixed(2));
  return ids.map((id, k) => {
    let voz = idx(cortes[k]);
    while (voz < rms.length - 1 && rms[voz] < limiar) voz++;
    // a transcrição escreve a marca do jeito dela ("ToLive", "2Live"): é toLive
    const marca = s => s.replace(/\b(To|2)Live\b/g, 'toLive');
    return { id, de: cortes[k], ate: cortes[k + 1], voz: +t(voz).toFixed(2), texto: marca(trechos[k].texto), palavras: trechos[k].palavras.map(p => ({ ...p, p: marca(p.p) })) };
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pasta = resolve(process.argv[2] ?? '');
  if (!existsSync(join(pasta, 'filme.mjs'))) { console.error('uso: node estudio/narracao.mjs videos/<id> [--medir <audio> <transcricao.json>]'); process.exit(2); }
  const filme = (await import(pathToFileURL(join(pasta, 'filme.mjs')).href)).default;
  if (!filme.narracao) { console.error(`${basename(pasta)} não tem narracao no filme.mjs`); process.exit(1); }
  const i = process.argv.indexOf('--medir');
  if (i > 0) {
    const [audio, transcricao] = process.argv.slice(i + 1).map(a => resolve(a));
    const falas = medirFalas(JSON.parse(readFileSync(transcricao, 'utf8')), volume(audio), filme.narracao.map(l => l.id));
    const raiz = fileURLToPath(new URL('..', import.meta.url));
    writeFileSync(join(pasta, 'narracao.json'), JSON.stringify({ arquivo: relative(raiz, audio), transcricao: relative(raiz, transcricao), falas }, null, 1) + '\n');
    for (const f of falas) console.log(`${f.id.padEnd(12)} ${f.de.toFixed(2).padStart(6)}–${f.ate.toFixed(2).padEnd(6)} voz ${f.voz.toFixed(2)}  ${f.texto}`);
    process.exit(0);
  }
  const guardado = JSON.parse(readFileSync(new URL('../conhecimento/planos.json', import.meta.url), 'utf8'));
  writeFileSync(join(pasta, 'narracao.md'), roteiroDeLocucao(filme, oQueDizer(guardado.resposta)));
  for (const l of linhasDaNarracao(filme, oQueDizer(guardado.resposta))) console.log(`${l.arquivo.padEnd(18)} ${virgula(l.de).padStart(5)} s  ${String(l.palavras).padStart(2)}/${l.cabe}  ${l.texto}`);
}
