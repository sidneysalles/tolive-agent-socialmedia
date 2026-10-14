# tolive-agent-socialmedia

O estúdio de vídeo da toLive. Você diz "preciso de um vídeo do Finanças pra stories sobre a projeção" numa sessão do
Claude com este repositório, e ele:

1. lê o que o site diz hoje e o que os vídeos anteriores já disseram, e propõe três ângulos que complementam;
2. escreve o roteiro na grade de batidas e espera o seu OK;
3. anima as telas reais do site com a marca da toLive (papel, tinta, Archivo Black, o ponto laranja, sem quique);
4. renderiza, olha os próprios quadros, dá nota, conserta (três rodadas no mínimo);
5. entrega o MP4 de cada formato, o pôster e a legenda do post, e guarda na memória o que foi dito.

O primeiro vídeo, feito junto com o motor: [`videos/2026-10-14-financas-tudo-em-ordem`](videos/2026-10-14-financas-tudo-em-ordem)
(16 s, stories e feed).

| Pasta | O que tem |
| --- | --- |
| [`CLAUDE.md`](CLAUDE.md) | As regras da casa: o contrato do render, o visual proibido, a crítica antes de mostrar |
| [`conhecimento/curso-motion.md`](conhecimento/curso-motion.md) | O curso de motion com o Opus 5.5, passo a passo, e o que o estúdio fez com cada passo |
| [`conhecimento/marca-em-video.md`](conhecimento/marca-em-video.md) | O guia de marca traduzido pra vídeo (e o que está a confirmar) |
| [`conhecimento/produtos.json`](conhecimento/produtos.json) | O que cada produto faz, com a prova do site e a captura que mostra |
| [`.claude/skills/`](.claude/skills/) | `tolive-video`, `tolive-video-critica`, `tolive-video-pauta` e as da base |
| [`estudio/`](estudio/) | O motor (zero dependência; usa o Playwright e o ffmpeg da máquina) |
| [`videos/`](videos/) | Um vídeo por pasta, com a ficha que é a memória |

Na sua máquina, uma vez: Node 22+, `ffmpeg`, `npm i -g playwright && npx playwright install chromium`. Na sessão do
Claude na nuvem já está tudo instalado.
