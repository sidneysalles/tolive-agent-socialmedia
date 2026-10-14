# Aprendizados

O que já custou caro em um app e vale pros outros. Cada um com o que aconteceu, a regra que ficou e
onde. Entra aqui o que vale pra mais de um app; o resto fica no `CLAUDE.md` do app.

## Banco

- **Coluna nova em tabela carregada com lista fixa de colunas some.** Ela chega nula na memória e a
  próxima gravação da linha inteira a apaga. O "travado" do patrimônio voltava pra livre a cada
  sincronização. Regra: um teste confere a lista contra o esquema. (Finanças, out/2026)
- **Sem `order=` completo, a ordem muda sozinha.** O filtro por família trocou o plano do Postgres e
  categorias e linhas do orçamento mudaram de lugar. Regra: toda lista pede ordem com desempate. (Finanças, out/2026)
- **`insert … on conflict` confere NOT NULL antes do conflito**: atualizar só uma coluna por upsert falha.
  Regra: uma ação `atualizar` que manda só as colunas. (Finanças)
- **Lote grande demais estoura a requisição.** A virada de fonte num lote só passava de 9 MB. Regra: o que
  é volume (origens novas) vai antes, em lotes de 500. (Finanças, set/2026)
- **Função `security definer` de um papel de app não chama `auth.jwt()`.** O papel dono do schema (ex.:
  `conta_dono`) não tem o schema `auth` no Supabase. Regra: o e-mail vem de
  `current_setting('request.jwt.claims', true)` (a conta tem `conta.eu()`). (Conta, out/2026)
- **No Supabase, quem cria um papel fica só com o ADMIN dele** (`createrole_self_grant` vazio): o `postgres` não
  consegue `create schema … authorization <papel>` nem agir como ele. Regra: `grant <papel> to postgres` no
  `preparar-banco.sql`, antes do schema. (Conta, out/2026)
- **Teste de migração com o `postgres` superusuário esconde erro de permissão.** No Supabase ele é um papel comum
  (com `bypassrls`). Regra: o Postgres descartável sobe com o superusuário `supabase_admin`
  (`subirPostgres({ superusuario: 'supabase_admin' })`) e as migrações rodam como `postgres`. (Conta, out/2026)
- **Comparar dois bancos por hash muda com o idioma e o fuso.** A mesma tabela dava hash diferente em produção e
  no ensaio. Regra: `order by x::text collate "C"` e `timezone = 'UTC'` nas duas sessões. (Finanças, out/2026)

## Dados de fora

- **A fonte erra e some com coisa.** O Meu Pluggy deixou de mandar débitos que aconteceram, e a
  sincronização os apagava, tirando dinheiro dos totais. Regra: o que sumiu da fonte fica vivo, marcado, e
  a pessoa decide; só sai sozinho o que se sabe que não é sumiço. (Finanças, out/2026)
- **O que a fonte manda em estágios diferentes duplica.** A compra pendente e a efetivada chegam com ids
  diferentes. Regra: casar as gêmeas por regra explícita e testada, nunca por "parece". (Finanças, out/2026)
- **Data da fonte não é a data do fato.** O banco data pelo lote (~02h do dia seguinte); a parcela futura
  vem dois meses adiante. Regra: guardar a da fonte, corrigir na leitura e mostrar "baseado em…". (Finanças, out/2026)

## Front

- **Reset de CSS com especificidade de classe ganha das classes do componente.** No site, `.v2 a` sumia
  com o texto dos botões. Regra: reset dentro de `:where()`. (Site, out/2026)
- **Rota dinâmica ganha de curinga.** No site, `/:lang/sobre` ganhava de `/v2/*` e abria a página antiga.
  Regra: rota estática explícita, e um teste com o `matchRoutes`. (Site, out/2026)
- **`backdrop-filter` em barra fixa trava a rolagem no celular.** Regra: opaco no `hover: none`. (Finanças, out/2026)
- **O "✕" da folha cheia ficou embaixo do relógio do iPhone** e não havia como sair. Regra: área segura e
  arrastar pra baixo fecha. (Finanças, out/2026)
- **O service worker antigo serve a versão velha pra sempre.** Trocar o site de stack não tira o `/sw.js` registrado no
  aparelho de quem visitou. Regra: no lugar dele, publicar um `/sw.js` que apaga os caches, sai do registro e recarrega
  as abas, e mantê-lo no ar. (Site, out/2026; o Finanças fez o mesmo com o de `/v2/`)
- **Campo com menos de 16 px dá zoom no Safari.** Regra: `--t-campo: 16px`. (Finanças)
- **Gráfico só animava na primeira visita**: no PWA instalado a "sessão" dura dias. Regra: animar a cada
  entrada na tela, não por sessão. (Finanças, out/2026)

## Produto e texto

- **Estimativa que não existe na vida real descredibiliza o app.** "Esse mês espero R$ 467" de diarista que cobra 200. Regra: o que vem em unidades se estima em unidades. (Finanças, out/2026)
- **Aviso demais vira ruído.** O orçamento gerava 83 avisos com 64% falsos. Regra: medir o aviso contra o histórico real (backtest) antes de ligar; avisar uma vez, só o provável. (Finanças, out/2026)
- **"Quanto sobra" foi lido como "quanto vou ter".** Regra: o número diz de onde parte, e o testador lê antes do lançamento. (Finanças, out/2026)
- **A pessoa adia tudo num toque se deixar.** Uma família deixou 204 dúvidas pra depois. Regra: as que mais pesam pedem resposta antes do "depois". (Finanças, out/2026)

## Operação

- **Publicar não pode ser cerimônia.** O site antigo levava ~20 min (imagem Docker sem cache); quem publica pouco erra mais. Regra: rsync + restart, testes antes. (Site, out/2026)
- **Mudar horário de timer com `Persistent=true` dispara na hora.** (Finanças, out/2026)
- **Log que apaga cedo não serve pra lei nem pra investigar.** O journald guardava pouco e 11 dias se perderam. Regra: 6 meses (Marco Civil art. 15), arquivo por semana. (Servidor, out/2026)
- **O servidor web não deve ter a chave que passa por cima da RLS.** Regra: o que precisa dela vai pro batch, por arquivo + `.path`. (Finanças)

## Trabalhando com o Claude

- O GitHub do `tolive-financas` recusa push com o e-mail pessoal no commit (privacidade de e-mail): o commit vai com
  o `noreply` do GitHub de quem é dono (`<id>+<login>@users.noreply.github.com`).

- O Claude não lembra de uma sessão pra outra: **o que não está escrito no repositório não existe**. A decisão vai pro `CLAUDE.md` (ou pra cá) no mesmo PR.
- A cópia de um arquivo entre repositórios sem dono diverge em dias (os tokens do site e do Finanças já diferiam no `--trilho`). Por isso existe o `sincronizar.mjs --conferir`.
