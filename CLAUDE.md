# toLive · estúdio de vídeo

## Finalidade

Fazer os vídeos que vendem a toLive (stories, reels, feed): motion graphics **renderizados de código**, com a marca,
as telas reais dos produtos, a voz da toLive e a memória do que já foi dito. O pedido típico é uma frase ("um vídeo do
Finanças pra stories sobre a projeção"); o resto está aqui. Não é um app: não tem servidor no ar, login nem banco.

Nasceu em 14/10/2026 do curso de motion com o Opus 5.5 (`conhecimento/curso-motion.md`, destrinchado passo a passo).
O curso dá o arreio (render por `seek(t)`, molas, batida, som, crítica dos próprios quadros); a marca dá o gosto.
Quando os dois discordam, vale a marca (`conhecimento/marca-em-video.md`).

## Como pedir e como fazer

- Vídeo novo: a skill **`tolive-video`** (o caminho com os portões). O que dizer: a **`tolive-video-pauta`**. Antes de
  mostrar ou entregar: a **`tolive-video-critica`**. Marca: **`tolive-marca`** (o guia inteiro vem junto).
- Esforço: filme novo em alto (xhigh); ajuste e re-render, médio. "Uma sessão por marca" (o curso): este repositório é
  essa sessão que não se perde.

## A base da toLive

Segue o **tolive-base** (github.com/sidneysalles/tolive-base): a marca está copiada em `marca/` e as skills da base em
`.claude/skills/tolive-{marca,stack,aprendizado}` (versão em `VERSAO-DO-TOLIVE-BASE`). **Não se edita a cópia.** Com o
tolive-base clonado ao lado: `npm run base` (e `npm run base:conferir`). As skills de vídeo (`tolive-video*`) são
daqui: só sobem pra base se outro repositório passar a usar.

Onde sai da base, e por quê:
- **Não é app** (sem `backend/`, `publico/`, deploy, Supabase): é uma ferramenta que roda na máquina ou na sessão do
  Claude e produz arquivos. A marca fica em `marca/` (não em `publico/marca/`), porque nada é servido ao público.
- **Usa o Playwright da máquina** (não está no `package.json`): é o único jeito de pintar o canvas com as fontes da marca
  e fotografar quadro a quadro. Continua zero dependência no repositório; `estudio/navegador.mjs` acha o Playwright
  instalado (local, global, `/opt/node-tools` na nuvem). Na máquina, uma vez: `npm i -g playwright && npx playwright
  install chromium`. Precisa também de `ffmpeg`.

## O contrato do render (não quebrar)

- Todo filme é função pura do tempo: `window.seek(t)` pinta o quadro t. **Nada de** `setTimeout`, `requestAnimationFrame`
  no render, transição de CSS, `Math.random` (use `semente(n)`), estado guardado entre quadros. O mesmo t pinta o mesmo
  quadro em qualquer ordem (`test/palco.test.mjs` confere em todo vídeo).
- As cenas desenham contra o layout (`L.W`, `L.H`, `L.u`, `L.seguro`), nunca pixel fixo: uma linha do tempo, todos os
  formatos. Texto só dentro de `L.seguro`.
- Cor só de `estudio/cores.mjs` (que o teste confere contra `marca/tokens.css` e `marca/dominios.css`). Nenhum outro
  arquivo escreve hexadecimal, nem os filmes.
- Movimento só de `estudio/movimento.mjs`: as curvas e durações do guia, molas com amortecimento crítico ou maior. Sem
  quique, sem número contando, sem nada se mexendo depois de parado.
- Preço e teste grátis só de `ctx.catalogo` (a conta toLive, lida no render). `estudio/texto.mjs` reprova o escrito à mão.
- H.264 yuv420p, CRF 16, 30 fps (60 se o movimento pedir), AAC 192k, −14 LUFS.

## Visual proibido (o vídeo genérico de IA e o que a marca não deixa)

Título no meio sobre fundo liso ou degradê; tudo aparecendo por fade; logo solto no fim; rótulo e texto nos cantos;
moldura; brilho na interface; explosão de partículas; quique; parallax; câmera flutuando; loop "perfeito" no lugar do fim
parado; número girando; mais de um laranja no quadro; o Toly como mascote; interface redesenhada de cabeça (use a captura).

## Antes de mostrar qualquer coisa

1. `node estudio/render.mjs videos/<id> --batidas` e **olhe** a folha (Read).
2. Nota de 1 a 10 na rubrica da `tolive-video-critica`; os três piores problemas com o tempo; conserte. Repita até tudo 8+.
3. Só então o render inteiro, e olhe `contato.png` e `celular.png` de novo.

## Organização

```
estudio/
  movimento.mjs     curvas, durações, molas, trilha, semente, grade de batidas (puro, testado)
  formatos.mjs      stories, reels, feed, quadrado, horizontal e a área segura de cada um
  cores.mjs         as cores da marca e dos domínios (a única fonte de cor)
  desenho.mjs       veredito com o ponto, texto, cartão, pílula, etiqueta, imagem, logo com o sol nascendo
  palco.html/.mjs   o canvas que carrega um filme e expõe window.seek(t); prévia no navegador
  render.mjs        Playwright → ffmpeg → trilha → mixagem → folhas (e --batidas, --quadros, --de/--ate)
  som.mjs           a trilha e os sons de interface, sintetizados e determinísticos
  batidas.mjs       mede andamento e batidas de uma música trazida
  critica.mjs       contato, celular, faixa, pôster
  texto.mjs         confere o texto da tela e da legenda contra a voz da marca
  catalogo.mjs      preço e teste grátis da conta toLive (conhecimento/planos.json guarda o último)
  capturar.mjs      as telas reais do site → assets/capturas (capturas.json diz quais)
  conhecimento.mjs  o texto do site → conhecimento/site/ (o diff mostra o que o produto ganhou)
  historico.mjs     a memória: o que já foi dito, o que nunca foi, o que ficou velho
  novo-video.mjs    começa um vídeo a partir de estudio/modelo/filme.mjs (que já renderiza)
conhecimento/       curso-motion.md, marca-em-video.md, produtos.json (features e ângulos com id), site/, planos.json
assets/capturas/    as telas do site em 3x, fundo transparente, e indice.json
videos/<data>-<produto>-<angulo>/
  ficha.json        a memória deste vídeo (produto, ângulo, gancho, features, status, onde saiu, catálogo usado)
  briefing.md, roteiro.md, legenda.md, critica.md, filme.mjs
  saida/<formato>/  final.mp4 (fora do git), poster.png, contato.png, celular.png, batidas.png
marca/              a cópia do tolive-base (não editar)
test/               node:test
```

## Rodar e testar

```sh
npm test                                              # tudo, inclusive o palco no Chromium (pula sem Playwright)
node estudio/novo-video.mjs financas projecao-meta    # começa um vídeo
node estudio/render.mjs videos/<id> --batidas         # a folha antes do render
node estudio/render.mjs videos/<id> --formato stories,feed
node estudio/servidor.mjs                             # prévia ao vivo no navegador
node estudio/historico.mjs                            # a memória
```

## O que já se aprendeu aqui

- O quadro 0 é a miniatura em alguns feeds: o gancho já tem que estar nele (o teste do palco reprova quadro 0 vazio). (out/2026)
- Linha de veredito forçada não quebra sozinha: passe `maxW: L.seguro.w` e o `veredito()` encolhe até caber. (out/2026)
- Captura por posição (`nth=`) troca de cartão quando o site muda; selecione pelo texto do rótulo. (out/2026)
- `loudnorm` numa passada só fica ~1 dB abaixo num clipe curto; o render mede e aplica em duas. (out/2026)
- O preço de exemplo do site ("Streaming parado, R$ 39,90 por mês") não é preço da toLive; o `texto.mjs` só reprova os
  preços que a conta cobra e "a partir de R$" / "N dias grátis". (out/2026)
