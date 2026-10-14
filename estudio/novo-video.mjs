// Começa um vídeo: videos/<data>-<produto>-<angulo>/ com a ficha (a memória), o briefing, o roteiro, a legenda,
// a crítica e um filme.mjs que já renderiza (o modelo), apontado pra captura e pro texto que você der.
//
//   node estudio/novo-video.mjs financas vazamento --formato stories --captura toly-balao \
//     --gancho "Três assinaturas" --gancho2 "paradas" --frase "R$ 87 por mês, achados sem você procurar."

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { produtos } from './historico.mjs';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));

export function criarVideo({ produto, angulo, formato = 'stories', captura = 'celular-inicio', gancho = 'Tudo em', gancho2 = 'ordem', frase = 'Nada exige sua atenção hoje.', data = new Date().toISOString().slice(0, 10), raiz = RAIZ }) {
  const catalogo = produtos();
  const p = catalogo[produto];
  if (!p) throw new Error(`produto desconhecido: ${produto} (use ${Object.keys(catalogo).join(', ')})`);
  if (!p.angulos[angulo]) throw new Error(`ângulo desconhecido pra ${produto}: ${angulo} (use ${Object.keys(p.angulos).join(', ')}, ou acrescente em conhecimento/produtos.json)`);
  const id = `${data}-${produto}-${angulo}`;
  const pasta = join(raiz, 'videos', id);
  if (existsSync(pasta)) throw new Error(`já existe: videos/${id}`);
  mkdirSync(pasta, { recursive: true });

  const nomeCurto = p.nome.replace(/^toLive ?/, '') || 'toLive';
  const trocas = { id, titulo: `${gancho} ${gancho2}`.trim(), produto, formatos: formato, captura, gancho1: gancho, gancho2, frase, nomeCurto, dominio: p.dominio ?? 'financas' };
  const modelo = readFileSync(join(RAIZ, 'estudio', 'modelo', 'filme.mjs'), 'utf8');
  writeFileSync(join(pasta, 'filme.mjs'), modelo.replace(/\{\{(\w+)\}\}/g, (_, k) => String(trocas[k] ?? '').replace(/'/g, "\\'")));

  writeFileSync(join(pasta, 'ficha.json'), JSON.stringify({
    data, produto, titulo: trocas.titulo, serie: null, angulo, gancho: `${gancho} ${gancho2}`.trim(), mensagens: [], features: [],
    usa: [], cta: p.cta, duracao: 12, status: 'rascunho', publicado: [], notas: '',
  }, null, 2) + '\n');
  writeFileSync(join(pasta, 'briefing.md'), `# Briefing · ${trocas.titulo}

- **Pedido:** (o que a pessoa pediu, com as palavras dela)
- **Produto:** ${p.nome} (${p.estado}). **Formato:** ${formato}.
- **Duração:** 12 s a 92 BPM (ajuste no filme.mjs).
- **O filme em uma linha:** (o que quem assiste sente no fim)
- **Ângulo:** \`${angulo}\`: ${p.angulos[angulo]}
- **Features:** (ids de conhecimento/produtos.json; ponha também na ficha.json)
- **O que já foi dito** (node estudio/historico.mjs ${produto}): (o que este vídeo complementa, e o gancho que ele não repete)
- **Referência:** (um quadro, um vídeo, uma página do site: a gramática, nunca o conteúdo)
- **Assets reais:** \`${captura}\` (assets/capturas/indice.json lista todos)
- **Preço / teste grátis:** (só do catálogo; diga se o vídeo usa e ponha em "usa" na ficha)
- **Som:** trilha sintetizada (som.mjs) ou a música trazida (batidas.mjs)
`);
  writeFileSync(join(pasta, 'roteiro.md'), `# Roteiro · ${trocas.titulo} (12 s, 92 BPM: batida = 0,652 s)

| Batida | Tempo | Na tela | Som |
| --- | --- | --- | --- |
| 0 | 0,00 | (o gancho já no quadro 0) | — |
| … | … | (algo novo a cada 2 a 4 s; o fim parado) | … |
`);
  writeFileSync(join(pasta, 'legenda.md'), `# Legenda do post

<!-- A mesma voz da tela: calma, breve, concreta, sem emoji e sem exclamação. Fato antes do pedido. -->

(o texto)

tolive.app
`);
  writeFileSync(join(pasta, 'critica.md'), `# Crítica · ${trocas.titulo}

Rubrica e regras: \`.claude/skills/tolive-video-critica/SKILL.md\`. Notas de 1 a 10; só sai com tudo 8 ou mais.

## Rodada 1 · folha de batidas

| Gancho | Leitura no celular | Movimento | Variedade | Composição | Marca | Som |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

1.
2.
3.
`);
  return { id, pasta };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [produto, angulo] = process.argv.slice(2).filter((a, i, l) => !a.startsWith('--') && !(l[i - 1] ?? '').startsWith('--'));
  const op = k => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : undefined; };
  try {
    const { id } = criarVideo({ produto, angulo, formato: op('formato'), captura: op('captura'), gancho: op('gancho'), gancho2: op('gancho2'), frase: op('frase') });
    console.log(`videos/${id}/ criado. Agora: briefing.md, roteiro.md, e node estudio/render.mjs videos/${id} --batidas`);
  } catch (erro) {
    console.error(erro.message);
    process.exit(1);
  }
}
