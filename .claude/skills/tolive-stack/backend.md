# Backend

A implementação de referência é o [`modelo/`](../modelo/) deste repositório, que o `novo-app.mjs` copia
pra um app novo: cada caminho citado aqui sem outro repositório é de lá. O que o modelo ainda não tem
(batch, webhook, leitura sem rede, IA) está descrito aqui e existe no Finanças; quando um segundo app
precisar, a peça entra no modelo.

## Linguagem e runtime

- **Node ≥ 22.15**, ESM (`.mjs`), sem dependências (`"type": "module"`, `engines.node` no `package.json`).
- O servidor é `node:http` puro. Roteamento, sessão, estáticos, gzip, cabeçalhos de segurança e limite
  de requisições num arquivo só (`backend/web/servidor.mjs`).
- `--env-file=credentials/.env` lê os segredos; nada de `dotenv`.

## Camadas

De dentro pra fora. Cada uma só conhece a de dentro:

    domínio puro  ←  armazenamento  ←  banco (supabase | memória)
                          ↑
                  rotina / batch  ←  servidor  ←  publico/

| Camada | O que faz | Não pode |
|---|---|---|
| Domínio (`backend/<assunto>/*.mjs`) | A regra de negócio: recebe dados, devolve dados. | Importar banco, HTTP ou `node:*`. |
| Repositório (`backend/dados/repositorio.mjs`) | O que as rotas pedem ao banco, numa lista curta de funções, em duas implementações: a do Supabase (com o token de quem pediu) e a em memória (testes e modo local). No Finanças, um armazenamento em memória com gravação em lote faz esse papel. | Conhecer HTTP ou ter regra de negócio. |
| Cliente do banco (`backend/dados/supabase.mjs`) | PostgREST e GoTrue por `fetch`, no schema do app. | Ter regra de negócio. |
| Rotas (`backend/web/rotas.mjs`) | Toda a API como função pura: `atender({ metodo, caminho, corpo, ctx })`. | Usar `node:*` (ver abaixo). |
| Servidor (`backend/web/servidor.mjs`) | HTTP: sessão, cabeçalhos, estáticos, CSRF, limite. | Ter regra de negócio. |
| Batch (`backend/<assunto>/batch.mjs`) | O que roda sem pessoa: timer do systemd, webhook. | Rodar dentro do servidor web. |

- **Pastas por assunto, não por tipo**: `backend/lancamentos/`, `backend/orcamento/`, `backend/alertas/`,
  com `core/` (datas, configuração, cifra), `dados/` e `web/` em volta. Não existe `controllers/` nem `services/`.
- **As rotas sem `node:*`** (só `crypto.randomUUID()` global) deixam o mesmo `rotas.mjs` responder no
  navegador sobre uma cópia local, quando não há rede. Mesmo que o app novo não precise de offline, manter
  o domínio e as rotas sem `node:*` custa pouco e deixa a porta aberta.

## API

- Tudo sob `/api`, JSON, sessão obrigatória. O que é público é explícito: hoje fica fora da `/api`
  (`/auth/convite`, `/webhook/pluggy`); o plano da conta propõe `/api/publico/...`.
- Rotas em português, por recurso: `GET /api/lancamentos`, `PUT /api/lancamentos/:id/classificacao`,
  `POST /api/sincronizacao`. Ação que não é CRUD vira um sub-recurso com verbo no nome (`/juntar`, `/desfazer`).
- Respostas: `200` com o objeto; `400` com `{ erro: "frase pra pessoa" }`; `401` sem sessão; `403` sem
  permissão; `409` conflito; `500` sem detalhe (o detalhe vai pro log).
- Escrita (POST/PUT/PATCH/DELETE) só da própria origem (CSRF: `Origin`/`Referer` conferidos; o cookie já é
  `SameSite=Lax`).
- Limite de requisições por sessão (o Finanças: 60 por minuto, janela deslizante).
- Toda resposta da `/api` leva `Server-Timing` com o tempo do app; chamada lenta vira log.

## O servidor nunca tem a chave do banco

O servidor web usa a chave pública do Supabase com o token da pessoa (a RLS manda). A chave secreta
(bypass de RLS) é só do batch e das ferramentas; o servidor a remove do próprio ambiente ao subir. O que o
servidor precisa disparar com poder total (um webhook de fora, "sincronizar todas as famílias") ele anota
num arquivo e uma unidade `.path` do systemd roda o batch (ver [deploy.md](deploy.md)). Webhook de
pagamento (Stripe) segue o mesmo desenho.

## Integrações de fora

- `fetch` puro, com timeout, novas tentativas só em 429/5xx (respeitando `retry-after`) e o erro com a
  mensagem da outra ponta.
- Credencial de terceiro que pertence a uma pessoa (a da Pluggy) mora no banco **cifrada**
  (AES-256-GCM, `backend/core/cofre.mjs`), com a chave só no `.env` e o contexto (tabela, dono, campo)
  como dado autenticado: o cifrado de uma linha não abre em outra.
- Webhook de fora confere um segredo assinado (HMAC) sem precisar de sessão nem banco.

## Logs

- Uma linha JSON por evento no stdout, que o systemd manda pro journald:
  `{ "em": "...", "evento": "fontes-lidas", "familia": "...", ... }`.
- O evento tem nome fixo e campos estáveis: é o que as ferramentas de leitura (`ferramentas/uso.mjs`,
  `jornada.mjs`) filtram. Sem e-mail, nome ou valor quando não precisa.
- Retenção: o journald do servidor guarda 6 meses (Marco Civil, art. 15).

## IA (Claude)

- `POST /v1/messages` por `fetch` (`backend/assistente/claude.mjs`), sem SDK: structured outputs com JSON
  Schema, `cache_control` no fim do prefixo que se repete, esforço explícito, custo somado e um teto por
  família.
- Nada que a IA propõe vale sem a pessoa aprovar; tudo que ela fez tem marca e "Desfazer tudo".
- Antes de mandar: pseudônimos para pessoas, sem documento nem número de conta. O mapa fica no servidor.
- Um ensaio com dados reais (só leitura) mede acerto, cobertura e custo antes de mudar o prompt.
