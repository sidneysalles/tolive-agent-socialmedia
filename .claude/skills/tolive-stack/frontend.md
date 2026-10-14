# Frontend

Uma SPA em JavaScript puro, PWA, mobile-first, servida pelo mesmo Node da API. A marca vem de
[`marca/`](../marca/). A implementação de referência é o [`modelo/`](../modelo/) deste repositório, que o `novo-app.mjs` copia
pra um app novo: cada caminho citado aqui sem outro repositório é de lá. O que o modelo ainda não tem
(batch, webhook, leitura sem rede, IA) está descrito aqui e existe no Finanças; quando um segundo app
precisar, a peça entra no modelo.

## Sem framework, sem build

- **Módulos ES nativos** (`<script type="module">`), carregados sob demanda por tela (`import()`).
- **HTML por template com escape automático**: `html\`...\`` escapa todo valor interpolado, a menos que
  ele já seja um trecho montado por `html` ou `cru` (SVG que o próprio app escreveu). Nenhuma descrição
  que veio do banco vira markup. Referência: `publico/js/html.mjs` (~60 linhas).
- **Roteador simples** (`publico/js/app.mjs`): um mapa de rotas (`navegacao.mjs`) que a lateral, as abas,
  o "Mais" e a paleta de comandos leem. Cada tela recebe um `<main>` novo (`trocarRaiz`): ouvintes
  pendurados nele morrem com a tela; os de `document`/`window` saem na função de desmontar que a tela
  devolve.
- Separar o **puro** do que mexe na tela: `extratoPuro.mjs` (dados → o que mostrar, testável com
  `node:test`) e `extratoMarkup.mjs` (o HTML). A maior parte dos testes do front é do puro.

## CSP sem `unsafe-inline`

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self';
connect-src 'self'; manifest-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self';
form-action 'self'; object-src 'none'
```

- Nada de `<script>` embutido nem `style=""` no HTML. Largura, posição e cor dinâmicas vão em
  `data-largura`/`data-esquerda`/`data-cor` e o JS aplica pelo CSSOM (`pintar()`/`aplicarEstilos()`).
- Fontes, ícones e imagens são do app (imagem de fora vira `data:` no servidor).
- O único script clássico é o que põe o tema (`data-tema`) antes de pintar, num arquivo, não embutido.
- Página que precisa de script de terceiro (o widget da Pluggy) fica **fora do app**, numa página à
  parte com CSP própria, versão fixa e SRI.

## PWA

- `manifest.webmanifest` com `id` estável (trocar o `id` é instalar outro app).
- **Service worker cache-first** pro casco e os estáticos; `/api` e `/auth` nunca vão pro cache. O
  servidor preenche a `VERSAO` (hash dos arquivos) e o `CASCO` (a lista) ao servir o `sw.js`: publicar
  troca o cache inteiro, sem número nem lista pra manter à mão. Com versão nova no ar, a próxima troca de
  tela recarrega.
- **Leitura sem rede** (opcional, o Finanças tem): a cópia dos dados no IndexedDB e o mesmo `rotas.mjs`
  respondendo no navegador. Escrever sempre exige o servidor.
- `api.mjs` é o único lugar que chama a API: timeout (15 s leitura, 30 s escrita), cabeçalhos do app e da
  versão, relato de erro e de lentidão (`POST /api/erros-do-app`, `/api/lentidao`), e o 401 leva ao login
  e apaga o que é da pessoa no aparelho.
- **iPhone**: cada app instalado na tela de início tem o próprio armazenamento, e a página que abre de um
  link externo vai pro Safari, sem a sessão do app. Toda página que pode abrir assim (volta de
  autorização, link de e-mail) funciona sem sessão ou diz como voltar.
- Push: Web Push com VAPID, sem serviço de terceiro; o texto cabe na tela bloqueada (até ~45 caracteres
  por linha, 4 linhas). Ver [marca/guia.md](../marca/guia.md) pra voz.

## Celular primeiro

- Desenhado pra 360–430 px; o computador ganha lateral e colunas, não outro app. Corte em 1024 px pra
  lateral; tabela larga a partir de 700 px.
- Alvo de toque ≥ 48 px; campo de texto com **16 px** (abaixo disso o Safari dá zoom).
- **Folhas** sobem de baixo no celular; a cheia começa abaixo da área segura (`env(safe-area-inset-top)`,
  `100dvh`), e arrastar pra baixo fecha qualquer uma — sem isso o "✕" fica embaixo do relógio do iPhone.
- No celular (`hover: none`), topo e abas fixos opacos, sem `backdrop-filter`: o desfoque se refaz a cada
  quadro da rolagem.
- O primeiro pintar não espera a rede: o que dá pra mostrar do aparelho aparece, e a API completa.

## Acessibilidade

- Cor nunca sozinha: status com ícone e rótulo; cor de domínio sempre com nome e ícone (ameixa e cobalto se
  parecem pra quem tem daltonismo vermelho-verde). As cores dos gráficos foram validadas pra daltonismo em
  cada tema — trocar só revalidando.
- `prefers-reduced-motion`: tudo vira fade curto (os tokens já fazem).
- Foco visível em tudo (contorno na cor de domínio), `aria-*` nos controles que mudam de estado, e o
  `<h1>` recebe o foco quando a tela troca.

## CSS

- Tokens em `tokens.css` (copiado de `marca/`); nenhum outro arquivo escreve hexadecimal (o Finanças tem um
  teste que confere).
- Um arquivo por área (`extrato.css`, `contas.css`…), carregado com a tela.
- Reset com `:where()` (especificidade zero): ganha do que vem de fora e perde pra qualquer classe do app.
  No site, o reset `.v2 a` com especificidade de classe sumia com o texto dos botões.
