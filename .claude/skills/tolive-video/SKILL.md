---
name: tolive-video
description: Faz um vídeo de motion graphics pra vender um produto da toLive (Finanças, a suíte, o Fé em teste), renderizado de código, com a marca, as telas reais e a memória do que já foi dito. Use quando pedirem vídeo, reels, stories, post animado, anúncio, vídeo de lançamento ou de feature ("preciso de um vídeo do Finanças pra stories", "faz um reels sobre a projeção").
---

# Fazer um vídeo da toLive

O estúdio já existe: motor (`estudio/`), marca (`marca/`, `conhecimento/marca-em-video.md`), produtos
(`conhecimento/produtos.json`, `conhecimento/site/`), telas reais (`assets/capturas/`) e memória (`videos/*/ficha.json`).
Isto aqui é o caminho, com os portões. **Não pule portão**: o curso que deu origem a isto (`conhecimento/curso-motion.md`)
mostra que o vídeo bom sai do laço, não do prompt. Filme novo vale esforço alto (xhigh); ajuste, médio.

**A direção (Sidney, 14/10/2026):** inspirador, na pegada dos filmes da Apple. Propósito primeiro, features como prova,
corte na batida, o sol nascendo atrás do horizonte como assinatura. O primeiro vídeo (calmo, lento, trilha de colchão)
foi **reprovado**: não volte a ele. O "registro do filme" está em `conhecimento/marca-em-video.md`; o modelo já nasce nele.

## 0. O que perguntar (só o que faltar)

- **Produto**: financas, fe (só teaser) ou suite (a marca). **Formato**: stories, reels, feed (vários saem da mesma linha
  do tempo). Duração, se a pessoa tiver preferência (padrão: 12 a 16 s).
- O ângulo é opcional: se não vier, você propõe (passo 1). Não pergunte o que dá pra decidir pela memória.

## 1. Ler antes de propor (sem isso o vídeo repete o anterior)

```sh
node estudio/conhecimento.mjs        # o site de hoje; git diff conhecimento/ mostra o que mudou no produto
node estudio/historico.mjs financas  # o que já foi dito, o que nunca foi, os ganchos usados, o que ficou velho
```

Olhe também os `videos/*/saida/*/poster.png` e `contato.png` dos últimos vídeos: o próximo não repete composição nem gancho.
Proponha **três ângulos** (de `produtos.json`, ou um novo se o site sustentar), cada um com o gancho em até cinco palavras,
as features (ids) e o que ele **complementa** no que já saiu. Recomende um. Ângulo novo entra em `produtos.json`.

## 2. Começar

```sh
node estudio/novo-video.mjs <produto> <angulo> --features open-finance,orcamento,projecao \
  --palavras "Fatura|Mercado|Delivery|Susto no,dia 30" --frase "Cada um,pede um,pedaço,de você"
```

(`|` separa as batidas da intro; a vírgula quebra a linha. Cada feature leva o título curto, a linha de prova e a
captura de `produtos.json`; feature sem captura não entra na montagem.)

Preencha o `briefing.md` (o filme em uma linha: o que quem assiste **sente** no fim), a `ficha.json` (features, "usa":
["teste"] se falar do teste grátis, "preco" se falar de preço, série se houver) e as capturas (`assets/capturas/indice.json`;
falta uma? acrescente em `estudio/capturas.json` e rode `node estudio/capturar.mjs`). **Nunca redesenhe a interface de
cabeça**: anime a captura. Elemento solto (um papel, um rótulo) pode ser desenhado com o texto e as cores do site.

**As telas do app de verdade** (o melhor material): clone o `tolive-financas` ao lado, rode `node local/local.mjs
--dia=2026-10-13` lá e `node estudio/capturar-app.mjs` aqui (dados simulados, nomes reais trocados; `estado` diz se a
tela é de calma ou de aviso). No filme, `d.celular(g, img, x, y, w)` põe a tela num aparelho.

**A música** (o padrão; a síntese é só reserva): uma faixa CC0 ou CC BY (onde achar e o que não serve:
`assets/musicas/LICENCAS.md`), registrada lá com o crédito; `node estudio/batidas.mjs <faixa> --trecho 5,6` diz onde
cortar; o filme usa o BPM medido e `som: { musica, inicio, fimDe, volumeEfeitos }`; o crédito vai na `legenda.md` e
em `ficha.musica`. Diga a quem pediu que a escolha foi pela análise, sem ouvir.

## 3. Portão: a aprovação (a música primeiro, depois os quadros) — antes de qualquer render inteiro

Pedido do Sidney (14/10/2026): nada é renderizado sem ele aprovar a música e os quadros. A ordem importa: os cortes caem
na batida da música, então a música vem antes.

```sh
node estudio/musicas.mjs videos/<id> [--clima "mais calma, piano"]   # 5 candidatas, o trecho exato que entraria
node estudio/aprovacao.mjs videos/<id> quadros                        # os quadros-chave (filme.quadros)
node estudio/aprovacao.mjs videos/<id> previa                         # um trecho com movimento e som (filme.previa)
node estudio/aprovacao.mjs videos/<id> pagina                         # a página e o mapa de arquivos
```

Publique a página (Artifact, `file_path` = `videos/<id>/aprovacao/index.html`, `files` = o mapa, `capabilities`
`{ db: {}, user: {} }` na primeira vez) e guarde a URL em `ficha.aprovacao.pagina`; rodadas novas republicam no mesmo
endereço. Quando a pessoa disser que escolheu ou comentou, leia (ArtifactData `get` `musica/escolha` e `musica/pedido`,
`list` `quadros`), e:
- **escolha** → `node estudio/musicas.mjs videos/<id> --escolher <faixa>` (vira o `musica.json`, a licença e o crédito);
- **pedido de outras** → `musicas.mjs` de novo com o `--clima` que ela escreveu, `pagina`, republique;
- **comentários nos quadros** → mude o filme, refaça `quadros` (e `previa` se mexeu em movimento), republique;
- **tudo aprovado** → `aprovacao.mjs registrar` com o que leu, e só então o render inteiro.

## 3b. O roteiro na grade de batidas

Escreva o `roteiro.md`: tabela compasso → tempo → na tela → trilha (intro, sobe, cheio, fim) → som. Gancho no quadro 0;
a cena nova chega **no** tempo forte; uma feature por compasso a partir da virada; um laranja por quadro; fim parado de
1,5 a 2 s. **Mostre o roteiro e espere o OK** antes de animar (se a pessoa já disse "faz tudo",
siga e diga que seguiu).

## Narração (quando pedirem voz)

A fala diz **o que a tela escreve, na hora em que ela escreve** (Sidney, 14/10/2026: olhar e ouvir ao mesmo tempo; e
quem vê sem som, a maioria no feed, lê a mesma coisa). Ponha `narracao: [{ id, de, ate, texto, nota }]` no filme
(a do teste grátis com `catalogo: true`, arquivo à parte) e rode `node estudio/narracao.mjs videos/<id>`: o
`narracao.md` é o roteiro de locução, com o limite de palavras de cada janela. Fala que não cabe faz a cena crescer
em batidas inteiras. O áudio volta um arquivo por fala; aí os cortes seguem a fala e a música baixa sob a voz.

## 4. Animar

O `filme.mjs` (o modelo já renderiza): `cenas` com `de/ate` e `desenhar(g, t, ctx, tGlobal)`, mais `quadros` (os
quadros-chave da aprovação), `previa` ({ de, ate }) e `musica` ({ antes, depois, compassos }: o que a música precisa ter).
A música vem do `musica.json` ao lado (`import musica from './musica.json' with { type: 'json' }`).
**As telas do app se constroem** (a referência da ElevenLabs, `conhecimento/referencias.md`): importe as camadas
(`assets/capturas/camadas/<tela>/camadas.json`), ponha `assetsDasCamadas(apelido, cam)` nos assets e desenhe com
`d.app3d(g, L, { cam, img: ctx.img, apelido, w, t: tl, pose, toque, depois, graficos, barras, apaga })`: o celular em
perspectiva 3D (WebGL), as peças pousando nele, tudo recortado pela tela (decisão do Sidney). A câmera é a `pose`
({ rx, ry, escala, fx, fy em px do app, x, y no quadro }) animada com `m.poses(tl, chaves)`: **um plano por feature**
(o pedido do Sidney, out/2026): entra por um ângulo diferente (de lado, de baixo, do alto, de longe), o app inteiro,
depois a câmera vai ao detalhe. **A tela sendo usada**: capture com `uso` em `capturas-app.json` (o botão de verdade,
a tela de depois e a barra de confirmação do app) e passe `toque: { em }` e `depois: { cam, apelido, em }`; gráfico que
se desenha (`graficos`) e barra que cresce da base (`barras`, cartões do site com `pecas` em `capturas.json`). A
referência é a feature do filme Propósito (`enquadrar` e as chaves dele). `d.telaMontada3d` (a pose antiga) e
`d.telaMontada` (plana) continuam. Print parado (`d.celular`) só quando a tela não tem camadas.
Ferramentas no `ctx`:
- `ctx.m` (movimento.mjs): `revela` (o tipo que bate), `anima(t, inicio, dur, CURVA.forte)`, `FILME` (as durações do
  filme), `CURVA.empurra`, `poses` (a câmera em planos), `trilha`, `trocaAlfa`, `MOLAS`, `DUR`, `semente`. **Só função de t.**
- `ctx.d` (desenho.mjs): `textoRevelado` (máscara, com o ponto da marca; passe `maxW: L.seguro.w`), `camera`, `veredito`,
  `texto`, `paragrafo`, `cartao`, `pilula`, `etiqueta`, `imagem`, `logoComSol`, `simbolo` (o sol nascendo).
- `ctx.corte(t)`: o começo do quadro. **Decisão de corte seco (qual palavra, qual cena) usa ele**, senão o borrão de
  movimento mistura as duas cenas num quadro cinza.
- `ctx.L` (o formato: `W`, `H`, `u`, `seguro`), `ctx.COR`, `ctx.dominio(app)`, `ctx.img.<asset>`, `ctx.catalogo`
  (`teste`, `aPartirDe`: **o único lugar de preço e teste grátis**).
- A trilha: `som.estilo: 'inspiradora'` com `secoes` em compassos; os sons em `som.sons` (`bate`, `passa`, `toque`,
  `entra`, `assenta`, `troca`). Música licenciada: `som.musica` (ver `marca-em-video.md`, Som).

Prévia ao vivo: `node estudio/servidor.mjs` e abra `…/estudio/palco.html?video=videos/<id>&formato=stories`.

## 5. Portão: a folha de batidas e a crítica (no mínimo três rodadas)

```sh
node estudio/texto.mjs videos/<id>                          # a voz (o render também confere)
node estudio/render.mjs videos/<id> --batidas --formato stories,feed
```

Abra a `batidas.png` com o Read e **olhe de verdade**. Siga a skill `tolive-video-critica`: nota, os três piores problemas
com o tempo, conserto, de novo. Registre cada rodada no `critica.md`. Só passa com tudo 8 ou mais.

## 6. Render, folhas e a última olhada

```sh
node estudio/render.mjs videos/<id> --formato stories,feed --sub 8   # final.mp4, contato.png, celular.png, poster.png
```

Olhe `contato.png` e `celular.png` (a 360 px de largura: dá pra ler?). Empurrão e corte: `node estudio/critica.mjs
<final.mp4> --faixa <s>` (12 quadros seguidos; cópias fantasmas pedem mais `--sub`). Refazer só um trecho: `--de 4 --ate 8`.
`--sub 8` com o obturador de 180° (padrão) dá o borrão de filme; sem `--sub`, o empurrão trepida.

## 7. Entregar e lembrar

- Mande o `final.mp4` de cada formato (SendUserFile), o pôster e a `legenda.md` (mesma voz; `texto.mjs` confere).
- Reprovado pela pessoa? `status: "reprovado"` e `reprovado: { quando, por, motivo, o_que_ficou }` com as palavras dela:
  não conta como dito, mas a pauta lê e não repete. Aprovou uma direção? Vira regra em `marca-em-video.md` (decisões).
- `ficha.json`: `status: "entregue"`; quando a pessoa disser onde postou, `"publicado"` e `publicado: [{ "onde", "quando", "link" }]`.
  Resultado (views, salvos) entra em `notas` quando vier: é o que a pauta usa pra decidir o próximo.
- Diga em uma linha o que você melhoraria no próximo. Commit com a pasta do vídeo (o mp4 não vai pro git: refaz-se do filme).
- Aprendeu algo que vale pra todo vídeo? Uma linha em `conhecimento/marca-em-video.md` (regra) ou em `CLAUDE.md` (motor).

## O que mais se erra

- Lento e morno (o primeiro vídeo): tudo subindo em 400 ms, nada na batida, trilha de colchão. Reprovado.
- Título no meio sobre fundo liso, tudo em fade, logo no fim: o vídeo genérico. Tipo revelado por máscara, à esquerda,
  enorme; produto real entrando com a câmera; a folha da noite no fim.
- Quadro da batida vazio (o título só começa depois): a cena tem que estar chegando no tempo forte.
- Quique, overshoot, câmera flutuando, número contando: proibidos pela marca, mesmo o curso pedindo.
- Preço ou "30 dias grátis" escrito no filme; feature que o site não promete; tela de app que não existe (Saúde, Casa, Pessoas).
- O Toly como mascote ou narrador (ver `marca-em-video.md`).
- Texto fora de `L.seguro` (some sob a interface do Instagram); texto abaixo de 28 px (ilegível no celular).
