# A marca em vídeo

O guia de marca (`.claude/skills/tolive-marca/guia.md`, copiado do tolive-base) foi escrito pra tela de app. Um
vídeo de venda é outro meio: tem corte, trilha e 15 segundos pra convencer alguém que não pediu pra ver. Este
arquivo diz onde o guia vale ao pé da letra, onde ele foi traduzido e por quê. **O que não está aqui, vale o guia.**
Mudança de marca entra primeiro no guia (tolive-base), depois aqui.

Escrito em 14/10/2026 junto com o primeiro vídeo (`videos/2026-10-14-financas-tudo-em-ordem`). As traduções marcadas
**[a confirmar]** são proposta do estúdio, não decisão do Sidney.

## A ideia que o vídeo vende

- "Tecnologia feita para não ser usada." Não é um app a mais, é uma tarefa a menos.
- O vídeo vende **alívio**, não empolgação. Quem assiste tem que sentir a casa em ordem, não a adrenalina de um
  lançamento. O teste: o vídeo acabou e a pessoa respirou, ou ficou agitada? Agitada é errado.
- Por isso, do curso de motion (`curso-motion.md`) a gente copia o arreio (render, molas, batida, crítica) e recusa a
  estética de showreel ("go all out", técnica nova a cada plano, quique).

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
| Logo: não esticar, não girar, sem efeito, não trocar a cor do sol; área de proteção = a altura do símbolo | Idem. O sol pode **nascer** de trás do horizonte (`logoComSol`): sobe e para, sem girar nem brilhar **[a confirmar]** |
| O fim: a abertura do app (fundo escuro, logo, o nome do app no tom claro do domínio, a assinatura) | É o cartão final padrão do modelo |
| Telas de exemplo, nunca com dado real de alguém | As capturas vêm do site (dados de exemplo). Print do app só com conta de demonstração |

## O que foi traduzido (o vídeo não é uma tela de app)

| Guia (app) | Vídeo | Por quê |
| --- | --- | --- |
| Nada passa de 600 ms | **Cada movimento** (entrada, saída, troca) cabe nos tokens: 150, 250, 400, 600 ms; a folha e o "esvaziar a cor", 1,2 s. O que muda é o **ritmo**: algo novo a cada 2 a 4 s | O guia fala de animação de interface; corte de cena não é animação. Sem novidade a cada 2 a 4 s, o feed passa o vídeo |
| Termina parado; nada se mexe depois de parado | Cada elemento chega e para. **Sem câmera flutuando, sem parallax, sem loop perfeito.** Os últimos 1,5 a 2 s são um quadro parado (o logo e o convite), com a trilha resolvendo | O curso pede loop; a marca pede fim. O fim parado também é o melhor quadro pra quem pausa |
| Molas: desacelera no fim, sem quicar | Só molas com amortecimento crítico ou maior (`MOLAS`, z ≥ 1, testado). Nada de "passar um fio e assentar" | O curso vende o overshoot como "movimento caro"; aqui é quique |
| Curvas `--chegada` e `--saida` | Mesmas (`CURVA`, `entra`, `sai`) | — |
| Ordem da leitura: veredito, ponto, resto; passo de 60 ms | Idem, dentro de cada cena | — |
| Reduzir movimento | Não se aplica a vídeo (não há preferência do sistema). Por isso nada pisca, nada treme, nada passa rápido demais pra ler | — |
| Tamanhos de tipo (72, 52, 46, 18, 15…) em px de tela de 390 | Em vídeo 1080 de largura: veredito 140 a 170, frase de apoio 44 a 48, rótulo 26 a 32, nada abaixo de 28 (lê ~9 pt num celular de 360) | O celular mostra o vídeo a ~1/3 do tamanho |
| Raio 20 só no alerta, Toly, folha, tour | Os cartões de vídeo seguem o site (cantos redondos, decisão do Sidney de 14/10/2026 pro site) | O vídeo vende o site e o app como o site mostra |

## Ritmo e estrutura (o padrão do estúdio)

Herdado do passo 04 do curso, ajustado:

1. **Gancho (0 a 2 s):** o problema ou a resposta em até cinco palavras de tipo enorme, **já no quadro 0** (o quadro 0
   é a miniatura em alguns feeds; o teste do palco reprova quadro 0 vazio).
2. **O produto de verdade aparece** (captura do site), subindo de baixo, sem quique.
3. **Uma, duas ou três features**, cada uma um momento de interface real (o cartão que chega, o toque no botão).
   Uma ideia por vídeo; três features é o máximo, não a meta.
4. **Uma frase de fecho** no veredito ("Pronto. Era só isso.", "Depois, vá viver.").
5. **O fim** (a abertura do app) e o convite: "Comece em tolive.app", com o teste grátis **do catálogo**.

Duração: stories 10 a 16 s, feed e reels 12 a 30 s. Mais curto ganha: um vídeo de uma ideia só não precisa de 30 s.

## Formatos e área segura

`estudio/formatos.mjs` tem os cinco formatos e as margens. Texto e botão só dentro de `L.seguro`; o resto da tela
(imagem, cor) pode sangrar. Uma linha do tempo, todos os formatos: as cenas usam `L.seguro`, `L.u` e `L.W/H`, nunca
pixel fixo; o feed (4:5) é o teste de que a cena não depende da altura do stories.

## O Toly em vídeo **[a confirmar com o Sidney]**

O guia diz, na lista do "não fazer": **"usar em promoção"**. O site, que também vende, mostra o Toly como feature (o
cartão dele, com a fonte e o "Agora não"). A leitura do estúdio:

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

## Som **[a confirmar]**

O guia não define som. A proposta (`estudio/som.mjs`): Ré maior, acordes abertos, piano elétrico suave em colcheias,
baixo nos tempos fortes, pulso quase inaudível, 84 a 100 BPM; quatro sons de interface baixos (toque, entra,
assenta, troca); sem riser, sem drop, sem sino (a marca não tem sino). Mixagem em −14 LUFS. A maior parte assiste sem
som: o vídeo tem que funcionar mudo.

## A legenda do post

- A mesma voz: o fato, depois o pedido; até quatro parágrafos curtos; termina em `tolive.app`.
- Sem emoji, sem exclamação, sem "link na bio" gritado, sem enxurrada de hashtag (no máximo três, só se o Sidney
  pedir: **[a confirmar]**).
