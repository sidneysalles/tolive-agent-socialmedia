---
name: tolive-video-critica
description: A crítica de um vídeo da toLive pelos quadros renderizados, como um diretor duro (nota de 1 a 10 em sete critérios, os três piores problemas com o tempo, conserto, de novo até tudo 8+). Use depois de qualquer render de vídeo do estúdio (folha de batidas, contato, celular) e antes de entregar ou mostrar um vídeo.
---

# A crítica

O hábito que separa o vídeo bom do "ficou meio assim" (o passo 11 do curso, `conhecimento/curso-motion.md`): olhar os
próprios quadros. **Seja um diretor duro, não um autor orgulhoso.** Nota alta sem problema listado é crítica mal feita.

## Como olhar

**Toda versão que vai pra página de aprovação passa por aqui antes**, não só a primeira (no Propósito a crítica parou na
versão 3 e os defeitos chegaram ao Sidney). Se der, chame um subagente que não escreveu o código pra dar a nota.

1. Abra com o Read, inteiras: `saida/<formato>/batidas.png` (antes do render) ou `contato.png` e `celular.png` (depois).
   Movimento rápido: `node estudio/critica.mjs <final.mp4> --faixa <s>` e abra a faixa (12 quadros seguidos).
2. Olhe todos os formatos que vão sair. O feed (4:5) quebra o que o stories esconde.
3. Leia o `roteiro.md` ao lado: o quadro mostra o que o roteiro promete, no tempo prometido?

## A rubrica (1 a 10)

| Critério | 8 é |
| --- | --- |
| **Gancho** | O quadro 0 já diz algo; nos 2 s o problema está claro; a energia já está lá (o primeiro vídeo foi reprovado por "lento, fraco") |
| **Leitura no celular** | Tudo legível na `celular.png` (360 px): nada abaixo de 28 px no vídeo, contraste do guia |
| **Movimento** | Corte na batida, tipo que bate, empurrão com borrão limpo; tudo assenta e para; sem quique, sem quadro morto |
| **Variedade** | Algo novo a cada 2 a 4 s; não é "tudo sobe e aparece" do começo ao fim |
| **Composição** | Tudo dentro de `L.seguro`; nada centrado em fundo liso sem motivo; equilíbrio no stories **e** no feed |
| **Marca** | Ver a lista abaixo; uma falha aqui é nota máxima 5 |
| **Som** | A virada da trilha cai na primeira feature; os sons caem no que acontece; −14 LUFS |

## O que caçar (pela ordem)

**A marca** (`conhecimento/marca-em-video.md`):
- Mais de um laranja no mesmo quadro (o ponto do veredito com o alerta é a exceção do guia).
- Número contando pra cima; quique; parallax; brilho; sombra; degradê; confete; algo se mexendo depois de parado.
- Ponto final da fonte em vez do ponto desenhado; Archivo Black em parágrafo ou botão.
- Cor de domínio em botão ou fundo; verde virando cor de marca.
- O Toly fora do cartão dele (mascote, narrador, na chamada).
- Texto: exclamação, emoji, "ToLive", número até dez em algarismo no texto, preço ou teste grátis escrito à mão.

**O vídeo** (o curso e o que este estúdio já errou):
- **O quadro de uma batida vazio** (na folha de batidas: a cena ainda não chegou no tempo forte).
- **Um quadro cinza no corte seco** (o borrão misturou as duas cenas: a decisão do corte não usa `ctx.corte`).
- **Cópias fantasmas no empurrão** (faixa: `--sub` baixo ou obturador 1).
- Lento e morno: mais de um compasso sem corte nem tipo novo, fora a promessa e o fim.
- Texto sobreposto durante uma troca; texto borrado por escala; coisa deslizando em vez de assentar.
- Rótulo ou texto nos cantos, moldura (cara de vídeo de IA).
- Batida morta (nada acontece por mais de 4 s, fora o fim parado).
- O fim não para (o último 1,5 s tem que ser um quadro só).

**O roteiro** (o que o Sidney já devolveu):
- A abertura mistura dois problemas (tarefas chatas e o dinheiro que falta): um tipo de dor por vídeo.
- O mote ("Tecnologia feita para não ser usada") antes do fim: depois dos problemas vai a resposta a eles; o mote só
  depois do produto provar.
- A tela parada como print (sem peças se montando, sem toque, sem confirmação do app) ou a câmera numa pose só.
- Peça sumindo no 3D ou passando por cima da borda do celular (olhe a faixa densa da feature, não só o quadro-chave).
- Os dias grátis pequenos no fim.

## O registro

No `videos/<id>/critica.md`, uma seção por rodada: a tabela de notas e **os três piores problemas, com o tempo e o
conserto**. Conserte, renderize só o necessário (`--batidas`, `--quadros`, `--de/--ate`), olhe de novo. **Três rodadas no
mínimo; só sai com tudo 8 ou mais.** O que ficar pro próximo vídeo (não bloqueia) vai numa lista no fim, e a pauta lê.
