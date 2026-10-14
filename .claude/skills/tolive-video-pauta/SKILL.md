---
name: tolive-video-pauta
description: Decide o que o próximo vídeo da toLive vai dizer, a partir do que já saiu (videos/*/ficha.json), do que o site diz hoje e do que nunca foi dito; monta séries e calendários de vídeo. Use quando pedirem "o que postar", ideias de vídeo, um calendário, uma série, ou um vídeo "que complemente" os anteriores, e no passo 1 da skill tolive-video.
---

# A pauta

Vídeo bom que repete o anterior é vídeo perdido. A pauta lê a memória e escolhe o que **complementa**.

## Ler

```sh
node estudio/conhecimento.mjs          # o site de hoje (git diff conhecimento/ = o que o produto ganhou)
node estudio/historico.mjs [produto]   # entregues, nunca ditos, ângulos livres, ganchos usados, vídeos a refazer
node estudio/historico.mjs --json      # o mesmo, pra ler inteiro
```

E as `notas` das fichas publicadas (resultado: views, salvos, comentários), quando houver, e os **reprovados** (o
`historico.mjs` lista com o motivo, nas palavras de quem reprovou): o que foi reprovado não se propõe de novo.

## Decidir

1. **Refazer vem primeiro**: vídeo com preço ou teste grátis velho (`historico.mjs` lista) sai de circulação ou é refeito.
2. **O que o produto ganhou** desde o último vídeo (o diff do site) é a melhor pauta: é notícia.
3. **O que nunca foi dito** e tem captura real (`produtos.json`, `captura`) vem antes do que não tem.
4. **Alterne**: problema (o antes) → feature (o como) → prova (o número do exemplo) → manifesto (o porquê). Não dois
   vídeos seguidos do mesmo tipo, nem do mesmo gancho, nem com o mesmo cartão de alerta.
   **Um problema por vídeo**: as tarefas chatas (boleto, fatura, extrato) são uma dor; o susto do fim do mês (o
   dinheiro que falta) é outra, e rende o seu próprio vídeo (Sidney, 14/10/2026).
5. **Série**: um nome (`ficha.serie`) e uma fórmula fixa (ex.: "Uma tarefa a menos": cada episódio, uma tarefa que o
   app tira de você, mesmo gancho de estrutura, mesmo fim). Série faz quem viu um reconhecer o próximo.
6. Fé (em teste): no máximo teaser, e só com a frase do site. Saúde, Casa e Pessoas: só dentro de um vídeo da suíte.

## Propor

Três opções, cada uma com: o ângulo (id), o gancho em até cinco palavras, as features (ids), o formato, **o que ela
complementa** (cite o vídeo anterior pelo id) e por que agora. Recomende uma, com o motivo. Calendário: uma linha por
data, sem repetir tipo em sequência, e com a data em que o catálogo deve ser relido se o vídeo fala de teste grátis.

## Ideia nova

Ângulo que não está em `produtos.json` entra lá, com o texto do site que o sustenta. Sem frase do site que prove, não é
pauta: é promessa, e vídeo da toLive não promete o que o produto não faz.
