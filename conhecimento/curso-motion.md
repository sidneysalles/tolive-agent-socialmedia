# O curso de motion com o Opus 5.5, destrinchado

A fonte: "How to build motion design studio with Opus 5.5 (Full-course)", de @0xMovez, 27/09/2026
(https://x.com/0xMovez/status/2104216919033192746; 3,5 milhões de visualizações, 28 mil salvos). Lido inteiro em
14/10/2026, com os 15 blocos de código. Aqui está o que cada passo diz, o que o estúdio fez com ele e por quê.

**A tese do curso, numa linha:** "o prompt é 10% do vídeo; os outros 90% são o arreio" (render, referência, molas,
batida, som e, principalmente, o modelo olhando os próprios quadros). Sem isso, todo vídeo sai igual: título no meio
sobre degradê, tudo aparecendo por fade, logo no fim.

**O que o estúdio muda no curso, numa linha:** o curso ensina a energia de um showreel ("go all out"); a toLive vende
calma. O arreio a gente copia inteiro; a estética, não. Quando o curso e o guia de marca discordam, vale o guia
(`conhecimento/marca-em-video.md` diz onde e como).

---

## Parte 1 · O que está acontecendo

### 01. Pixels: o modelo escreve um programa, não um vídeo
- O modelo não solta MP4. Ele escreve uma função `seek(t)` que pinta o quadro exato do tempo t; um navegador sem tela
  chama essa função quadro a quadro, tira a foto, e o ffmpeg junta.
- Nada depende de relógio: o render sai igual toda vez, e mudar é editar uma linha e renderizar de novo.
- O Opus, sozinho, prefere a "rota A": um `index.html`, `seek` pelo `eval`, Playwright, ffmpeg, zero dependência. Ignora
  Remotion e HyperFrames se você não pedir.
- **No estúdio:** é exatamente o `estudio/palco.mjs` (`window.seek(t)`) + `estudio/render.mjs` (Playwright → ffmpeg).
  Rota A porque é a stack da toLive (zero dependência, Node, `node:test`) e porque o teste prova o determinismo
  (`test/palco.test.mjs`: o mesmo quadro pinta igual em qualquer ordem).

### 02. Setup: o estúdio em dez minutos
- Só o Claude Code (um agente com shell) renderiza, ouve e olha os próprios quadros. O app de chat escreve a animação
  mas não fecha o laço; é o laço que separa o "meio sem graça" do que viraliza.
- Um arquivo de regras da casa na raiz (`CLAUDE.md`), lido em toda sessão, pra não repetir as regras a cada vídeo.
- Esforço: médio pra ajuste e re-render, **xhigh pra filme novo, max quando os 3 primeiros segundos carregam um
  lançamento**. Todo one-shot viral rodou em xhigh ou max.
- **No estúdio:** o `CLAUDE.md` daqui é esse arquivo (contrato de render, visual proibido, som, crítica antes de
  mostrar). Node, ffmpeg e Playwright já estão na nuvem do Claude; na máquina, `npm i -g playwright`. O Python/librosa
  do curso foi trocado por `estudio/batidas.mjs` (mesma saída, sem Python).

## Parte 2 · Dirigir como diretor

### 03. A frase única: por que o prompt do showreel funciona
- "make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's
  your showreel for a résumé. go all out."
- Funciona porque "showreel" é um gênero com regras conhecidas (corte rápido, técnica nova a cada plano), põe o
  modelo como assunto (não tem conteúdo pra errar), 15 s cabem numa passada, e "go all out" multiplica o esforço.
- A fraqueza: "contágio de briefing" — centenas de prompts iguais deram reels que rimam. **Uma frase testa o motor,
  nunca a ideia, porque não contém ideia.**
- Variações que deram certo: mais longo com trilha (piano original, cada corte na música); a trava anti-cara-de-IA
  ("evite molduras e texto nos cantos"); história em vez de técnica; persona de agência ("um acento de cor só").
- **No estúdio:** a frase única não é usada pra vender. Serve pra testar o motor numa máquina nova. A trava
  anti-cara-de-IA virou regra (sem texto nos cantos, sem moldura).

### 04. Marca: apontar o reel pro produto
- Tony Dinh pagou mais de US$ 1.000 por um vídeo de lançamento; com três linhas a mais (a URL do produto, "use
  screenshot, logo e assets reais", "tem que ter música") saiu em 30 minutos.
- O template do curso: visite o site, use telas reais (Playwright), o logo, as cores e as fontes reais; liste os assets
  antes de animar; **nunca redesenhe a interface de cabeça, recorte e anime a coisa de verdade**. História em batidas
  de 2 a 4 s: gancho (o problema em 5 palavras de tipo enorme) → o produto aparece e se monta → três features como
  momentos de interface com um cursor fazendo algo de verdade → um número que prova → logo + chamada. Música 120 BPM
  sintetizada, cliques e whooshes na batida. 9:16 primeiro, depois 1:1 e 16:9 da mesma linha do tempo. **Antes do
  render inteiro, a folha de contato com um quadro por batida.**
- Rob Hallam: o segundo vídeo sai mais rápido na mesma sessão, porque o render, o som e a exportação já existem.
  **Uma sessão por marca.**
- Voz e mascote (ElevenLabs, chave no `.env`, nunca no prompt).
- **No estúdio:** `estudio/capturar.mjs` tira as telas reais do site (`assets/capturas/`, 3x, fundo transparente);
  `render.mjs --batidas` é a folha antes do render; este repositório é a "sessão da marca" que não se perde (o motor,
  a trilha e a memória ficam). Voz e mascote: **não** (ver marca-em-video, o Toly não vira mascote).

### 05. Referência: nomear um visual, dar um quadro
- Sem referência, o Opus volta ao padrão (título no meio, degradê, tudo em fade). Nomear um estilo ganha de
  descrever; um vídeo ou quadro de referência dá ritmo, tipo e transição pra copiar.
- A escada: um quadro (diga o que pegar: paleta, tipo, grão; e o que não pegar: o assunto), um vídeo (extrair quadros
  com ffmpeg e descrever o ritmo plano a plano antes do código), uma biblioteca (pedir um `style_guide.md` antes).
- **Pegue a gramática da referência, nunca o conteúdo, o logo ou o personagem.** Mostre o guia de estilo e a lista de
  planos e espere o OK antes de qualquer código.
- Com a referência dada, deixe o modelo escolher a técnica; especifique o visual e as restrições, não a biblioteca.
- **No estúdio:** a referência fixa é a própria toLive (o site, o guia de marca, o vídeo anterior em
  `videos/*/saida/*/poster.png` e `contato.png`). Referência de fora entra em `videos/<id>/refs/` e só dá ritmo e
  transição; a paleta e o tipo são sempre os da marca. O OK antes do código é o portão do roteiro (skill
  `tolive-video`, passo 3).

### 06. Spec: escrever a lista de estados, não a vibe
- O prompt mais salvo da semana (o morph de interface do @twoclipping) era um spec em XML: entradas a pedir,
  direção, uma lista de estados batida a batida, regras de build e pegadinhas.
- A ideia: **uma forma que nunca corta** — um elemento muda de tamanho, raio e cor de estado em estado (botão,
  carregando, player, slider, gráfico, paleta de comando), um cursor dispara cada mudança com clique de verdade, e o
  último quadro é igual ao primeiro (loop).
- Regras do spec: texto dentro do contêiner que muda entra depois da mudança começar e sai antes da próxima; indicador
  de aba com a borda da frente e a de trás em molas diferentes (estica); começar num tempo forte; sem `will-change`
  no que a câmera escala (texto borrado).
- **No estúdio:** o `roteiro.md` de cada vídeo é essa lista de estados, numa tabela batida → tempo → na tela → som.
  `trocaAlfa` (texto que troca) e `trilha` (vários alvos) estão em `movimento.mjs`. O loop perfeito **não** é regra:
  a marca termina parada (guia, seção 6).

## Parte 3 · Construir o motor

### 07. Motor: o renderizador `seek(t)`
- Dois arquivos: a página pinta qualquer instante; o renderizador anda no tempo e manda os quadros pro ffmpeg.
  Subquadros misturados (`tmix`) dão borrão de movimento. H.264 yuv420p, CRF 16.
- As folhas da crítica: contato (2 quadros por segundo), faixa (12 quadros seguidos em volta de um movimento rápido,
  pega pulo e sobreposição), teste do celular (como lê a 360 px), checagem do loop e do determinismo (o mesmo quadro
  duas vezes, o mesmo hash).
- Rota B, se quiser framework: Remotion (React; séries, templates, vídeo a partir de dados) ou HyperFrames (HTML +
  GSAP).
- **No estúdio:** `render.mjs` (com `--sub`, `--de/--ate` pra refazer só um trecho, `--quadros`, `--batidas`) e
  `critica.mjs` (contato, celular, faixa, pôster). Determinismo no teste, não na mão. Rota B não: Remotion traz React e
  dependências, contra a stack da toLive; se um dia a série pedir vídeo a partir de dados em lote, rever.

### 08. Molas: o movimento que parece caro
- Movimento barato vai de A a B numa curva fixa; o caro tem massa: acelera, passa um fio, assenta. Molas fechadas
  (fórmula, não simulação) continuam função pura do tempo.
- **O truque:** um valor que muda de alvo várias vezes não reinicia a mola; soma uma mola por mudança, cada uma na
  sua hora. Dá pra pintar o quadro 812 sem simular os 811.
- Quatro predefinições: firme (UI), padrão (cartões, câmera), pesada (tipo grande, logo), brincalhona (mascote, com
  quique visível).
- **No estúdio:** `mola`, `MOLAS` e `trilha` em `movimento.mjs`, mas **só com amortecimento crítico ou maior** (z ≥ 1):
  desacelera e para, nunca passa do alvo. "Passar um fio" é quique, e o guia proíbe quicar. A brincalhona não existe
  aqui. O teste prova que nenhuma predefinição passa de 1. Pra entrada e saída de elemento, as curvas do próprio guia
  (`--chegada`, `--saida`) com as durações dos tokens.

### 09. Som: no ritmo da batida
- O som não foi posto depois: foi sintetizado em código na mesma linha do tempo (Node, Python), com cada corte numa
  grade de 120 BPM. "É no som que o vídeo de IA começa a parecer filme."
- Dois caminhos: trouxe a música, meça (batidas → mudanças de estado; tempos fortes → momentos grandes; picos → efeitos);
  não trouxe, sintetize na mesma linha do tempo. Volume final em −14 LUFS.
- **No estúdio:** `som.mjs` sintetiza a trilha (acordes abertos, piano elétrico em colcheias, baixo, pulso quase
  inaudível) e quatro sons de interface (toque, entra, assenta, troca), tudo determinístico; `batidas.mjs` mede a música
  trazida; a mixagem é em duas passadas até −14 LUFS. Andamento de 84 a 100, não 120: a marca é calma.

## Parte 4 · De um clipe a um estúdio

### 10. A noite: o briefing do diretor
- Os vídeos longos (142 s, 2,1 milhões de views) vieram de briefings de 9.500 a 19.000 caracteres que "contratam uma
  equipe": o filme em uma linha, referências, ferramentas e chaves (com orçamento), bíblia do personagem, roteiro em
  batidas com tempo (uma recompensa visual a cada 3 a 5 s, gancho nos 2 primeiros), texto na tela, **portões de
  trabalho** (plano → estrutura → stills → animatic → passada inteira → polimento → áudio → render), laço de crítica,
  entregas.
- Gerar-e-traçar: um modelo de vídeo faz a base, o código redesenha por cima (o espectador só vê a camada de código).
- Subagentes por capítulo, com um `ANIMATION_GUIDE.md` escrito antes pra todos codarem no mesmo estilo.
- **No estúdio:** o `briefing.md` + `roteiro.md` de cada vídeo são o briefing do diretor; os portões estão na skill
  `tolive-video`; o `ANIMATION_GUIDE.md` é o `conhecimento/marca-em-video.md` (fixo, não por vídeo). Gerar-e-traçar e
  modelos de vídeo: não por enquanto (a marca é plana, de interface e tipo; não precisa de física de personagem).

### 11. Crítica: o Opus olhando os próprios quadros
- O hábito que separa o viral do "ficou meio assim": renderizar, olhar a folha, dar nota, achar os 3 piores
  problemas, consertar, repetir até tudo 8 ou mais. "Seja um diretor duro, não um autor orgulhoso."
- A rubrica: gancho nos 2 s · leitura no tamanho do celular · qualidade do movimento (molas, nenhum quadro morto) ·
  variedade (algo novo a cada 2 a 4 s) · composição · fidelidade à marca · sincronia com o som.
- Caçar: texto sobreposto na troca, coisa deslizando em vez de assentar, rótulo no canto e moldura, plano centrado em
  degradê, texto escalado borrado, batida morta, tranco na emenda do loop.
- Iterar é o método, não falha (163 chamadas e quase 7 horas num curta de aquarela).
- **No estúdio:** a skill `tolive-video-critica`, com a rubrica do curso mais o que a marca cobra (um laranja por
  quadro, número que não conta, Toly, voz), e o `critica.md` de cada vídeo guardando as rodadas.

### 12. Entregar: formatos, uma skill e um serviço
- Todo formato da mesma linha do tempo: cenas escritas contra uma função de layout, não pixel fixo; **reenquadre por
  formato, não recorte 16:9 pra vertical**.
- Empacotar o pipeline numa skill: o próximo vídeo vira uma frase.
- Vender como serviço (música, mascote, features, oferta no fim, qualquer idioma, até três ajustes).
- **No estúdio:** `formatos.mjs` (stories, reels, feed, quadrado, horizontal, cada um com a área segura) e as cenas
  usando `L.seguro`; as três skills (`tolive-video`, `-critica`, `-pauta`).

## O que ficou pelo caminho (revisão depois do Propósito, 14/10/2026)

O Propósito saiu aprovado depois de seis versões; comparando o processo que rodou com os doze passos:

- **A crítica (passo 11) parou na versão 3.** O `critica.md` tem as rodadas de antes do 3D, do toque e da voz; daí em
  diante quem achou os defeitos foi o Sidney (as peças que sumiam, a imagem por cima da borda). E a folha do celular do
  render final mostra o que ninguém pegou: no foco, a prova compacta (32 px) fica com ~11 px na tela do celular.
  Conserto: a rodada de nota é obrigatória a cada versão que vai pra página, com a faixa (os quadros seguidos em volta
  de cada movimento rápido) e o celular, e de preferência por um subagente que não escreveu o código ("diretor duro,
  não autor orgulhoso").
- **O animatic (os portões do passo 10).** Pulamos dos quadros parados pra prévia em qualidade quase final (6 min).
  Agora é o `render.mjs --rascunho` (meia resolução, JPEG, sem borrão, três páginas): o filme inteiro em ~20 s.
- **O desenho de som (passo 9: "picos → efeitos").** Eram quatro sons de interface, baixos, debaixo da música e da voz.
  Na versão 7 do Propósito cada movimento ganhou o seu (com volume e lado: `som.sons` com `vol` e `pan`). O vídeo do SFX v2 da ElevenLabs
  era a referência disso e ainda não foi usado.
- **O número que prova (o roteiro do passo 4).** Gancho → o produto se monta → três features com o cursor → **um
  número** → logo e convite. O Propósito tem cinco features e nenhum número (o "Faltam dez → nove" chega perto).
  Com três features e um número, o filme caberia em ~30 s.
- **A referência plano a plano (passo 5).** A da ElevenLabs foi conversada, não decupada: extrair os quadros com o
  ffmpeg e escrever o ritmo plano a plano em `videos/<id>/refs/` antes do código.
- **Os formatos (passo 12).** Saíram stories e feed; o reels (outra área segura: legenda e botões embaixo e à direita)
  não foi olhado.

O que o estúdio fez além do curso: as telas do app sendo usadas de verdade (o toque e a confirmação capturados), o 3D,
a página de aprovação com db, a voz medida palavra por palavra e o roteiro de vendas antes de tudo.

## Repositórios citados pelo curso (pra consulta, nenhum é dependência)

- Música: https://github.com/JohnHeibel/PDoomVideo · Base: https://github.com/JohnHeibel/ClaudeAnimationBase
- Canvas em Node: https://github.com/buildwithhanif/claude-animation-skill
- HTML: https://github.com/heygen-com/hyperframes · React: https://www.remotion.dev/docs/ai/skills
- Longa: https://github.com/WinterArc21/Battle-of-Austerlitz-Film
- Biblioteca de prompts: https://github.com/guanmo-ai/awesome-ai-motion · Dados: https://github.com/athemeroy/awesome-opus-5-5-videos
