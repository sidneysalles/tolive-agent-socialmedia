// O roteiro de locução de um vídeo (videos/<id>/narracao.md), do `narracao` do filme: cada fala com a janela dela, o
// limite de palavras pra caber e o nome do arquivo que o áudio deve ter. A fala diz o que a tela escreve (o pedido do
// Sidney, out/2026: olhar e ouvir ao mesmo tempo; e quem vê sem som lê a mesma coisa). A do teste grátis sai do
// catálogo da conta, por extenso.
//
//   node estudio/narracao.mjs videos/<id>

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
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

## Como gravar

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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pasta = resolve(process.argv[2] ?? '');
  if (!existsSync(join(pasta, 'filme.mjs'))) { console.error('uso: node estudio/narracao.mjs videos/<id>'); process.exit(2); }
  const filme = (await import(pathToFileURL(join(pasta, 'filme.mjs')).href)).default;
  if (!filme.narracao) { console.error(`${basename(pasta)} não tem narracao no filme.mjs`); process.exit(1); }
  const guardado = JSON.parse(readFileSync(new URL('../conhecimento/planos.json', import.meta.url), 'utf8'));
  writeFileSync(join(pasta, 'narracao.md'), roteiroDeLocucao(filme, oQueDizer(guardado.resposta)));
  for (const l of linhasDaNarracao(filme, oQueDizer(guardado.resposta))) console.log(`${l.arquivo.padEnd(18)} ${virgula(l.de).padStart(5)} s  ${String(l.palavras).padStart(2)}/${l.cabe}  ${l.texto}`);
}
