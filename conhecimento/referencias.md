# Referências de movimento e de som

O que se tirou de cada referência que o Sidney trouxe, e o que a marca não deixa tirar. A regra do curso vale aqui:
pegue a gramática, nunca o conteúdo.

## ElevenLabs, "Introducing SFX v2" (YouTube 82d9QlU0iiU), trazida em 14/10/2026

O Sidney: "eu gostei como no vídeo ele quebra os elementos da página e eles são construídos e usados, não só mandando um
print". O estúdio não consegue assistir vídeo (o YouTube não entrega os quadros a esta sessão); da miniatura e do que ele
descreveu:

| No vídeo | No estúdio | Por quê |
| --- | --- | --- |
| A interface quebrada em peças que se constroem | **Feito**: `capturar-app.mjs` desmonta cada tela do app nas peças que o próprio app anima ao abrir (`.entra`), com as listas linha a linha e o gráfico à parte; `desenho.telaMontada` remonta peça por peça na ordem da leitura, vindo de uma vista explodida | É a tela de verdade (as peças são recortes dela, com a posição exata), não um redesenho de cabeça |
| A interface inclinada em perspectiva 3D | **A decidir** (Sidney) | A marca não fala de perspectiva; "nada gira" é do logo. O canvas 2D faria só uma inclinação falsa |
| Brilho (glow) em volta do painel, gradiente no fundo | **Não** | O guia proíbe brilho e degradê (seção 6 e "Visual proibido") |
| Desfoque de profundidade nas linhas de trás | **A decidir** | Ajuda a focar; não está no guia nem proibido |
| Fundo escuro com o produto em destaque | Já é a "noite" da marca | — |

## A ElevenLabs como fonte de som

A ElevenLabs gera efeitos sonoros por texto (o SFX v2 do vídeo), música (Eleven Music) e voz em português.

- **Efeitos de interface** (o clique, o empurrão, a peça que encaixa): hoje sintetizados (`som.mjs`). Gerados pela
  ElevenLabs ficariam mais ricos; cada um seria gerado uma vez, guardado em `assets/sons/` e reusado.
- **Música**: hoje licenciada do Incompetech (CC BY). A da ElevenLabs serve se o plano cobrir uso comercial.
- **Voz**: a marca "fala pouco"; locução não está definida. A decidir.
- **O que falta**: a chave da API no ambiente (variável `ELEVENLABS_API_KEY`, nas configurações do ambiente da nuvem,
  nunca no chat) e confirmar que o plano permite uso comercial. Sem a chave, nada disso foi implementado nem testado.
