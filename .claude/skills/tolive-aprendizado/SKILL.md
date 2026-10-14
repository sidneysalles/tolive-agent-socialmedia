---
name: tolive-aprendizado
description: Os aprendizados que já custaram caro nos apps da toLive e como registrar um novo. Use antes de mexer em banco, sincronização, datas, service worker, CSS de reset ou deploy (pra não repetir um erro conhecido), e ao terminar um trabalho num app da toLive, pra decidir se o que se aprendeu vale pros outros apps.
---

# Aprendizados da toLive

A lista está em [aprendizados.md](aprendizados.md) (copiada do tolive-base). Antes de mexer num desses
assuntos, procure nela: cada linha é um erro que já aconteceu, com a regra que ficou.

## Ao terminar um trabalho

Pergunte: **outro app da toLive teria esse mesmo problema?** (um bug de banco, de data, de iPhone, de
CSS, de deploy; uma regra de texto que pegou mal com quem testou.)

- **Não:** registre no `CLAUDE.md` deste app, como sempre.
- **Sim:** diga a quem pediu o trabalho, numa frase, e proponha a linha pro `aprendizados.md` do tolive-base, no formato de lá: **o que aconteceu**, **a regra que ficou** e **(app, mês/ano)**. Só abra o PR no tolive-base se a pessoa pedir. Se o aprendizado muda uma regra de `stack/` ou do guia de marca, o PR muda o arquivo da regra também.

Não registre opinião nem o que ainda não aconteceu: aprendizado é o que já custou algo.
