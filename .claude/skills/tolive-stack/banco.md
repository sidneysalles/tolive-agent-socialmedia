# Banco

Um projeto **Supabase** (Postgres 15+, us-east-2) para todos os apps. Cada app conversa com ele pelo
PostgREST e pelo GoTrue com `fetch` puro ([`modelo/backend/dados/supabase.mjs`](../modelo/backend/dados/supabase.mjs),
já com o schema do app), sem `supabase-js`.

## Schemas: um por app

| Schema | De quem | O que mora |
|---|---|---|
| `conta` | tolive-conta | Grupos (casa, organização), participações, convites, perfis, assinaturas, parâmetros, administradores. |
| `financas` | Finanças | Tudo do Finanças. |
| `fe`, `saude`… | o app | Tudo do app. |
| `public` | ninguém | Vazio. |

- Cada app **só escreve no próprio schema**. Pra garantir no banco, não só na disciplina: cada app tem um
  papel de banco dono do schema dele (`fe_dono`), e o deploy dele roda as migrações com esse papel, não com
  a senha principal. Uma migração do Fé que toque em `financas` é recusada pelo Postgres.
- O que um app usa da conta é uma **lista curta de funções**, o contrato: `conta.acesso('<app>')` (o que a
  pessoa pode usar e com quais recursos), `conta.meus_grupos()`, o perfil. Mudar uma delas é combinar com
  todos os apps; o resto da conta muda livre.
- Sair do `public` custa: o schema tem de estar em **Project Settings › API › Exposed schemas**, precisa
  de `grant usage` e dos `grant` de cada tabela para `anon`, `authenticated` e `service_role`, e o cliente
  manda `Accept-Profile` (leitura) e `Content-Profile` (escrita e `rpc`) com o schema.

> Hoje (out/2026) o Finanças ainda está no `public`; a mudança é o plano da conta toLive
> (`tolive-financas/docs/plano-conta-tolive.md`).

## RLS em toda tabela com dado de alguém

- A política padrão: a linha é do grupo, e a pessoa só vê o grupo dela.
  `using (familia_id = minha_familia()) with check (familia_id = minha_familia())`, com `minha_familia()`
  `security definer` olhando a tabela de participação.
- Coluna do grupo `not null` **sem default**: linha sem grupo é erro, não "é de todo mundo".
- Chave que se repete entre grupos leva o grupo na primária (`configuracoes (familia_id, chave)`).
- **O código filtra também**: o repositório põe `familia_id=eq.<id>` em toda leitura e carimba a família
  em toda escrita. Se a RLS tiver um buraco, o código segura; se o código errar, a RLS segura.
- Tabela de participação sem política de escrita: entra-se só por função (`aceitar_convite`).
- Autoria pelo banco: um gatilho grava `alterado_por` com o e-mail do token. O cliente não assina pelo outro.
- O que é sensível e não precisa ir pra memória nem pro aparelho (credenciais cifradas) fica fora da carga
  e da cópia local, lido e gravado direto.

## Funções `security definer`

- `set search_path = ''` (ou fixo) e todo nome qualificado (`conta.grupos`), sempre.
- Conferem quem chama (`auth.jwt() ->> 'email'`) antes de qualquer coisa.
- `anon` só chama o que precisa sem login (ver um convite pelo token; saber se o cadastro está aberto).

## Gravação

- Escrita do app em **lote atômico**: uma função (`gravar_lote_familia`) aplica todas as operações numa
  transação e anda um número de revisão por grupo — a trava otimista entre o servidor e o batch (conflito →
  relê e refaz) e o sinal pra quem tem cópia em memória recarregar.
- `upsert` manda a linha inteira; `atualizar` só as colunas enviadas (o `insert … on conflict` confere
  NOT NULL antes do conflito).
- **Lista fixa de colunas em tabela carregada parcialmente** é armadilha: coluna nova que não entra na
  lista chega nula na memória e a próxima gravação da linha inteira a apaga no banco (o "travado" do
  patrimônio voltava pra livre a cada sincronização). Um teste confere a lista contra o esquema.
- Toda leitura que vira lista na tela pede **ordem completa** (`order=` com desempate). Sem ela o Postgres
  devolve na ordem que quiser, e ela muda quando o plano muda.

## Migrações

- Arquivos SQL em `supabase/migrations/AAAAMMDDHHMMSS_nome.sql`. **Nunca editar uma já aplicada**: o
  conserto é uma migração nova.
- Aplicadas no deploy, no servidor, com o `.env` de lá (a senha do banco nunca passa pelo GitHub).
- Cada app registra as suas numa tabela do próprio schema (`<app>.migracoes`), pra três repositórios não
  disputarem a `supabase_migrations.schema_migrations`. (Plano: hoje o Finanças ainda registra nesta última.)
- **Testadas de verdade no PR**: um Postgres descartável numa pasta temporária
  (`ferramentas/postgres-descartavel.mjs`, com os binários que o Ubuntu do runner já traz), os papéis e o
  `auth.jwt()` do Supabase simulados (`test/sql/supabase-simulado.sql`), todas as migrações aplicadas e a
  RLS conferida com tokens de dois grupos diferentes: ler, alterar, apagar e criar no outro.
- Migração grande (mover tabela, reescrever função usada por todos): backup antes, teste contra o dump de
  produção num Postgres descartável, deploy fora dos horários dos timers.

## Backup

`pg_dump` diário depois do batch, 30 dias no servidor; restauração de teste a cada trimestre num projeto
Supabase separado. Teste de integração contra o Supabase só nesse projeto separado, nunca no de produção.
