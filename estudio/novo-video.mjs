// Começa um vídeo: videos/<data>-<produto>-<angulo>/ com a ficha (a memória), o briefing, o roteiro, a legenda,
// a crítica e um filme.mjs que já renderiza (o modelo, no registro do filme), montado com as features pedidas:
// título curto, linha de prova e captura de cada uma saem de conhecimento/produtos.json.
//
//   node estudio/novo-video.mjs financas antes-do-limite --features orcamento,projecao,vazamentos \
//     --palavras "Fatura|Mercado|Delivery|Susto no,dia 30" --frase "Cada um,pede um,pedaço,de você"
//   (| separa as batidas; a vírgula quebra a linha)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { produtos } from './historico.mjs';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));

const lista = (texto, padrao) => (texto ? texto.split('|').map(p => p.split(',').map(l => l.trim())) : padrao);

export function criarVideo({ produto, angulo, formato = 'stories', features, palavras, frase, data = new Date().toISOString().slice(0, 10), raiz = RAIZ }) {
  const catalogo = produtos();
  const p = catalogo[produto];
  if (!p) throw new Error(`produto desconhecido: ${produto} (use ${Object.keys(catalogo).join(', ')})`);
  if (!p.angulos[angulo]) throw new Error(`ângulo desconhecido pra ${produto}: ${angulo} (use ${Object.keys(p.angulos).join(', ')}, ou acrescente em conhecimento/produtos.json)`);
  const ids = features ? features.split(',').map(f => f.trim()) : Object.keys(p.features).filter(id => p.features[id].captura.length).slice(0, 3);
  // um vídeo da marca prova com a feature de um app: "financas:veredito"
  const escolhidas = ids.map(id => {
    const [de, fid] = id.includes(':') ? id.split(':') : [produto, id];
    const f = catalogo[de]?.features[fid];
    if (!f) throw new Error(`feature desconhecida pra ${de}: ${fid}`);
    if (!f.captura.length) throw new Error(`a feature ${id} não tem captura (acrescente em estudio/capturas.json e em produtos.json)`);
    const titulo = f.curto.split(' ').length > 2 ? [f.curto.split(' ').slice(0, -1).join(' '), f.curto.split(' ').at(-1)] : [f.curto];
    return { titulo, prova: f.linha, img: f.captura[0] };
  });
  const id = `${data}-${produto}-${angulo}`;
  const pasta = join(raiz, 'videos', id);
  if (existsSync(pasta)) throw new Error(`já existe: videos/${id}`);
  mkdirSync(pasta, { recursive: true });

  const nomeCurto = p.nome.replace(/^toLive ?/, '') || 'toLive';
  const palavrasJs = lista(palavras, [['Boleto'], ['Fatura'], ['Extrato'], ['Planilha'], ['Lembrete'], ['Susto no', 'dia 30']]);
  const fraseJs = lista(frase, [['Cada um', 'pede um', 'pedaço', 'de você']])[0];
  const trocas = {
    id, titulo: p.angulos[angulo].split(/[.:]/)[0].slice(0, 60), produto, formatos: formato, nomeCurto, dominio: p.dominio ?? 'financas',
    palavras: JSON.stringify(palavrasJs), frase: JSON.stringify(fraseJs), features: JSON.stringify(escolhidas, null, 2).replace(/\n/g, '\n'),
  };
  const modelo = readFileSync(join(RAIZ, 'estudio', 'modelo', 'filme.mjs'), 'utf8');
  writeFileSync(join(pasta, 'filme.mjs'), modelo.replace(/\{\{(\w+)\}\}/g, (_, k) => (['palavras', 'frase', 'features'].includes(k) ? trocas[k] : String(trocas[k] ?? '').replace(/'/g, "\\'"))));

  writeFileSync(join(pasta, 'ficha.json'), JSON.stringify({
    data, produto, titulo: trocas.titulo, serie: null, angulo, gancho: palavrasJs.map(l => l.join(' ')).join('. '), mensagens: [], features: ids,
    usa: ['teste'], cta: p.cta, status: 'rascunho', publicado: [], notas: '',
  }, null, 2) + '\n');
  writeFileSync(join(pasta, 'briefing.md'), `# Briefing · ${trocas.titulo}

- **Pedido:** (o que a pessoa pediu, com as palavras dela)
- **Produto:** ${p.nome} (${p.estado}). **Formato:** ${formato}.
- **Duração:** pela quantidade de features (116 BPM, um compasso por feature; ajuste no filme.mjs).
- **O filme em uma linha:** (o que quem assiste sente no fim)
- **Ângulo:** \`${angulo}\`: ${p.angulos[angulo]}
- **Features:** ${ids.join(', ')} (de conhecimento/produtos.json; a ficha.json já tem)
- **O que já foi dito** (node estudio/historico.mjs ${produto}): (o que este vídeo complementa, e o gancho que ele não repete)
- **Referência:** (um quadro, um vídeo, uma página do site: a gramática, nunca o conteúdo)
- **Assets reais:** ${escolhidas.map(f => '`' + f.img + '`').join(', ')} (assets/capturas/indice.json lista todos)
- **Preço / teste grátis:** (só do catálogo; diga se o vídeo usa e ponha em "usa" na ficha)
- **Som:** trilha inspiradora sintetizada, ou a música licenciada (som.musica, assets/musicas/)
`);
  writeFileSync(join(pasta, 'roteiro.md'), `# Roteiro · ${trocas.titulo} (116 BPM: batida = 0,517 s, compasso = 2,069 s)

| Compasso | Tempo | Na tela | Trilha |
| --- | --- | --- | --- |
| 0–1 | 0–4,1 | as palavras na batida; a frase com o ponto | intro |
| 2–3 | 4,1–8,3 | o sol nasce; a promessa; o respiro | sobe |
| 4… | 8,3… | uma feature por compasso, a primeira na virada | cheio |
| fim | … | a folha, o logo com o sol, o convite; parado | fim |
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
    const { id } = criarVideo({ produto, angulo, formato: op('formato'), features: op('features'), palavras: op('palavras'), frase: op('frase') });
    console.log(`videos/${id}/ criado. Agora: briefing.md, roteiro.md, e node estudio/render.mjs videos/${id} --batidas`);
  } catch (erro) {
    console.error(erro.message);
    process.exit(1);
  }
}
