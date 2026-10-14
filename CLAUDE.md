# toLive · estúdio de vídeo

## Finalidade

Fazer os vídeos que vendem a toLive (stories, reels, feed): motion graphics **renderizados de código**, com a marca,
as telas reais dos produtos, a voz da toLive e a memória do que já foi dito. O pedido típico é uma frase ("um vídeo do
Finanças pra stories sobre a projeção"); o resto está aqui. Não é um app: não tem servidor no ar, login nem banco.

Nasceu em 14/10/2026 do curso de motion com o Opus 5.5 (`conhecimento/curso-motion.md`, destrinchado passo a passo).
O curso dá o arreio (render por `seek(t)`, molas, batida, som, crítica dos próprios quadros); a marca dá o gosto.
Quando os dois discordam, vale a marca (`conhecimento/marca-em-video.md`).

**A direção** (Sidney, 14/10/2026, reprovando o primeiro vídeo por "lento, trilha horrível, fraco"): **inspirador, na
pegada dos filmes da Apple**: o propósito da marca primeiro, as features como prova, corte na batida, a trilha que vira
nas features, o sol nascendo atrás do horizonte como assinatura. A referência é `videos/2026-10-14-financas-proposito`.

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
- Movimento só de `estudio/movimento.mjs`: o registro do filme (`CURVA.forte`, `revela`, `FILME`) e, na tela do app, as
  curvas do guia; molas com amortecimento crítico ou maior. Sem quique, sem número contando, sem câmera flutuando.
- Corte seco decide pelo `ctx.corte(t)` (o começo do quadro); o palco já faz isso na troca de cena.
- Preço e teste grátis só de `ctx.catalogo` (a conta toLive, lida no render). `estudio/texto.mjs` reprova o escrito à mão.
- H.264 yuv420p, CRF 16, 30 fps, `--sub 8` com obturador de 180° no render final, AAC 192k estéreo, −14 LUFS.

## Visual proibido (o vídeo genérico de IA e o que a marca não deixa)

Lento e morno (o primeiro vídeo, reprovado); título no meio sobre fundo liso ou degradê; tudo aparecendo por fade; logo solto no fim; rótulo e texto nos cantos;
moldura; brilho na interface; explosão de partículas; quique; parallax; câmera flutuando; loop "perfeito" no lugar do fim
parado; número girando; mais de um laranja no quadro; o Toly como mascote; interface redesenhada de cabeça (use a captura).

## Nada se renderiza inteiro sem aprovação

Decisão do Sidney (14/10/2026): a música e os quadros-chave são aprovados numa página antes do render (a skill
`tolive-video`, passo 3). A música primeiro, porque os cortes caem na batida dela. Vídeo e tudo do estúdio ficam só neste
repositório (nada vai pro tolive-financas, tolive-base ou outro).

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
  som.mjs           os sons de interface, a trilha (ou a música licenciada) e o estéreo
  trilha-inspiradora.mjs  a trilha padrão: intro, subida, virada nas features, fim
  batidas.mjs       mede andamento e batidas de uma música trazida
  critica.mjs       contato, celular, faixa, pôster
  texto.mjs         confere o texto da tela e da legenda contra a voz da marca
  catalogo.mjs      preço e teste grátis da conta toLive (conhecimento/planos.json guarda o último)
  capturar.mjs      as telas reais do site → assets/capturas (capturas.json diz quais)
  capturar-app.mjs  as telas do app de verdade (o `npm run local` do tolive-financas, dados simulados, nomes trocados)
  conhecimento.mjs  o texto do site → conhecimento/site/ (o diff mostra o que o produto ganhou)
  historico.mjs     a memória: o que já foi dito, o que nunca foi, o que ficou velho
  novo-video.mjs    começa um vídeo a partir de estudio/modelo/filme.mjs (que já renderiza)
  musicas.mjs       as músicas candidatas (catálogo do Incompetech, medidas e cortadas no trecho do vídeo) e a escolhida
  aprovacao.mjs     a aprovação antes do render: quadros-chave, prévia do movimento e a página (Artifact com db)
  camadas.mjs       as telas desmontadas no filme (os assets e a ordem de chegada das peças)
  cena3d.mjs        perspectiva 3D pelo WebGL (planos com textura, câmera): o celular inclinado e as peças em profundidade
conhecimento/       curso-motion.md, marca-em-video.md, produtos.json (features e ângulos com id), site/, planos.json
assets/capturas/    as telas do site em 3x, fundo transparente, e indice.json
assets/musicas/     música licenciada (CC0 ou CC BY; a licença e o crédito em LICENCAS.md; o teste confere)
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
- Com borrão de movimento, um corte seco no meio de um quadro vira um quadro cinza (as duas cenas misturadas): a escolha
  da cena usa o começo do quadro (`ctx.corte`). E obturador de 360° com 4 subquadros vira cópias fantasmas no empurrão:
  180° e 8 subquadros. (out/2026)
- O quadro da batida tem que ter a cena chegando: subida começando 0,08 a 0,12 s antes. Na virada, um quadro em branco
  apaga o impacto da música. (out/2026)
- O primeiro vídeo seguiu o guia de interface ao pé da letra (400 ms, calmo, 90 BPM) e foi reprovado por lento. O guia de
  movimento é da tela do app; vídeo de venda tem o registro dele (marca-em-video.md). (out/2026)
- Música: síntese em código não soa como trilha de estúdio. O padrão é a faixa licenciada (CC0/CC BY), escolhida e
  cortada pela análise (`batidas.mjs --trecho`): a virada da música na primeira feature e o fim dela no logo. CC BY-ND
  não serve pra vídeo (sincronizar é derivar), SA e NC também não. (out/2026)
- As telas do app: o `npm run local` do Finanças dá o app de verdade com dado simulado, mas os membros são o Sidney e a
  Letícia de verdade; o `capturar-app.mjs` troca os nomes e recusa a foto se sobrar algum. (out/2026)
- Quadro parado não mostra movimento: a página de aprovação leva uma prévia curta com som (`aprovacao.mjs previa`).
  E a tela do app entra construída peça por peça (camadas), não como print (o pedido do Sidney, out/2026).
- A medição de andamento erra pela metade em faixas calmas (60 numa de 120, trecho de 56 s): com o andamento do catálogo
  como dica (`estimarBatidas(…, { bpmPerto })`), a busca fica a 6% dele. (out/2026)
- O pedido "quero outras 5" fica guardado na página, mas quem busca é o Claude: a página diz que está esperando, e a
  pessoa precisa avisar no chat (o Sidney pediu e não viu nada, out/2026).
- Chave de API nunca no chat: a sessão recusa usar a que foi colada (vazada no histórico). Vai nas configurações do
  ambiente. (out/2026)
- O preço de exemplo do site ("Streaming parado, R$ 39,90 por mês") não é preço da toLive; o `texto.mjs` só reprova os
  preços que a conta cobra e "a partir de R$" / "N dias grátis". (out/2026)
