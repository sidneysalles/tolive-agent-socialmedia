---
name: tolive-video
description: Faz um vídeo de motion graphics pra vender um produto da toLive (Finanças, a suíte, o Fé em teste), renderizado de código, com a marca, as telas reais e a memória do que já foi dito. Use quando pedirem vídeo, reels, stories, post animado, anúncio, vídeo de lançamento ou de feature ("preciso de um vídeo do Finanças pra stories", "faz um reels sobre a projeção").
---

# Fazer um vídeo da toLive

O estúdio já existe: motor (`estudio/`), marca (`marca/`, `conhecimento/marca-em-video.md`), produtos
(`conhecimento/produtos.json`, `conhecimento/site/`), telas reais (`assets/capturas/`) e memória (`videos/*/ficha.json`).
Isto aqui é o caminho, com os portões. **Não pule portão**: o curso que deu origem a isto (`conhecimento/curso-motion.md`)
mostra que o vídeo bom sai do laço, não do prompt. Filme novo vale esforço alto (xhigh); ajuste, médio.

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
node estudio/novo-video.mjs <produto> <angulo> --formato stories --captura <nome> --gancho "…" --gancho2 "…" --frase "…"
```

Preencha o `briefing.md` (o filme em uma linha: o que quem assiste **sente** no fim), a `ficha.json` (features, "usa":
["teste"] se falar do teste grátis, "preco" se falar de preço, série se houver) e as capturas (`assets/capturas/indice.json`;
falta uma? acrescente em `estudio/capturas.json` e rode `node estudio/capturar.mjs`). **Nunca redesenhe a interface de
cabeça**: anime a captura. Elemento solto (um papel, um rótulo) pode ser desenhado com o texto e as cores do site.

## 3. Portão: o roteiro na grade de batidas

Escreva o `roteiro.md`: tabela batida → tempo → na tela → som. Gancho no quadro 0; algo novo a cada 2 a 4 s; um laranja
por quadro; fim parado de 1,5 a 2 s. **Mostre o roteiro e espere o OK** antes de animar (se a pessoa já disse "faz tudo",
siga e diga que seguiu).

## 4. Animar

O `filme.mjs` (o modelo já renderiza): `cenas` com `de/ate` e `desenhar(g, t, ctx, tGlobal)`. Ferramentas no `ctx`:
- `ctx.m` (movimento.mjs): `entra`, `sai`, `anima`, `trilha`, `trocaAlfa`, `MOLAS`, `DUR`, `semente`. **Só função de t.**
- `ctx.d` (desenho.mjs): `veredito` (com o ponto desenhado; passe `maxW: L.seguro.w`), `texto`, `paragrafo`, `cartao`,
  `pilula`, `etiqueta`, `imagem`, `logoComSol`, `simbolo`.
- `ctx.L` (o formato: `W`, `H`, `u`, `seguro`), `ctx.COR`, `ctx.dominio(app)`, `ctx.img.<asset>`, `ctx.catalogo`
  (`teste`, `aPartirDe`: **o único lugar de preço e teste grátis**).
- Os sons vão em `som.sons` (`toque`, `entra`, `assenta`, `troca`) nos tempos do roteiro.

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
node estudio/render.mjs videos/<id> --formato stories,feed   # final.mp4, contato.png, celular.png, poster.png
```

Olhe `contato.png` e `celular.png` (a 360 px de largura: dá pra ler?). Movimento rápido suspeito: `node estudio/critica.mjs
<final.mp4> --faixa <s>`. Refazer só um trecho: `--de 4 --ate 8`.

## 7. Entregar e lembrar

- Mande o `final.mp4` de cada formato (SendUserFile), o pôster e a `legenda.md` (mesma voz; `texto.mjs` confere).
- `ficha.json`: `status: "entregue"`; quando a pessoa disser onde postou, `"publicado"` e `publicado: [{ "onde", "quando", "link" }]`.
  Resultado (views, salvos) entra em `notas` quando vier: é o que a pauta usa pra decidir o próximo.
- Diga em uma linha o que você melhoraria no próximo. Commit com a pasta do vídeo (o mp4 não vai pro git: refaz-se do filme).
- Aprendeu algo que vale pra todo vídeo? Uma linha em `conhecimento/marca-em-video.md` (regra) ou em `CLAUDE.md` (motor).

## O que mais se erra

- Título no meio sobre fundo liso, tudo em fade, logo no fim: o vídeo genérico. Use a composição da marca (veredito à
  esquerda, produto real entrando, a folha da noite).
- Quique, overshoot, câmera flutuando, número contando: proibidos pela marca, mesmo o curso pedindo.
- Preço ou "30 dias grátis" escrito no filme; feature que o site não promete; tela de app que não existe (Saúde, Casa, Pessoas).
- O Toly como mascote ou narrador (ver `marca-em-video.md`).
- Texto fora de `L.seguro` (some sob a interface do Instagram); texto abaixo de 28 px (ilegível no celular).
