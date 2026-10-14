# Guia de marca da toLive

O guia de marca de todos os apps da toLive. Extraído em 14/10/2026 das páginas de design publicadas no
claude.ai e mantido aqui daqui em diante: mudança de marca entra primeiro neste arquivo (e nos
[tokens](tokens.css)), depois no código dos apps. Onde as fontes não dizem, está escrito "não definido";
onde se contradizem, a seção 10 lista, e vale a decisão do Sidney quando houver. As siglas entre colchetes
dizem de onde veio cada regra (ver a seção Fontes):

- **[GM]**: o Guia de marca da toLive, com a prancha citada (L-Essencia, G-Paleta…).
- **[FC]**: o canvas do redesign do Finance, com a prancha citada (V-Tokens = 0.5…).
- **[PL]**: o doc do plano da v2, com a aba citada.
- **[SITE]**: o canvas do site novo (tolive.app), com a página citada.

---

## 1. A ideia

**Promessa (assinatura):** "Tecnologia feita para não ser usada." [GM L-Essencia, I-Logo, I-Splash; SITE Main]

**O que a toLive é:**
- Ela "automatiza a manutenção mecânica da vida (contas, exames, lembretes) para devolver tempo à vida plena e relacional: família, fé, presença real." [GM L-Essencia; SITE Sobre, com vírgulas no lugar dos travessões]
- É uma suíte de apps: Finanças (disponível), Fé (em teste; nome do app a definir), Saúde, Casa e Pessoas (em breve). [SITE Main; GM N-Identidade]
- **Conceito: mordomia.** "Cuidar bem do que nos foi confiado, sem deixar que isso tome o lugar do que importa." [GM L-Essencia; SITE Sobre]
- O manifesto [SITE Sobre] diz: a maior parte da tecnologia pede mais atenção, e a toLive faz o contrário. Ela "cuida da rotina em silêncio e só chama você quando a decisão é sua". "Pensamos como um bom mordomo: fala pouco, fala certo e só quando é necessário."
- **Métrica norte: o tempo fora da tela**, mais as horas economizadas por mês. O sucesso se mede por quão pouco a pessoa precisa abrir o app. [GM L-Essencia] O site diz: "Não contamos aberturas, sequências nem minutos no app. Se você precisa abrir muito, alguma coisa nossa falhou." [SITE Sobre]
- No computador, a métrica é outra: sessões concluídas e minutos por sessão. Uma sessão longa e concluída é sucesso. [GM W-Principios]
- O melhor elogio: "esqueci que tinha o app". [SITE Sobre, Main]
- **Arquitetura: a IA no início, as regras depois.** A IA lê o histórico e sugere regras no onboarding. Aprovadas, as regras passam a um motor determinístico, que cuida sozinho de 95% da rotina. [GM L-Essencia]
- Lema de venda: "Não é um app a mais. É uma tarefa a menos." [SITE Main]

**O que a toLive não é** [SITE Main, tabela "Um app comum × toLive Finanças"; PL, aba Visão de produto]:
- Não mede o sucesso pelas aberturas, e sim pelo tempo longe do app.
- Não abre em gráficos para interpretar. Abre numa frase: "está tudo bem?".
- Não usa avisos para trazer a pessoa de volta. Um aviso pede uma decisão, uma por vez.
- Não tem medalhas, sequências nem desafios: "Fechar o app é o objetivo."
- Não cobra por pessoa da família.
- Os dados não viram oferta de produto. Não treinam modelos e não viram propaganda. Não há anúncios. [SITE Privacidade]
- Não tem chat aberto com a IA, educação financeira, dica do dia, marketplace de crédito com comissão, comparação que culpa sem ação, nem dashboards novos. [PL, Visão de produto, "O que não fazer"]

**Princípios de produto.** O guia e o site dão listas diferentes (ver a seção 10, ainda aberta).
- [GM L-Essencia]:
  1. **Gestão por exceção.** Telas de aprovação rápida, não de exploração. O estado padrão é "Tudo em ordem. Nada exige sua atenção hoje."
  2. **Os três minutos** (o "feche o app e vá viver"). Ver a seção 8.
  3. **Laranja quer dizer "aja agora".** No máximo um sinal laranja por tela. "Se tudo pede atenção, nada pede."
  4. **O veredito vem antes do gráfico.** Toda tela abre com uma frase que responde "está tudo bem?".
- [SITE Sobre], "Quatro regras que valem para todo app":
  1. Gestão por exceção.
  2. Pouco tempo de tela é sucesso.
  3. Um pedido por vez.
  4. A resposta vem antes dos detalhes.

**Computador: profundidade com começo e fim** [GM W-Principios]
1. O veredito continua no topo.
2. A profundidade vira sessão: "Revisão de outubro · 4 etapas · cerca de 10 min."
3. Todo dado denso vem com uma frase de leitura. O Toly explica ao lado, nunca por cima.
4. No computador, o equivalente aos três minutos é a conclusão: a sessão acaba quando as decisões foram tomadas.
5. O painel completo existe ("Ver tudo"), mas nunca é a porta de entrada.

---

## 2. Voz e texto

**A voz:** "Fala como um bom mordomo: pouco, certo, e somente quando necessário." [GM L-Voz]

| Atributo | Regra [GM L-Voz] |
| --- | --- |
| Calma | Sem urgência falsa, sem exclamação, sem alarme |
| Breve | Uma ideia por frase. "Se cabe em 10 palavras, não usa 20" |
| Concreta | Números, datas e nomes reais. Nunca "algumas" nem "em breve" |
| Com saída | Toda pergunta tem um "agora não", e ele é respeitado |

**Sempre** [GM L-Voz]:
- Tratar por "você".
- O fato vem antes do pedido.
- Números por extenso só até dez.

**Nunca** [GM L-Voz]: emoji, culpa, gamificação, "imperdível", "não perca".

**Assim / não assim** [GM L-Voz]:

| Assim | Não assim |
| --- | --- |
| Tudo em ordem. Nada exige sua atenção hoje. | Olá! Confira as novidades do seu dia e veja seus insights! |
| A conta de luz veio 22% acima da média. Pago mesmo assim? | Atenção! Detectamos uma anomalia grave na sua conta! |
| Pronto. Era só isso. | Parabéns! Você completou 1 tarefa hoje. Continue assim! |
| Tudo bem. Não pergunto de novo este mês. | Tem certeza? Você pode estar perdendo dinheiro. |
| Faz cinco semanas que você não janta com os amigos. | Sentimos sua falta! Que tal se divertir um pouco? |

**Veredito** [GM N-Decidir; FC V-Padroes 0.4]:
- Até três palavras em Archivo Black, com o ponto laranja.
- Embaixo vem uma frase com o número que prova o veredito.
- A tela nunca abre num gráfico.
- Estados do Início:
  - "Tudo em ordem.": nada a fazer, sem cartão.
  - "Quase tudo OK.": uma coisa a fazer. O cartão diz o quê, quanto tempo leva e tem a saída.
  - "Três coisas.": várias. O cartão leva a mais grave e as outras viram linhas com selo.
- Exemplos por tela [FC 0.4]:

| Tela | Veredito | Frase de apoio |
| --- | --- | --- |
| Aprovar | "Faltam quatro." | "Cerca de um minuto…" |
| Mês | "No ritmo." | "Passou 39% do mês e você usou 37% do orçamento." |
| Onde foi | "Menos que setembro." | |
| 12 meses | "Sobram R$ 18 mil." | |
| Patrimônio | "Oscilação normal." | |
| Contas | "Tudo lido." | |
| Regras | "Trabalhando." | |

- Variante sem desenho próprio: usa a frase da prancha mais próxima. "Igual" vale dentro de ±3%. [PL, Lacunas do planejamento visual]
- Com mais de uma pessoa, o sujeito muda: "Você está no ritmo", "A Letícia está no ritmo", "A casa está no ritmo". [GM N-Escrita, N-Navegacao]
- Com um membro só, some o que divide por pessoa: "Só você", "entre as suas contas". [PL, Lacunas]

**Botões e ações** [GM L-Componentes, N-Decidir, N-Guias]:
- Um botão primário por tela.
- A saída ("Agora não") é sempre secundária e nunca fica escondida.
- Ao aprovar, o primário é "Certo". "Outra" abre a busca e "Agora não" pula.
- O fim de uma sessão tem o primário "Fechar e ir viver". [GM W-Fim, N-Guias]
- Num passo de guia: "Pronto, próximo". O título é a ação, não o assunto. O nome exato de cada botão do outro site vai em negrito. Termina com "Deu certo quando…". [GM N-Guias]
- Sem spinner. O botão fica desativado e, depois de 300 ms, mostra o rótulo no gerúndio. [PL Lacunas F-7]
- "Desfazer" em vez de "tem certeza?". Toda ação reversível acontece na hora e deixa "Desfazer" até o próximo toque. Só o irreversível pergunta: pede o nome digitado e diz em números o que se perde. [GM N-Decidir]

**Números e dinheiro** [GM N-Escrita; FC 0.4]:
- **Na leitura** (veredito, totais, listas de categoria): sem centavos, "R$ 3.410".
- **No item** (lançamento, cobrança): com centavos, "R$ 89,90".
- **No veredito:** "mil" por extenso ("Sobram R$ 18 mil"), com o número exato logo abaixo.
- **No texto:** por extenso até dez ("Faltam quatro"). Em tabela, algarismo.
- **Sinais** (decisão do Sidney, 14/10/2026, revista no mesmo dia depois de ver na tela; ver a seção 10): o "−" e o "+" escritos ficam só onde o número é **variação** (o patrimônio, a diferença contra o mês anterior ou o orçado) e nas **análises que juntam entrada e saída** (o relatório, o resultado). **No lançamento, não:** a saída fica sem sinal, em tinta, e a entrada leva "+" em verde, porque a lista já diz o que é cada um. Totais que dizem o que são ("Gasto até hoje") ficam sem sinal. O saldo negativo leva "−" em vermelho.
- **Variação do patrimônio:** o sinal vem sempre escrito, e a cor só aparece fora da faixa normal.
- **Datas:** por extenso no Início ("segunda, 12 de outubro"). Em listas e tabelas, "12 out".
- **Números nunca contam para cima.** [GM M-Principios]

**Como chamar as pessoas** [GM N-Escrita]:
- Quem usa é "você".
- Os outros são chamados pelo "como quer ser chamado" do perfil, senão pelo primeiro nome.
- Nunca o e-mail.

**Avisos fora do app (notificações)** [GM N-Escrita; FC I-Avisos 2.8, V-Padroes 0.4]:
- O fato vai no título e o pedido no corpo. O celular recolhido só mostra o título.
- Exemplo: "Restaurantes vai passar do limite" / "No ritmo de agora, R$ 180 acima. Ajusta ou segura?"
- No máximo um por rodada (sincronização), e só com algo a fazer.
- Abre a tela da decisão, não o Início. O que se resolve sozinho sai da bandeja.
- O remetente é o app: "toLive Finanças", com o ícone dele.
- O patrimônio não manda aviso, nunca: oscilação não pede ação.
- Nunca: contagem sem fato ("3 alertas novos"), oscilação, lembrete para abrir o app, emoji, exclamação.
- Exemplos "assim":
  - "Quatro lançamentos sem categoria / Leva cerca de um minuto. Toque para aprovar."
  - "Setembro fechou R$ 840 abaixo do orçado"
  - "O Toly organizou o seu extrato / 24 regras propostas. Revisar leva cerca de 5 minutos."

**Cartão de alerta (o texto)** [GM L-Componentes, N-Decidir]:
- Fato e pergunta.
- Diz quanto tempo leva.
- Sempre tem a saída.

**O Toly fala** "Fato, motivo e pergunta". Sempre mostra a fonte ("Fonte: extrato do banco e e-mails de cobrança") e sempre aceita um "agora não". [GM L-Toly]

**Antecipar um risco:** o risco chega como pergunta com valor ("separo R$ 750 por mês?"), cedo e uma vez só. O "Agora não" vale até o próximo ciclo e diz quando volta. [GM N-Decidir]

**Carregando:** depois de 2 s, uma frase diz o que se busca ("Lendo outubro"). [GM M-Principios; FC 0.4]

**Sem rede:** "Sem conexão · dados de hoje, 08:31". [FC 0.4]

---

## 3. Cor

"Cada cor tem um trabalho só." As camadas vão de 0 a 4. [GM G-Paleta, H-Paleta; FC V-Tokens 0.5]

### 0 · Base: 90% de qualquer tela

| Token | Claro | Escuro |
| --- | --- | --- |
| Papel (`--pagina`) | #EBEAE5 | #121211 ("quase preto, não preto puro") |
| Cartão (`--cartao`) | #F6F5F1 | #1E1D1B |
| Tinta (`--tinta`) | #111111 | #ECEAE4 |
| Tinta 2 (`--tinta-2`) | #55534E | #A3A099 |
| Linha (`--linha`) | #C8C6BF | #33322F |

- A divisória forte é a tinta em 2 px. [FC 0.5]
- Há uma superfície só (o cartão). [FC 0.5]
- Cores que as pranchas usam e que viraram tokens [PL Fundação; Lacunas F-3]:

| Token | Claro | Escuro |
| --- | --- | --- |
| Trilho | #D6D4CD | ver F-3 abaixo |
| Linha marcada | #EFEDE7 | ver F-3 abaixo |
| Esqueleto | #DAD8D1 | ver F-3 abaixo |
| Texto de apoio | #2E2D2A | não definido |
| Véu | valor não definido | o mesmo do claro |
| Papel sem cor (os três minutos e o fim de sessão) | não definido | não definido |

- A F-3 dá os valores escuros de "trilho, desativado, linha marcada, esqueleto e véu" assim, sem dizer qual valor vai em qual token: "linha, #5E5C58, #2A2927 e o mesmo véu".
- Botão desativado: fundo #D6D4CD, texto #6B6963. [GM L-Componentes]
- Hover do botão de ícone: #E2E0D9 no claro e #2A2927 no escuro. Selecionado: invertido (tinta com o ícone em papel). [GM L-Icones]
- Primário: hover em `--tinta-apoio`, pressionado em `--tinta-2`. [PL Lacunas F-27]

### 1 · Sinal: "Precisa de você"

| | Claro | Escuro |
| --- | --- | --- |
| Sinal (fundo) | #F26B3A | #FF7A4A |
| Sinal texto | #B4421A | #FF9468 |
| Sinal suave | #FBE1D6 | #3A2117 |

- No máximo um por tela. Nunca vira dado nem domínio. [GM G-Paleta]
- No escuro fica "um pouco mais claro, para manter o mesmo peso visual". [GM H-Paleta]
- Onde o sinal pode aparecer (teste automático da v2): só no ponto do veredito, no cartão de alerta, na cabeça do Toly e no sol do logo. [PL Movimento]
- Laranja não pode virar "dinheiro saindo" [FC 0.5]: o "−" da saída vai na tinta (ou no vermelho do negativo, no saldo), nunca no sinal.
- A cor de terceiros (logo de banco) não conta como "o laranja da tela". [GM N-Escrita]

### 2 · Veredito: bom ou ruim, em números e selos pequenos

| | Claro | Escuro |
| --- | --- | --- |
| Positivo | #2E6E52 sobre #DCEBE3 | #6FC29A sobre #17302A |
| Negativo | #B4421A sobre #FBE1D6 (= sinal texto) | #FF9468 sobre #3A2117 |
| Neutro | #55534E sobre #F6F5F1 | não definido |

- "O verde nunca vira cor de marca." [GM G-Paleta]
- O selo diz o status sempre em texto, nunca só pela cor. [PL Componentes]

### 3 · Domínio: em que app você está

| App | Claro (tom / fundo) | Texto | Escuro (tom claro / fundo) |
| --- | --- | --- | --- |
| **Finanças · ameixa** | #7A4A7E / #EBDFEC | #6A3E6E | #CC9DCF / #2E1F30 |
| **Fé · cobalto** | #3352B8 / #DDE3F5 | #2C4BA8 | #8EA4F0 / #1D2440 |
| **Saúde · petróleo** | #2F6B73 / #D9E9EA | #255A61 | #7FC2C9 / #13292C |
| **Casa · ocre** | #8C6510 / #F1E6C7 | #7A570C | #E0B65A / #33280F |
| **Pessoas · rosa** | #A3416A / #F5DFE8 | #8E3359 | #E89BBA / #3A1A27 |
| **Conta · tinta** | #111111 / #E2E0D9 | #111111 | #ECEAE4 / #2A2927 |

[GM G-Paleta, H-Paleta, N-Identidade; FC V-Identidade 0.6. O site usa os mesmos tons de texto nas etiquetas da suíte. SITE Main, Comecar]

- **Por que essas cores** [GM N-Identidade]:
  - Azul para Fé: céu, calma.
  - Ameixa para Finanças: já era do guia.
  - Petróleo para Saúde: "o tom clínico que sobrou livre".
  - Ocre continua em Casa.
  - Rosa para Pessoas: "a única área de afeto".
  - Nenhuma encosta no laranja do sinal, no terracota do "passou" nem no verde do "em dia".
  - "Com o app de Fé chegando, o azul vai para ele e Finanças passa a ameixa."
  - Tinta para a Conta (conta.tolive.app), com o laranja só no ícone e na abertura (o nome "CONTA" em
    #F26B3A): a conta é a toLive, não um assunto. A faixa vai em toda tela e o foco em todo botão; em
    laranja, o sinal deixaria de ser "no máximo um por tela" justo no convite e no pagamento. Os fundos
    da etiqueta são o hover do botão de ícone (#E2E0D9 e #2A2927). [Sidney, out/2026]
- **Os cinco lugares da cor de domínio** [GM N-Identidade; FC 0.6]:
  1. A faixa de 8 px no topo. Ver a seção 5.
  2. A etiqueta com nome e ícone (pílula: fundo claro, texto no tom de texto, caixa alta 12/700 com +6%). Fica ao lado do logo no Início e no voltar de toda tela interna.
  3. O ícone do app (o horizonte no tom claro).
  4. A abertura (o nome do app embaixo do logo, no tom claro).
  5. Os avisos (o ícone do app e "toLive Finanças" no remetente).
- O foco de teclado e o destaque de "onde tocar" num guia também usam a cor do app. [GM L-Icones, N-Guias]
- **Nunca** use a cor de domínio:
  - em botão (o primário é tinta);
  - no fundo da tela;
  - no veredito;
  - como sinal. [GM N-Identidade, G-Paleta]
- Fé e Saúde aparecem nas pranchas "só para mostrar o contraste; as frases delas são de exemplo". [GM N-Identidade]

### 4 · Dados: só dentro de gráficos, nesta ordem

| Série | Claro | Escuro |
| --- | --- | --- |
| 1 | #111111 | #ECEAE4 ("a série principal vira a mais clara") |
| 2 | #3352B8 | #7F98EC |
| 3 | #C9A03A | #D9B04A |
| 4 | #8A5C8E | #B88DBC |
| 5 | #A9BDB4 | #5E6B66 |

- As séries "diferem em claridade, não só no tom". [GM G-Paleta]
- A categoria não tem cor. O ícone fica em tinta. [FC 0.5]

### Claro e escuro
- O escuro faz os mesmos trabalhos sob outra luz. As cores ficam mais claras e menos saturadas para não vibrar. [GM H-Paleta]
- O bloco de alerta inverte: no escuro, o que pede ação é o único bloco claro da tela. [GM H-Paleta]
- Os três minutos e o fim de sessão no escuro: "o mesmo filtro; faixa e ponto em #5E5C58; painel no cartão escuro com tinta-2". [PL Lacunas F-4]
- Cabeçalho de sessão no escuro: no cartão escuro. O Desfazer fica invertido, como o único bloco claro. [PL Lacunas F-5]
- Interruptor no escuro: ligado = trilho em `--tinta` com o botão em `--pagina`. Desligado = trilho em `--linha` com o botão em `--tinta-2`. [PL Lacunas F-18]
- theme-color: #EBEAE5 no claro e #121211 no escuro. background_color: #121211 (a abertura é escura). [FC V-Icone 0.8, V-Tokens 0.5]

### Acessibilidade e daltonismo
- Ameixa e cobalto se parecem para quem tem daltonismo vermelho-verde. Por isso a etiqueta leva sempre nome e ícone, nunca só a cor. [GM N-Identidade; FC 0.6]
- As cinco cores de dados diferem em claridade. Revalide as séries para daltonismo em cada tema antes de trocar. [GM G-Paleta; FC 0.5]
- As séries 2 e 4 ficam próximas sob protanopia no escuro (9,2 ΔE00). A série 4 vai hachurada, sem trocar a paleta. [PL Lacunas F-19]
- Os gráficos usam um padrão além da cor. [PL Componentes]
- O status vem sempre em texto, nunca só pela cor. [PL Componentes]

---

## 4. Tipo

"Duas famílias. Uma grita o veredito, a outra explica." Ambas são gratuitas (licença OFL). [GM L-Tipo]

| Família | Uso |
| --- | --- |
| **Archivo Black** (display) | Vereditos, números grandes e títulos de tela. "Uma vez por tela, no topo. Nunca em parágrafo nem em botão." |
| **Space Grotesk** (texto e logotipo) | Todo o resto: textos, listas, botões, rótulos. O logotipo usa o peso 600. |

**Escala** [GM L-Tipo; FC 0.5]:

| Papel | Tamanho · peso · tracking |
| --- | --- |
| Veredito do Início | 72 · −5% |
| Título de tela e valores | 46–52 · −4% |
| Número de apoio | 30 · −3% |
| Corpo de destaque | 18–20 · 500 |
| Texto, listas e botões | 15–16 · 400. Botão em 700 |
| Rótulo de seção | 13 · 700 · caixa alta · +8% |
| Legenda e eixo de gráfico | 12 · 400 · Tinta 2 |
| Campos de formulário | 16 (para o Safari não dar zoom) |

- Os tamanhos que divergiam entre pranchas ficam em eixo 12, número 30 e item da lateral 44. [PL Lacunas F-13]
- O ponto final do veredito tem 0,21 em. [PL Fundação; GM L-Forma, "21% do corpo da letra"]
- **Evitar** Inter, Roboto e Arial, "que deixam a marca com cara de app genérico". [GM L-Tipo]
- **Entrega no app:** as fontes são servidas do próprio app, em woff2 com subset e preload, porque a CSP não aceita fonte externa. A Archivo Black usa `font-display: block`, para o veredito não trocar de fonte no meio da entrada. A Space Grotesk vem num arquivo variável, de 400 a 700. [PL Fundação; FC 0.5]
- No site, o título usa Archivo Black até `clamp(3rem, 7vw, 6.5rem)`, com line-height 0.9 e tracking −0.05em. Os subtítulos usam Space Grotesk 600. Isso é o observado no site, não uma regra escrita. [SITE Sobre, Privacidade]

---

## 5. Forma e espaço

**"O círculo é a forma da marca."** Ele vem do sol do logo. Gráficos, barras, linhas e divisórias continuam retos: "é esse contraste que mantém o caráter editorial." [GM L-Forma]

| Elemento | Raio [GM L-Forma; FC 0.5] |
| --- | --- |
| Ponto (marcadores, legendas, sinal) | 50% |
| Selo, seletor, faixa de domínio | 999 |
| Botão | 999, sempre pílula |
| Cartão de alerta e cartão do Toly | 20 |
| Folha | 20 [PL Fundação] |
| Balão do tour guiado | 20 (decisão do Sidney, 14/10/2026: reto ficou pior, depois de ver na tela) |
| Erro que quebra a linha na barra do Desfazer | vira cartão de raio 20 [PL Lacunas F-29] |
| Gráficos, barras, painéis, linhas | 0 (reto) |
| Ladrilho do ícone do app | 30 em 128 (23,4%) [FC 0.8] |

- **Sem sombra.** "A marca é plana: profundidade é tom (papel, cartão, tinta), não sombra." [FC 0.5; PL Fundação, "Nenhuma sombra"]
- **Faixa de 8 px** no topo de toda tela, na cor do domínio. [GM N-Identidade, G-Paleta; FC 0.6]
  - Fica colada no topo e cobre também a barra de status do celular, que segue a cor dela (theme-color).
  - No escuro, usa o tom claro.
  - Nos três minutos e no fim de sessão, fica cinza junto com o resto, a barra de status inclusive.
  - O topo da tela tem "20 + 12 px". [PL, aba Acompanhamento, 13/10]
- **Alvos de toque** [GM L-Componentes, L-Icones; FC 0.5; PL Fundação]:
  - Botão de 52 px; 44 dentro de cartões; 48 no computador.
  - Ícone de 24 px em alvo de 48 px.
  - Toda folha tem um fechar de 44 px. [PL Lacunas F-8]
  - Nos links do site, altura mínima de 44 px. [SITE]
- **Foco de teclado:** contorno de 2 px na cor do domínio. [PL Fundação; GM L-Icones]
- **Espaço:** "tela 48/24/32 e bloco 24, como em 50 pranchas". [PL Lacunas F-1] As pranchas de celular usam margem lateral de 24 px. Isso é o observado. [GM, pranchas de 390 px]
- **Ponto de quebra para o computador:** 1024 px. [PL Lacunas F-2]
- **Grade de colunas:** não definido. A única grade definida é a de 24 px dos ícones.
- **Logo de terceiros** (banco, igreja, serviço): círculo de 22 a 36 px ao lado do nome, nunca maior que o nosso. Sem logo, as iniciais (no círculo em tinta-2, PL Lacunas F-14). [GM N-Escrita]

---

## 6. Movimento

"Tudo se move como quem chega em silêncio e senta." O movimento existe para explicar, nunca para entreter. [GM M-Principios]

**Princípios** [GM M-Principios]:
- **Calmo:** desacelera no fim, sem quicar.
- **Curto:** nunca mais de 600 ms.
- **Na ordem da leitura:** primeiro o veredito, depois o ponto, depois o resto.
- **Termina parado:** sem loops, menos o Toly pensando.

**Durações (tokens)** [GM M-Principios, N-Movimento; FC 0.5, 0.7]:

| Token | ms | Uso |
| --- | --- | --- |
| `--rapido` | 150 | hover, pressionar, interruptores; troca de número; tudo no reduzir movimento |
| `--padrao` | 250 | ponto final, selos, troca de estado; saída |
| `--entrada` | 400 | elementos surgindo, conteúdo depois do skeleton |
| `--expressivo` | 600 | gráficos crescendo, o Toly surgindo |
| `--fim` | 1200 | só os três minutos e o fim de sessão |

**Curvas:**

| Token | Valor | Uso |
| --- | --- | --- |
| `--chegada` | cubic-bezier(0.2, 0.8, 0.2, 1) | tudo que entra |
| `--saida` | cubic-bezier(0.6, 0, 0.8, 0.4) | tudo que vai embora |
| `--troca` | ease-in-out | estado que muda no lugar |

**Padrões de tela** [GM N-Movimento; FC 0.7]:

| Onde | O que se mexe | Tempo |
| --- | --- | --- |
| Toda tela, ao abrir | O veredito sobe 8 px e aparece. O ponto assenta logo depois (escala de 0 a 1). Os blocos vêm em sequência, 60 ms entre um e outro. Tudo para em menos de 1 s | 400 chegada · ponto 250 · passo 60 |
| Carregando | Nada nos primeiros 300 ms. Depois, skeleton no formato exato do conteúdo, em tons de papel, respirando na opacidade. Depois de 2 s, uma frase ("Lendo outubro") | respira 1,8 s · entra 400 |
| Fila de aprovação | O cartão sai 24 px para a esquerda e o próximo sobe 8 px. A barra do Desfazer sobe e fica até o próximo toque | sai 250 · entra 400 |
| Folhas | Sobem com o véu escurecendo e descem ao fechar. Arrastar segue o dedo, sem mola nem quique | sobe 400 · desce 250 |
| Status e seletores | Trocam no lugar, sem piscar. O veredito novo entra por fade | 250 troca · veredito 150 |
| Gráficos | Barras crescem da base, 40 ms entre uma e outra. Linhas se desenham da esquerda. A frase de leitura chega por último. Só uma vez por tela em cada sessão (a sessão começa ao abrir o app ou ao voltar depois de 30 min fora). Redesenhar no lugar nunca anima | 600 · frase 400 |
| Números | Aparecem prontos e nunca contam para cima ("truque de cassino"). Não mudam enquanto a pessoa olha. Puxar para atualizar troca com fade | 150 |
| Toly | Surge subindo até a gravata e pisca uma vez. Fica imóvel enquanto a pessoa decide. Desce depois da resposta e não volta na sessão | surge 600 · some 500 · anel 1,6 s |
| Os três minutos e o fim de sessão | A cor se esvai para o papel, "devagar de propósito". A frase sobe depois | 1,2 s · frase 400 |
| Tour | No máximo 3 passos, uma vez, com "Pular" à vista. O véu escurece e um anel desliza de alvo em alvo. Reabre em Ajustes, nunca sozinho | 250 |

- Derivados, quando a prancha não diz: o Desfazer sobe em 400 ms, a troca leva 250 ms e o cartão resolvido sai em 250 ms. [PL Lacunas]
- A sequência de entrada termina em 940 ms. [PL Lacunas F-11]

**Reduzir movimento** [GM M-Principios, N-Movimento]:
- Com `prefers-reduced-motion`, tudo vira fade de 150 ms. Nada sobe nem desliza.
- O Toly aparece direto e o pensando vira "…".
- Nos três minutos, a cor troca sem transição.
- O esqueleto fica parado. [PL Movimento]

**Proibido** [GM M-Principios]: quicar, parallax, confete, brilho deslizando no skeleton, contagem de números, carrossel automático, qualquer coisa que se mexa sozinha depois de parada, toast que some sozinho.

**Um padrão para todos:**
- Todo app declara os mesmos tokens e a mesma entrada de tela (`.entra` com `data-ordem="1..8"`, em CSS puro).
- Duração ou curva nova entra primeiro no guia e só depois no código. [GM N-Movimento]

**Checklist de todo PR que mexe em tela** [GM N-Movimento; FC 0.7]:
1. Nada passa de 600 ms, fora o 1,2 s dos três minutos e do fim de sessão.
2. Nada se mexe depois de parado.
3. O único loop é o Toly pensando, mais o esqueleto enquanto carrega [PL].
4. Testado com reduzir movimento ligado.
5. As durações vêm dos tokens.
6. Nenhum número conta para cima.

---

## 7. Logo, símbolo e Toly

### Logotipo
- O nome escrito é "toLive": Space Grotesk 600, tracking −0.02em. O "o" é trocado pelo símbolo: o sol (um arco laranja aberto embaixo) sobre o horizonte (um arco). [GM I-Logo, L-Essencia; SITE, cabeçalhos]
- **Versões** [GM L-LogoUso]:

| Fundo | Versão |
| --- | --- |
| Papel | logo principal: tinta e sol #F26B3A |
| Escuro | logo negativo: texto claro e sol #FF7A4A |
| Laranja | mono preto |
| Foto ou cor | mono branco |

- **Os arquivos** (fundo transparente, texto em contorno: não dependem da fonte instalada): `marca/logo/logo-claro.svg`
  (principal), `logo-escuro.svg` (negativo), `logo-mono-preto.svg` e `logo-mono-branco.svg`. São o mesmo logo que os apps
  desenham em HTML (o `.logo` com o `.logo-simbolo`, traços 17 e 16), conferido pixel a pixel contra o navegador
  (out/2026). Na tela dos apps o logo continua em HTML; o arquivo é pra fora dela: e-mail, documento, loja, imprensa.

- **Área de proteção:** x = a altura do símbolo. Nada entra nessa margem: texto, borda da tela ou outro logo. [GM L-LogoUso]
- **Tamanho mínimo** [GM L-LogoUso]:
  - Logotipo: 96 px de largura (24 mm).
  - Símbolo: 16 px (6 mm), com o arquivo "pequeno".
  - Abaixo de 24 px, use o arquivo do símbolo pequeno, com traço mais grosso, para o sol e o horizonte não se fundirem.
- **Não fazer** [GM L-LogoUso]:
  - esticar ou achatar;
  - trocar a cor do sol;
  - mudar maiúsculas ("T LIVE");
  - girar;
  - pôr sombra ou efeito;
  - pôr o sol sobre laranja (use o mono).
- **Assinatura com o logo:** "Tecnologia feita / para não ser usada", em caixa alta, Space Grotesk 500, tracking +0,30 a +0,34 em, em tinta 2. [GM I-Logo, I-Splash]
- **Abertura (splash):** fundo escuro #121211, o logo centrado e a assinatura embaixo. A abertura do app traz o nome do app ("FINANÇAS") embaixo do logo, no tom claro da cor de domínio. [GM I-Splash, N-Identidade; FC 0.8]

### Símbolo: geometria [FC V-Icone 0.8]
- viewBox 100 × 92.
- **Sol:** arco de raio 30, centro (50; 38,04), aberto embaixo entre (27; 57,3) e (73; 57,3). São 260° de arco, ponta reta.
- **Horizonte:** arco de raio 48,67, centro (50; 120,67), de (18; 84) a (82; 84), passando por (50; 72). Ponta reta.
- **Traço (sol / horizonte) por tamanho:** 15 / 14 em 48 px ou mais; 19 / 17 de 24 a 40 px; 22 / 20 até 20 px. "O traço engrossa nos tamanhos pequenos." [GM I-Logo]

### Ícone do app [FC 0.8, 0.6; GM N-Identidade]
- **Ladrilho:** 128 × 128, canto 30 (23,4%), fundo #111111.
- **Símbolo dentro do ladrilho:** desenhado a 76 × 70 (escala 0,76), `translate(26 29.04)`.
- **Ícone de cada app:** o ícone da toLive "sem mudar nada além do horizonte". O horizonte vai no tom claro do domínio:

| App | Horizonte |
| --- | --- |
| Finanças | #CC9DCF |
| Fé | #8EA4F0 |
| Saúde | #7FC2C9 |
| Casa | #E0B65A |
| Pessoas | #E89BBA |
| Conta | o ícone da toLive em laranja (`icone-tolive-laranja.svg`), sem horizonte de domínio |

- O tom base do domínio some no preto em 48 e 16 px. "Na tela inicial, o sol igual diz que é toLive; o horizonte diz qual app é."
- **Variantes de arquivo:**

| Arquivo | O que muda |
| --- | --- |
| maskable | sem canto; escala 0,64, `translate(32 34.56)`; o símbolo cabe no círculo de 80% |
| apple-touch | 180 px, quadrado cheio sem canto e sem transparência |
| favicon | traço 22 / 20 |
| badge | só o símbolo, branco sobre transparente; traço 19 / 17, `translate(18 21.68)`, escala 0,92 |

- O guia também mostra um "ícone · laranja": fundo #F26B3A, sol #FFF4EC, horizonte #111111. [GM I-Logo]
- **Nunca:** o sol de outra cor, fundo papel ou branco, o nome dentro do ícone, contorno, sombra, o tom base no horizonte. [FC 0.8]
- Manifesto PWA: name "toLive Finanças", short_name "Finanças". [FC 0.8]

### Ícones de interface [GM L-Icones; FC 0.5]
- Grade de 24 px, traço de 2 px, pontas e cantos arredondados, sem preenchimento. A base bate com a biblioteca Lucide.
- Sempre na cor do texto, nunca laranja.
- O estado aparece num círculo atrás do ícone e o traço não muda: normal, hover, pressionado, selecionado (invertido), foco (na cor do app), desativado. O hover leva 150 ms.
- **Sem sino de notificação.** Quem chama atenção é o veredito e, quando preciso, o Toly.
- O ícone "brilho" da IA sai. Quem representa a IA é o Toly. [FC 0.5]
- A lateral do computador não tem ícones nos itens. [PL Lacunas F-23]

### Toly, o assistente ("o mordomo silencioso") [GM L-Toly; SITE Main]
- **O que é:** "Surge quando vale o seu tempo. Depois, some." Ele cruza os dados dos apps da suíte e aparece para trazer exatamente o que a pessoa precisa, ou para assumir parte do trabalho pesado.
- **Construção** (tamanhos de 72, 44 e 24 px; o de 30 px é o de 44 reduzido, PL Lacunas F-31):
  - cabeça em sinal #F26B3A (no escuro, #FF7A4A);
  - olhos em cápsula e gravata em tinta (no escuro, a gravata fica #ECEAE4);
  - sem boca, corpo nem brilho.
- **Quando aparece:**
  - Só com uma decisão para a pessoa ou um trabalho que ele pode assumir.
  - Nunca na tela "Tudo OK", nunca como enfeite.
  - No Finance: na chegada (lê 12 meses e propõe regras), quando um mês da projeção vai fechar negativo, quando um saldo informado à mão envelhece e no "Organizar de novo".
  - Nunca na fila de aprovação nem para comentar a bolsa. [FC 0.4]
  - "Sugestão de regra fixa não ganha rosto: ganha fonte." [GM N-Decidir]
- **Como fala:** fato, motivo e pergunta. Sempre com a fonte e um "agora não". [GM L-Toly]
- **Roteiro de movimento:**

| Estado | Tempo | Como |
| --- | --- | --- |
| Surgir | 0,6 s | sobe de baixo até a gravata, desacelerando, e pisca uma vez |
| Pensando | contínuo | olhos para cima, de um lado ao outro, e um anel de tinta girando (1 volta a cada 1,6 s), só quando a resposta passa de 2 s |
| Falando | parado | imóvel enquanto a pessoa decide |
| Sumir | 0,5 s | desce e some; não volta na sessão |

- **Enquanto pensa:** nunca trava a tela. Diz o que está fazendo e quanto falta, e oferece sair: "Pode fechar, eu aviso quando terminar."
- **Não fazer** [GM L-Toly; SITE Main]:
  - adicionar boca, braços ou corpo;
  - mudar a cor da cabeça;
  - usar em promoção;
  - fazê-lo comemorar tarefas;
  - deixá-lo "pensando" sem dizer no quê;
  - fazê-lo aparecer para pedir que a pessoa volte.
- Os arquivos oficiais citados pelo guia (toly.svg, toly-escuro.svg, toly-avatar.svg, "no pacote da marca") não estão publicados nas páginas. No app, "um motion designer transforma este roteiro em Lottie ou Rive".

### Os arquivos desta pasta
Copiados das pranchas, com a geometria e as cores exatas.

| Pasta | Arquivos | Origem e observações |
| --- | --- | --- |
| `simbolo/` | `simbolo-claro.svg`, `simbolo-escuro.svg` | traço 15/14 [GM I-Logo] |
| `simbolo/` | `simbolo-24px.svg` (19/17), `simbolo-16px.svg` (22/20) | viewBox estendido 4 unidades para cima, para o traço grosso não ser cortado |
| `icones-de-app/` | `icone-tolive-escuro.svg`, `icone-tolive-laranja.svg` | [GM I-Logo] |
| `icones-de-app/` | `icone-financas.svg` e as variantes `-maskable`, `-apple-touch`, `-favicon`, `-badge` | o código da 0.8 [FC V-Icone]; iguais aos que o Finanças usa em produção |
| `icones-de-app/` | `icone-fe.svg`, `icone-saude.svg`, `icone-casa.svg`, `icone-pessoas.svg` | montados pela regra "trocando só o horizonte" [FC 0.8]; ninguém usa ainda |
| `toly/` | `toly-72px.svg`, `toly-44px.svg`, `toly-24px.svg`, `toly-escuro.svg`, `toly-pensando-anel.svg` | [GM L-Toly] |
| `icones/` | `interface.mjs` (26 desenhos e 5 apelidos: voltar, inicio, financas, fe, saude, pessoas, calendario, feito, fechar, adicionar, buscar, regras, horas e os das pranchas e do estilo do guia) e `assuntos.mjs` (54 assuntos: mercado, casa, saúde, viagem…, os ícones de categoria do Finanças), com `svgDoIcone`/`svgDoAssunto`; `svg/interface/` e `svg/assuntos/` gerados deles (`ferramentas/gerar-svgs.mjs`) | a fonte única dos ícones; o mesmo desenho que o Finanças usa hoje, byte a byte |
| — | logotipo com o texto | não há arquivo: é texto em Space Grotesk 600 com o símbolo no lugar do "o" (ver o `logo()` em `tolive-financas/publico/js/marca.mjs`) |

--- | --- |
| `simbolo-claro.svg`, `simbolo-escuro.svg` | traço 15/14 [GM I-Logo] |
| `simbolo-24px.svg` (19/17), `simbolo-16px.svg` (22/20) | viewBox estendido 4 unidades para cima, para o traço grosso não ser cortado |
| `icone-tolive-escuro.svg`, `icone-tolive-laranja.svg` | [GM I-Logo] |
| `icone-financas.svg` | o código da 0.8, idêntico [FC V-Icone] |
| `icone-financas-maskable.svg`, `icone-financas-apple-touch.svg`, `icone-financas-favicon.svg`, `icone-financas-badge.svg` | montados pela regra "os outros arquivos mudam só isto" da 0.8 [FC V-Icone] |
| `icone-fe.svg`, `icone-saude.svg`, `icone-casa.svg`, `icone-pessoas.svg` | montados pela regra "trocando só o horizonte" [FC 0.8] |
| `toly-72px.svg`, `toly-44px.svg`, `toly-24px.svg`, `toly-escuro.svg`, `toly-pensando-anel.svg` | [GM L-Toly] |
| `icone-ui-*.svg` (13 ícones) | voltar, inicio, financas, saude, pessoas, agenda, feito, fechar, adicionar, buscar, regras e horas [GM L-Icones], mais o fe da etiqueta [GM N-Identidade]. Com `stroke="currentColor"`, porque o ícone vai "sempre na cor do texto" |
| Logotipo com o texto | não salvo: nas páginas ele é texto em Space Grotesk mais o SVG do símbolo, não um desenho único |

---

## 8. Componentes e padrões

### Regras nomeadas
- **Os três minutos** (decisão do Sidney, 14/10/2026: é um aprendizado nosso pra aplicar, não um nome pra mostrar):
  - **Nunca se cita pra quem usa** — nem "Lei 10", nem o livro de onde veio (Diário de um CEO). Tela, site, e-mail, push e loja só mostram o efeito: a cor que se esvai e a frase. O nome "Lei 10" também sai dos documentos e das telas internas; no código pode ficar onde já está, até a próxima vez que se mexer ali.
  - **Enunciado** [GM L-Essencia]: "Após 3 minutos de uso ativo, a interface perde a cor e diz: 'Nossa tecnologia já cuidou do trabalho pesado. Feche o app e vá viver.'"
  - **Detalhes** [FC 0.4, I-Lei10 2.6; PL Jornada 2, Lacunas F-10, F-32 a F-35]:
    - Vale só no celular, com uso ativo (toques e rolagem; tela parada não conta, e a contagem pausa depois de 15 s parado).
    - Não vale na sessão de chegada nem nas sessões do computador, que acabam pela conclusão.
    - Zera depois de 30 min fora ou na virada do dia.
    - Aos 3 min, a cor se esvai em 1,2 s (a faixa e a barra de status ficam cinza), o conteúdo fica inerte e o painel entra.
    - O painel tem "Continuar mesmo assim" (que não volta na mesma abertura) e "Ver acontecer".
    - Na fila, ela guarda o resto para amanhã ("São da viagem").
    - Com uma folha aberta, espera a folha fechar.
- **Um sinal por tela** [GM L-Essencia, G-Paleta; PL]: no máximo um laranja por tela. "Se tudo pede atenção, nada pede." O ponto final do veredito é a única exceção: "assinatura da marca, não alerta", e aparece uma vez por tela. [GM L-Forma]
- **Um pedido por vez** [SITE Sobre]: "Cada tela traz no máximo uma coisa para você resolver."
- **Dois toques para decidir, três para ver** [GM N-Navegacao]: qualquer decisão fica a no máximo dois toques do Início, e qualquer dado a três. "Passou disso, a tela está no lugar errado."
- **Aprovar em vez de preencher** e **Desfazer em vez de "tem certeza?"** [GM N-Decidir]: ver a seção 2.
- **Variação só é notícia fora do normal** [GM N-Decidir]: o que oscila sozinho tem uma faixa normal da própria pessoa. Dentro dela, o veredito é "normal" e o selo é neutro. Fora dela, uma frase com a causa. Oscilação nunca vira aviso.
- **Feito em silêncio** [GM N-Decidir]: o Início prova o trabalho, com o que o app fez sozinho na semana e o tempo poupado. "É o que deixa a pessoa fechar o app sem culpa."

### Veredito com o ponto
- `<h1>` em Archivo Black, em três tamanhos (72 / 52 / 46) [PL Componentes; FC 0.5].
- O ponto final é sempre um círculo laranja desenhado, com 0,21 em e margem de 0,05 em, nunca o ponto quadrado da fonte. No escuro, #FF7A4A. Fica com `aria-hidden`. [GM L-Forma; PL]

### Cartão de alerta ("o bloco inverso")
- Fundo de tinta #111111 com texto papel no claro; fundo claro #ECEAE4 com texto #121211 no escuro.
- Raio 20, padding 18, bolinha de sinal de 10 px à esquerda, etiqueta do domínio em cima (na Início da suíte).
- Botões de 44 px: o primário invertido (pílula papel) e o secundário com contorno 1 px #6B6963.
- "O único bloco escuro da tela (claro, no modo escuro). No máximo um por tela." [GM L-Componentes, H-Paleta, H-Inicio]
- "Agora não" sempre presente. A ordem vem do servidor. Nunca aparece junto com o cartão do Toly. [PL Componentes]
- **Qual cartão ganha** (um só; os outros viram linhas com selo) [GM N-Decidir; FC 0.4]:
  1. O app parou de receber (conexão, sincronização).
  2. Dinheiro talvez errado (cobrança em dobro, valor fora do comum).
  3. Um combinado vai estourar (limite, prazo).
  4. Coisas para aprovar.
  5. Arrumação (dono de conta, regras repetidas).
  6. O Toly com algo pronto, no cartão dele.

### Cartão do Toly
- Fundo cartão #F6F5F1, raio 20, o Toly à esquerda.
- Sempre com a fonte e uma saída. Nunca dois por tela, nunca no "Tudo em ordem". [GM L-Componentes]

### Botões [GM L-Componentes]

| Tipo | Aparência |
| --- | --- |
| Primário | pílula de tinta com texto papel, 700 |
| Secundário | pílula com contorno de 2 px em tinta |
| Terciário | texto sublinhado |
| Desativado | fundo #D6D4CD, texto #6B6963 |

- Altura 52 (44 em cartão).
- O primário não é cor de domínio nem laranja. [FC 0.5]

### Selos
- Pílula 999, 13/700, com texto curto e nunca frase.
- O veredito vai em verde ou no tom escuro do sinal; o domínio, no tom claro da sua cor. [GM L-Componentes]

### Seletor
- Até 3 opções, para alternar visões da mesma informação.
- Pílula com contorno de 2 px; a opção ativa em tinta; `aria-pressed`. [GM L-Componentes; PL]

### Linha de lista
- Faixa de domínio à esquerda (4 × 28 px), status à direita, linhas retas. [GM L-Componentes]
- "Áreas são linhas com status": o selo só quando é veredito; texto em tinta 2 quando é só informação. [GM N-Navegacao]

### Folha
- `<dialog>` com foco preso; desce animada antes de fechar. [PL Componentes]
- O foco vai para o primeiro elemento marcado; sem marca, para o fechar. [PL Lacunas F-30]

### Barra do Desfazer
- Fica até o próximo toque, nunca por tempo.
- Os erros usam a mesma barra, com "Tentar de novo". [PL Componentes, Lacunas F-9]

### Navegação [GM N-Navegacao]
- O Início é a única porta. No celular não há barra de abas.
- Toda tela interna tem no topo a seta, a etiqueta do app e o nome da tela (só o último nível).
- "Ver tudo" guarda o painel completo, nunca como porta nem convite.
- O aviso abre a decisão.
- No computador, a lateral é curta e as sessões aparecem no Início.
- O "Quem" é a foto no canto.
- Ajustes iguais em todos os apps: Você / A casa / O Toly / Ajuda. Toda chave salva na hora, sem botão Salvar.

### Chegada e guias [GM N-Guias]
- A sessão "Começar" tem três etapas com duração, "Fazer no computador" e "Pode fechar, eu aviso".
- O fim é explícito, no papel sem cor: "Pronto", os números e "Fechar e ir viver".
- O tour vem depois, em três passos, uma vez.
- **Anatomia de um passo de guia:** onde (site, aparelho, tempo), título que é ação, o porquê em uma frase, desenho esquemático ("nunca captura com dado real de ninguém"), os nomes exatos dos botões, "Deu certo quando…", "Pronto, próximo" e "Travou?".

---

## 9. E-mail

As páginas de design não têm uma prancha de e-mail. O que existe está no plano [PL, aba Acompanhamento, V-3 e V-3b, 13–14/10] e nas regras de aviso:

- **Layout:** papel e tinta, o veredito em Archivo Black com o ponto final laranja, barras em tinta e cinza, versão escura. Vale para todos os e-mails: o resumo, o fechamento, o semanal, o convite e o roteiro.
- **Conteúdo, pelo guia (V-3b, aprovada e no ar desde 14/10):**
  - o veredito pela ordem de gravidade;
  - o pedido como botão;
  - no semanal, o "Feito em silêncio" e as principais variações do patrimônio, com o sinal sempre e a cor só fora da faixa normal.
- **O que foi reprovado (V-3, #146):**
  - centavos na leitura;
  - caixas e selos coloridos;
  - variação do patrimônio sempre verde;
  - e-mail sem o pedido;
  - o mesmo estouro repetido três vezes;
  - ruído sem ação.
- **Remetente:** "toLive Finanças". [GM N-Identidade; FC 0.8]
- O resumo semanal por e-mail continua e vem desligado para famílias novas. [FC I-Avisos]
- No site, o e-mail de lista de espera promete: "Um e-mail, uma vez. Sem lista de novidades." [SITE Comecar]
- **Não definido nas fontes:** largura, grade, tamanhos de tipo do e-mail, a fonte reserva. (O CLAUDE.md do repositório, que não é uma das páginas de design, descreve: HTML em tabela com estilo inline, faixa de 8 px ameixa, fonte de sistema na falta da web, escuro por `prefers-color-scheme`, e o app chamado "Finance ToLive", grafia que saiu: ver a seção 10.)

---

## 10. Decisões sobre as contradições entre as fontes

As fontes divergiam em 13 pontos. Abaixo, o que vale. **Regra geral (Sidney, 14/10/2026): o guia é lei**, e
dentro do guia **a regra escrita vence o exemplo desenhado numa prancha**.

### Decididas pelo Sidney (14/10/2026)

| # | Ponto | O que vale |
| --- | --- | --- |
| 1 | Quem manda: canvas, guia ou plano | **O guia.** Este arquivo é o guia daqui em diante; desvio só com decisão do Sidney, registrada aqui. |
| 3 | Grafia da marca | **toLive** sempre: no logo, no texto, no código e no e-mail. "ToLive" e "Finance ToLive" saem. O app é **toLive Finanças** (e os próximos, toLive Fé, toLive Saúde…). |
| 4 | Raio 20 nos cartões comuns | **O guia:** raio 20 só no cartão de alerta, no cartão do Toly, na folha e no balão do tour guiado (acrescentado em 14/10/2026); painéis e cartões de conteúdo são retos. O que o Finanças faz diferente é ajuste a fazer nele. **O site é exceção** (decisão do Sidney, 14/10/2026, depois de ver os dois lado a lado): fica com os cantos redondos do design dele; o `CLAUDE.md` do site diz quais. |
| 5 | Sinal nos números de dinheiro | **Sinal só onde ele informa:** variação e análises que juntam entrada e saída (relatório, resultado). No lançamento, a saída fica sem sinal em tinta e a entrada com "+" em verde (a 0.4 do canvas). Primeiro decidido "em todo número"; revisto no mesmo dia, depois de ver o "−" em cada linha do Extrato. |

### Resolvidas pela regra (a regra escrita vence o desenho)

| # | Ponto | O que vale |
| --- | --- | --- |
| 6 | "3 assinaturas" no cartão do Toly | Por extenso até dez: "três assinaturas". |
| 7 | Vários laranjas na prancha de Orçamento | Um sinal por tela. Barra de categoria e marca de "hoje" não são laranja. |
| 8 | Selos retos na G-Paleta | Selo é pílula (999). |
| 9 | Série 1 de dados em #55534E no Patrimônio | Série 1 é a tinta (#111111 / #ECEAE4). |
| 11 | Horizonte claro do logo negativo: #EBEAE5 ou #ECEAE4 | #ECEAE4, a tinta do escuro (`--tinta`). |
| 12 | Frase do fim de sessão no computador | "Fechar e ir viver" (já decidido no plano, F-36). |
| 13 | Cenários da projeção nas pranchas | Não é marca: o produto tirou os cenários em out/2026. As pranchas estão desatualizadas nisso. |

### Decididas depois (Sidney, 14/10/2026)

| # | Ponto | O que vale |
| --- | --- | --- |
| 2 | Os princípios | Os quatro do guia valem pra quem constrói: gestão por exceção, os três minutos, laranja = aja agora, veredito antes do gráfico. O site fala com quem compra do jeito dele. **"Lei 10" não se cita em lugar nenhum**: é um aprendizado (de Diário de um CEO) pra aplicar no produto, não um argumento pra mostrar ao cliente. |
| 10 | A bolinha do cartão de alerta no escuro | **#E2582A**, o `--inverso-ponto` do escuro: sobre o bloco claro (#ECEAE4) dá 3,1:1, e o #FF7A4A daria 2,2:1, abaixo do mínimo de 3:1 pra elemento gráfico. |

Com isso, as 13 estão decididas.

## 11. Fontes

O pedido apontava duas páginas. A primeira, o plano, é um doc do Claude Docs. Ela tem o resumo dos tokens, mas não as pranchas G-Paleta, L-Tipo etc. O plano aponta como "fontes de verdade" o Guia de marca e o canvas do Finance, e foi deles que saíram as pranchas citadas. Por isso há quatro fontes.

| Sigla | Artifact | Usado em |
| --- | --- | --- |
| **[GM]** | "ToLive — Guia de Marca", https://claude.ai/artifact/HkcauHgoK8LnoHLq7R8rT8 (citado no PL como "páginas 1 a 9") | Pranchas L-Essencia e L-Voz (1 Essência); I-Logo, I-Splash e L-LogoUso (2 Logo); G-Paleta e H-Paleta (3 Cor); L-Tipo e L-Forma (4 Tipografia e forma); L-Componentes, L-Icones, D-Orcamento, D-Projecao, G/H-Patrimonio e H/I-Inicio (5 Interface); M-Principios, M-Demos e N-Movimento (6 Movimento); W-Principios, W-Inicio, W-Sessao e W-Fim (7 Computador); L-Toly (8 Toly); N-Identidade, N-Navegacao, N-Decidir, N-Guias e N-Escrita (9 Padrões de produto). Seções 1 a 8 |
| **[FC]** | Canvas do redesign do Finance, https://claude.ai/artifact/BbyNaxfM23LctGbiAF6xQg | Pranchas V-Tokens (0.5), V-Identidade (0.6), V-Movimento (0.7), V-Icone (0.8), V-Padroes (0.4), I-Lei10 (2.6), I-Avisos (2.8). Seções 2, 3, 5, 6, 7 e 8 |
| **[PL]** | "Finance v2 — plano de implementação do redesign", https://claude.ai/code/artifact/ed167d1b-cbdb-4504-8dc2-bc4422c910ab | Aba principal (Fontes de verdade, Fundação: tokens e componentes, Movimento, Jornadas 1 e 2, Lacunas do planejamento visual); aba Lacunas (F-1 a F-41: as lacunas da fundação, não seções de marca); aba Acompanhamento (o guia como lei em 13/10, e-mails V-3/V-3b); aba Visão de produto ("O que não fazer"). Seções 1 a 9 |
| **[SITE]** | "toLive — Site", https://claude.ai/artifact/25BDL4QkgH3xDTt2TRQmes | Páginas Main (Início), Financas, Planos, Sobre, Privacidade e Comecar. Seções 1 (promessa, manifesto, princípios, o que não é), 3 (cores da suíte), 4 (tipo observado) e 7 (Toly, logo) |
