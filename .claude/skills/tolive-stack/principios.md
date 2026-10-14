# Princípios de programação

O que vale pra todo app da toLive, em qualquer linguagem. Tirado do que o Finanças provou em produção (set–out/2026) e do que a primeira versão do site ensinou do jeito difícil. Exceção é permitida, com o motivo escrito no `CLAUDE.md` do app.

## Língua e nomes

- **Tudo em português**: variáveis, funções, rotas, campos, tabelas, mensagens, comentários e commits.
- **Identificadores sem acento** (`lancamentos`, `naoAutenticado`); **texto que a pessoa lê, com acento**.
- Nome diz o que é, não o tipo: `lancamentosDoMes`, não `arrLanc`. Função com verbo (`calcularProjecao`), valor com substantivo (`projecao`), booleano que se lê como pergunta (`ehCartao`, `podeConvidar`).
- O vocabulário do produto vale no código: se a tela diz "Extrato", a rota e o módulo dizem `extrato`. Quando a tela muda de nome e o código não, o `CLAUDE.md` diz (o Finanças: "Família" na tela, `ambos` no código).

## Dependências

- **Zero dependências por padrão.** Node ≥ 22 tem `fetch`, `node:test`, `node:crypto`, `--env-file` e `--watch`; o navegador tem módulos ES, `fetch`, `IndexedDB`, service worker e CSS com variáveis. O Finanças inteiro (login, banco, push com VAPID, e-mail, IA, PWA offline) roda sem nenhum pacote.
- Cada dependência é uma decisão escrita: o que ela faz que a plataforma não faz, e o custo (build, atualização, superfície de ataque, CSP). "Todo mundo usa" não é motivo.
- Sem framework, sem bundler, sem build no padrão. O site antigo (React + Vite + Docker) levava ~20 min pra publicar (imagem Docker refeita sem cache) e brigava com a CSP e com o CSS do resto; o Finanças publica com os testes, um `rsync` e um restart.

## Código

- **ESM em toda parte** (`.mjs` no Node). Um módulo, um assunto.
- **Domínio puro no centro.** A regra de negócio não importa banco, HTTP nem `node:*`: recebe dados e devolve dados. Isso deixa testar sem servidor e, no Finanças, rodar a mesma regra no navegador sem rede.
- **Comentários raros, explicando por quê** — a decisão, o caso real que levou a ela, a data. O "o quê" o código diz. Bom: `// A Pluggy data a 2ª parcela na abertura da fatura seguinte (out/2026)`.
- **Decisões do produto têm dono e data** no comentário ou no `CLAUDE.md` ("decisão do Sidney, out/2026"): daqui a seis meses ninguém lembra por que o aviso sai só a partir do dia 11.
- Erro de quem usa (entrada inválida) é 400 com uma frase que a pessoa entende; erro nosso é 500 com "Erro inesperado. Tente de novo." e o detalhe só no log.
- Nada de `try/catch` que engole erro em silêncio. Se ignorar é o certo, o comentário diz por quê.

## Dinheiro, datas e números

- **Dinheiro em centavos inteiros** do começo ao fim da conta; vira reais só pra mostrar. (`Math.round(valor * 100)` na entrada; nunca somar `0.1 + 0.2`.)
- **Datas no fuso America/Sao_Paulo**, sempre explícito. O servidor roda em UTC: agrupar por dia ou mês no fuso do servidor joga a compra das 22h no dia seguinte.
- O "hoje" do app vem do servidor, não do relógio do aparelho.

## Dados

- **Nada se apaga fisicamente** sem uma razão escrita: some com `removido_em` (e `removido_por` quando foi uma pessoa). O "Desfazer" é restaurar. A exceção (apagar a família, LGPD) é explícita e testada.
- **Separar o que veio de fora do que a pessoa decidiu.** No Finanças, a sincronização reescreve o lançamento à vontade, mas nunca toca na classificação, que mora em outra tabela.
- O que a pessoa decide nunca é sobrescrito por automação (a regra não passa por cima da classificação à mão).

## Segurança e privacidade

- Segredo nunca vai pro git, nem pro navegador, nem pro chat. Fica no `credentials/.env` do servidor.
- O token de login não chega ao JavaScript da página (ver [login.md](login.md)).
- Toda tabela com dado de pessoa tem RLS (ver [banco.md](banco.md)); o código filtra também, em dobro.
- O que vai pra fora (IA, e-mail, push) leva o mínimo, e o que a promessa de privacidade diz que não vai não vai: no Finanças a IA não vê nome, CPF nem número de conta — um teste confere.

## Trabalho

- **Branch → PR → testes → merge → deploy automático.** Nada vai pro `main` sem PR.
- **O `CLAUDE.md` de cada app é a documentação** do app e é atualizado no mesmo PR que muda o comportamento. Se crescer, vira panorama e os detalhes vão pra `docs/`.
- Antes de mexer em produção (migração, deploy, dado real): backup, teste contra cópia, janela calma.
- `npm run local` (ou o equivalente) roda o app inteiro sem tocar em produção, com dados simulados versionados. Dado real nunca vai pro git.
