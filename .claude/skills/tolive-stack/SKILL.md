---
name: tolive-stack
description: Como a toLive constrói apps (Node sem dependências, SPA em JS puro, Supabase com um schema por app e RLS, login pelo Google no servidor, deploy por rsync no Lightsail, node:test). Use antes de criar ou mudar rota, tela, tabela, migração, login, deploy, teste ou estrutura de pastas num app da toLive, e antes de propor uma dependência nova.
---

# A stack da toLive

Os guias inteiros estão nesta pasta (copiados do tolive-base): [principios.md](principios.md),
[backend.md](backend.md), [frontend.md](frontend.md), [banco.md](banco.md), [login.md](login.md),
[deploy.md](deploy.md), [testes.md](testes.md). Abra o do assunto antes de decidir. O `CLAUDE.md` do app
vence quando diz uma exceção.

## O que não se negocia sem uma decisão escrita no CLAUDE.md do app

- **Zero dependências.** Node ≥ 22 e o navegador têm o que precisa (fetch, crypto, node:test, módulos ES, service worker). Sem framework, bundler, build, supabase-js nem SDK.
- **Português** em tudo; identificadores sem acento, texto com acento.
- **Domínio puro no centro** (sem banco, HTTP nem `node:*`), as rotas como função pura (`atender({ metodo, caminho, corpo, ctx })`), o servidor só roteia, autentica e serializa.
- **Dinheiro em centavos inteiros; datas no fuso America/Sao_Paulo**; o "hoje" vem do servidor.
- **Segurança:** CSP sem `unsafe-inline` (nada de `<script>` embutido nem `style=""`); todo texto interpolado escapado (`html\`\``); o token de login nunca chega ao JavaScript da página; o servidor web nunca tem a chave secreta do banco; segredo nunca no git nem no chat.
- **Banco:** cada app só escreve no próprio schema, com o papel dono dele; RLS em toda tabela com dado de alguém, e o código filtra também; nada se apaga fisicamente (`removido_em`); migração nunca é editada depois de aplicada; lista com `order` completo.
- **Teste** nunca toca dado real; bug em produção vira teste antes do conserto.
- **Fluxo:** branch → PR → testes → merge → deploy automático. O `CLAUDE.md` do app muda no mesmo PR que muda o comportamento.

## App novo

Não monte do zero: `node ferramentas/novo-app.mjs` no tolive-base gera o app com tudo isto pronto (login, CSP, rotas, SPA, service worker, testes, deploy, a marca e estas skills).
