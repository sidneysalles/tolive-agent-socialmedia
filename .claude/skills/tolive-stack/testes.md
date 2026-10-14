# Testes

`node --test`, sem biblioteca. `npm test` roda tudo; o `testes.yml` roda em todo PR.

## O que se testa

| O quê | Como | Onde ver |
|---|---|---|
| Regra de negócio | Função pura, dados na mão, o resultado conferido. A maioria dos testes. | `modelo/test/dominio.test.mjs` |
| API | `criarApi().atender(...)` sobre o banco em memória, sem HTTP. | `modelo/test/rotas.test.mjs` |
| Servidor | O `node:http` de verdade numa porta livre, com a sessão simulada: CSP, 401, CSRF, service worker, arquivo de fora. | `modelo/test/servidor.test.mjs` |
| Login | O cookie cifrado, o JWT por chave pública gerada no teste, entrar com e sem acesso. | `modelo/test/autenticacao.test.mjs` |
| Isolamento | Dois grupos no mesmo banco; **toda rota GET** (a lista vem do próprio `criarApi().rotas`, rota nova entra sozinha) como membro de um: a resposta tem de ser igual à de um banco sem o outro e não trazer nada dele. | Finanças: `test/isolamento.test.mjs` |
| Migrações e RLS | Postgres descartável (`PG_BIN`), todas as migrações, tokens de dois grupos tentando ler, alterar, apagar e criar no outro. Sem `PG_BIN`, é pulado. | Finanças: `test/migracoes.test.mjs` e `ferramentas/postgres-descartavel.mjs` |
| Front puro | Os módulos `*Puro.mjs` com `node:test` (não precisam de navegador). | Finanças: `test/v2*.test.mjs` |
| Contratos | O que não pode mudar sem querer: a lista de colunas carregadas contra o esquema, a promessa de privacidade da IA. A marca, o `conferir-marca.mjs` confere. | Finanças: `test/banco.test.mjs` |

Os que estão só no Finanças entram no modelo quando um segundo app precisar (o de isolamento e o das
migrações são os próximos: todo app com dado de grupo precisa deles).

## Regras

- **Testes nunca tocam dado real.** O repositório em memória (`criarBancoMemoria` em
  `modelo/backend/dados/repositorio.mjs`) implementa o mesmo contrato do de verdade, com o papel da RLS (cada
  um vê o seu); no Finanças, `bancoMemoria.mjs` faz o mesmo com a RLS por família e o lote atômico.
- Dados simulados versionados, gerados de forma determinística, de gente fictícia. Os mesmos alimentam o
  `npm run local`.
- Bug em produção vira teste antes do conserto: o teste falha, o conserto o faz passar.
- O relógio é injetado (`relogio = () => Date.now()`): teste de data não depende do dia em que roda.
- Integração contra o Supabase só num projeto separado, nunca no de produção.
