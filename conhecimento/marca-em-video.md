# A marca em vídeo

O guia de marca (`.claude/skills/tolive-marca/guia.md`, copiado do tolive-base) foi escrito pra tela de app. Um
vídeo de venda é outro meio: tem corte, trilha e 15 segundos pra convencer alguém que não pediu pra ver. Este
arquivo diz onde o guia vale ao pé da letra, onde ele foi traduzido e por quê. **O que não está aqui, vale o guia.**
Mudança de marca entra primeiro no guia (tolive-base), depois aqui.

Escrito em 14/10/2026 junto com o primeiro vídeo (`videos/2026-10-14-financas-tudo-em-ordem`, **reprovado**) e revisto
no mesmo dia com o segundo (`videos/2026-10-14-financas-proposito`), depois das decisões do Sidney abaixo.

## As decisões do Sidney (14/10/2026, olhando o primeiro vídeo)

| # | Ponto | O que vale |
| --- | --- | --- |
| 1 | O Toly em vídeo | **Só como feature**, no cartão real dele; nunca mascote, narrador ou voz. |
| 2 | Ritmo, movimento e trilha | O primeiro ("calmo", 90 BPM, tudo subindo devagar, trilha de colchão) ficou **"horrível… muito lento… fraco"**. A direção é **inspiradora, como os filmes da Apple**: o propósito da marca primeiro, as features como prova, corte na batida. É o **registro do filme** (abaixo). |
| 3 | O sol nascendo atrás do horizonte | **Aprovado**: "ajuda o usuário a entender a estética". É a assinatura do vídeo: na virada de chave e no logo do fim. |
| 4 | Telas sendo usadas e câmera (Propósito, 14/10/2026) | **"Telas sendo usadas, botões sendo clicados, mensagens de ação bem-sucedida depois, gráficos surgindo"** e **"ângulos de câmera, app inteiro, foco em algo, app entrando sob diferentes óticas"**. A perspectiva 3D foi aprovada ("ótima escolha, precisamos ter mais"). Cada feature: entra por um ângulo, o app inteiro, o foco no detalhe, o toque e a confirmação do próprio app (capturas de antes e depois). |
| 5 | Um problema por vídeo (Propósito, 14/10/2026) | A abertura lista **um tipo de dor só**. "Boleto, fatura, extrato, planilha, lembrete" são tarefas chatas; o "Susto no dia 30" é outro problema (o dinheiro que falta) e saiu: **"juntou várias tarefas chatas com outro problema, que podemos abordar em outro vídeo"**. |
| 6 | O mote no lugar dele (Propósito, 14/10/2026) | "Tecnologia feita para não ser usada" **só no fim**, depois do produto se provar (e do "Pode fechar o app"): logo depois dos problemas ficou "nada a ver". Ali vai a resposta aos problemas: **"A tecnologia precisa nos devolver tempo de vida."**, com o logo inteiro (o símbolo sozinho "não conecta") |
| 7 | O manifesto | "O melhor elogio: esqueci que tinha o app" foi reprovado ("pensa em outra coisa"). Ficou a tela que apaga: "Pode fechar o app". |
| 8 | Os dias grátis | No fim, **chamativos**: em letra de veredito, grande, do catálogo, nunca escritos à mão. |
| 9 | A narração | **A fala e a imagem conectadas**: a voz diz o que a tela escreve, na hora em que escreve. Roteiro de locução gerado do filme (`estudio/narracao.mjs`), um arquivo por fala; os cortes seguem a voz. |


## A ideia que o vídeo vende

- "Tecnologia feita para não ser usada." Não é um app a mais, é uma tarefa a menos. **É o mote do fim** (decisão 6): depois
  dos problemas vem a resposta a eles ("A tecnologia precisa nos devolver tempo de vida", com o logo inteiro), e o mote só quando o produto já provou.
- O vídeo vende **um propósito**: a vida pede pedaços de você; a toLive existe pra devolver. As features vêm depois,
  como prova. Inspirar, não agitar: a energia vem da música e do corte, nunca de urgência no texto.
- Do curso de motion (`curso-motion.md`) a gente copia o arreio inteiro (render, batida, crítica) e a energia do corte;
  da marca fica o gosto (sem quique, sem número girando, um laranja por quadro, a voz).

## O registro do filme (a pegada Apple, decisão 2)

| Elemento | Como |
| --- | --- |
| Estrutura | **Peso** (palavras na batida: o que pede você) → **virada de chave** (noite, o sol nasce, "Tecnologia feita para não ser usada") → **prova** (a virada da música: uma feature por compasso) → **manifesto** (uma frase de propósito) → **fim** (o logo com o sol, o convite, parado) |
| Andamento | 110 a 124 BPM. Cortes nos tempos; a cena nova chega **no** tempo forte (a subida começa 0,08 a 0,12 s antes) |
| Tipo | Archivo Black enorme (200 a 300 px em 1080), **revelado por máscara** (sobe de trás da própria base, sem fade), poucas palavras: "Conecta." "Organiza." "Avisa antes." |
| Movimento | Curva `forte` (arranca e assenta longo; `movimento.mjs`); tipo em 0,32 s; a cena empurra a anterior em 0,5 s; a câmera empurra 14% e para em 1,6 s; o sol em 0,9 s. Borrão de movimento com `--sub 4` (com `--sub 2` vira dupla exposição) |
| Cor | Papel e noite alternando nos cortes (as duas são da marca); a feature no papel; o fim na noite |
| Som | A trilha inspiradora (`trilha-inspiradora.mjs`): intro de piano → subida com respiro → virada (bumbo, palmas, baixo, arpejo) nas features → a tônica no fim. Música licenciada ganha de qualquer síntese |
| Continua proibido | Quique e overshoot, número contando, parallax, brilho, sombra, degradê, confete, mais de um laranja, câmera flutuando, loop no lugar do fim parado |

## O que vale ao pé da letra

| Regra do guia | No vídeo |
| --- | --- |
| Voz: calma, breve, concreta, com saída; "você"; fato antes do pedido | Todo texto na tela e na legenda. `node estudio/texto.mjs` pega o que dá por regra |
| Nunca: emoji, exclamação, culpa, gamificação, "imperdível", "não perca" | Idem. Sem contagem regressiva, sem "últimas vagas", sem "só hoje" |
| A marca é **toLive**; o app é **toLive Finanças** | Idem. Nunca "ToLive", nunca "Finance" |
| "Lei 10" e o livro de onde veio nunca se citam | Idem. Mostrar o efeito (a cor que se esvai, "vá viver") pode |
| Números por extenso até dez no texto; R$ sem centavos na leitura, com centavos no item; "R$ 18 mil" | Idem. O "12" grande da semana comum é dado de tela, algarismo |
| **Números nunca contam pra cima** ("truque de cassino") | **Nunca** o clichê de vídeo de finanças "R$ 0 → R$ 46 mil" girando. O número aparece pronto |
| Um sinal (laranja) por tela | **Um laranja por quadro**: o ponto do veredito, o cartão de alerta, a cabeça do Toly ou o sol do logo. O ponto do veredito é a exceção do guia (pode estar junto do alerta) |
| Cada cor tem um trabalho; domínio só na faixa, etiqueta, ícone e foco; nunca botão nem fundo | Idem. Fundo é papel ou noite; botão é pílula de tinta (ou de papel, na noite) |
| Sem sombra, sem brilho, sem degradê | Idem. Profundidade é tom (papel, cartão, noite) e sobreposição |
| Archivo Black uma vez por cena, no veredito; Space Grotesk no resto | Idem. Nunca Inter, Roboto, Arial |
| O ponto final do veredito é desenhado (0,21 em), nunca o da fonte | `desenho.veredito()` faz isso. Escreva o texto sem o ponto |
| Logo: não esticar, não girar, sem efeito, não trocar a cor do sol; área de proteção = a altura do símbolo | Idem. O sol **nasce** de trás do horizonte (`logoComSol`, `simbolo`): sobe e para, sem girar nem brilhar (decisão 3, aprovado) |
| O fim: a abertura do app (fundo escuro, logo, o nome do app no tom claro do domínio, a assinatura) | É o cartão final padrão do modelo |
| Telas de exemplo, nunca com dado real de alguém | As capturas vêm do site (dados de exemplo). Print do app só com conta de demonstração |

## O que foi traduzido (o vídeo não é uma tela de app)

| Guia (app) | Vídeo | Por quê |
| --- | --- | --- |
| Nada passa de 600 ms | Tipo, cartão e empurrão cabem em 600 ms; a câmera (1,6 s) e o sol (0,9 s) são movimento de filme e terminam parados. Algo novo **a cada batida ou compasso**, não a cada 2 a 4 s | O guia fala de animação de interface; o primeiro vídeo, seguindo o guia ao pé da letra, ficou lento (decisão 2) |
| Termina parado; nada se mexe depois de parado | Cada elemento chega e para. **Sem câmera flutuando, sem parallax, sem loop perfeito.** Os últimos 1,5 a 2 s são um quadro parado (o logo e o convite), com a trilha resolvendo | O curso pede loop; a marca pede fim. O fim parado também é o melhor quadro pra quem pausa |
| Molas: desacelera no fim, sem quicar | Só molas com amortecimento crítico ou maior (`MOLAS`, z ≥ 1, testado). Nada de "passar um fio e assentar" | O curso vende o overshoot como "movimento caro"; aqui é quique |
| Curvas `--chegada` e `--saida` | Na tela do app que aparece no vídeo, as mesmas. No filme, `CURVA.forte` e `CURVA.empurra` | A chegada da interface é calma demais pra corte de filme |
| Ordem da leitura: veredito, ponto, resto; passo de 60 ms | Idem, dentro de cada cena | — |
| Reduzir movimento | Não se aplica a vídeo (não há preferência do sistema). Por isso nada pisca, nada treme, nada passa rápido demais pra ler | — |
| Tamanhos de tipo (72, 52, 46, 18, 15…) em px de tela de 390 | Em vídeo 1080 de largura: veredito 140 a 170, frase de apoio 44 a 48, rótulo 26 a 32, nada abaixo de 28 (lê ~9 pt num celular de 360) | O celular mostra o vídeo a ~1/3 do tamanho |
| Raio 20 só no alerta, Toly, folha, tour | Os cartões de vídeo seguem o site (cantos redondos, decisão do Sidney de 14/10/2026 pro site) | O vídeo vende o site e o app como o site mostra |

## Ritmo e estrutura

O registro do filme (acima) é o padrão; o `estudio/modelo/filme.mjs` já nasce nele. Regras que valem em qualquer vídeo:

1. **O quadro 0 já diz algo** (é a miniatura em alguns feeds; o teste do palco reprova quadro 0 vazio).
2. **O quadro da batida nunca está vazio**: na virada, o título e a tela já estão chegando (o primeiro corte do
   "Propósito" caía num quadro em branco).
3. Duas a cinco features. Com a tela sendo usada (decisão 4), **dois compassos por feature** (entrada, app inteiro,
   foco, toque, confirmação); só a montagem, sem uso, cabe em um. Mais de cinco vira catálogo.
4. **Um problema por vídeo** na abertura (decisão 5): a lista de dores é de um tipo só.
5. O fim é a abertura do app com o sol nascendo no logo, e o convite com o teste grátis **do catálogo**. Parado
   1,5 a 2 s.

Duração: stories 15 a 25 s, reels 15 a 30 s, feed 15 a 30 s; o filme de propósito com cinco features usadas vai a ~38 s
(o Propósito, out/2026). Passou disso, corte uma feature, não acelere.

## Formatos e área segura

`estudio/formatos.mjs` tem os cinco formatos e as margens. Texto e botão só dentro de `L.seguro`; o resto da tela
(imagem, cor) pode sangrar. Uma linha do tempo, todos os formatos: as cenas usam `L.seguro`, `L.u` e `L.W/H`, nunca
pixel fixo; o feed (4:5) é o teste de que a cena não depende da altura do stories.

## O Toly em vídeo (decisão 1)

O guia diz, na lista do "não fazer": **"usar em promoção"**. O site, que também vende, mostra o Toly como feature (o
cartão dele, com a fonte e o "Agora não"). Confirmado pelo Sidney em 14/10/2026:

- **Pode:** o cartão real do Toly como **feature do produto** (capturas `toly-balao`, `toly-tres`), do jeito que ele
  aparece no app: surge (600 ms, subindo até a gravata), pisca uma vez, fica imóvel, some (500 ms).
- **Não pode:** o Toly como narrador, mascote, apresentador, voz, personagem do gancho, na chamada final, comemorando
  ou "chamando de volta". Nada de boca, braço ou corpo. Nada do "mascote falante com ElevenLabs" do curso.

## Preço, teste grátis e promessa

- Preço e teste grátis **só do catálogo da conta** (`ctx.catalogo.teste`, `ctx.catalogo.aPartirDe`), lido na hora do
  render. Escrever "R$ 14,90" ou "30 dias grátis" no filme é erro (o `texto.mjs` pega). Quando a conta muda, o
  `historico.mjs` lista os vídeos a refazer.
- Sem promessa que o site não faz: nada de "economize X%", "o app paga suas contas", "investe por você", "100% seguro".
  A prova de cada feature está em `conhecimento/produtos.json` (o campo `prova`), tirada do site.
- **Fé está em teste:** teaser, nunca "assine" nem "baixe". **Saúde, Casa e Pessoas estão em breve:** só a frase do
  site e "avisamos quando abrir"; nunca mostrar tela que não existe.

## Som (decisão 2)

O guia não define som. A trilha "calma" do primeiro vídeo (colchão, piano elétrico, 90 BPM) foi **reprovada**. O padrão
é a **inspiradora** (`estudio/trilha-inspiradora.mjs`): Ré maior, vi–IV–I–V, piano em colcheias empurrando, subida com
um respiro de uma colcheia, virada com bumbo, palmas, baixo e arpejo, o fim na tônica. Sons de interface: `bate` (o tipo),
`passa` (o empurrão), e os antigos `toque`, `entra`, `assenta`, `troca`. Sem sino (a marca não tem sino). −14 LUFS.

**A música licenciada é o padrão** (out/2026, depois da pergunta do Sidney sobre áudio de licença aberta): a síntese
segue a estrutura, mas não soa como trilha de estúdio. Faixa CC0 ou CC BY (CC BY-ND, SA e NC não servem pra vídeo:
`assets/musicas/LICENCAS.md`), gênero inspirador/uplifting, 100 a 130 BPM, com um trecho calmo e uma subida clara.
`node estudio/batidas.mjs <faixa> --trecho 5,6` acha onde cortar (a virada da música na primeira feature; de
preferência o fim de verdade da música no logo); o filme usa o BPM medido. O crédito da CC BY vai na legenda. A
primeira: "Our Story Begins", Kevin MacLeod. A síntese (`estilo: 'inspiradora'`) fica pra quando não houver faixa. A maior parte assiste sem som: o vídeo tem que funcionar mudo.

## A legenda do post

- A mesma voz: o fato, depois o pedido; até quatro parágrafos curtos; termina em `tolive.app`.
- Sem emoji, sem exclamação, sem "link na bio" gritado, sem enxurrada de hashtag (no máximo três, só se o Sidney
  pedir: **[a confirmar]**).
