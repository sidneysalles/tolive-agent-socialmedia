# Deploy e operação

Um servidor só (AWS Lightsail, Bitnami Debian 12, us-east-1), um processo Node por app, nginx na frente.
Sem Docker. Referência: [`modelo/deploy/`](../modelo/deploy/) e [`modelo/.github/workflows/`](../modelo/.github/workflows/),
que o `novo-app.mjs` preenche com o nome, a porta e o domínio do app.

## O caminho do código

```
branch → PR → testes.yml (node --test, migrações num Postgres descartável)
       → merge em main → deploy.yml: testa de novo, rsync pro servidor,
         deploy/atualizar.sh lá: migrações pendentes, provisionar.sh (idempotente), restart,
         confere que o app respondeu
```

- O GitHub não tem segredo do app: só a chave SSH de deploy (`LIGHTSAIL_SSH_KEY`, só pra isso), o host e
  o `known_hosts` (`ssh-keyscan`, pra não aceitar servidor falso), no ambiente `producao`. Sem eles o deploy
  avisa e termina.
- As migrações rodam **no servidor**, com o `.env` de lá: a senha do banco nunca passa pelo GitHub.
- Um deploy por vez (`concurrency`, sem cancelar o que está no meio).
- `deploy/fora-do-servidor.txt` lista o que o rsync não leva (testes, dados simulados, ferramentas locais).
- Plano B sem GitHub: `npm run publicar` faz o mesmo da máquina de quem tem a chave.

## No servidor

| Peça | Como |
|---|---|
| App | `/opt/<app>`, dono `bitnami`, o Node da Bitnami (`/opt/bitnami/node/bin/node`; o do sistema é 18). |
| Processo | `<app>.service` (systemd), só em `127.0.0.1:<porta>`, `Restart=on-failure`, `NoNewPrivileges`, `ProtectSystem=strict`, `ProtectHome`, `PrivateTmp`, `ReadWritePaths` só do que grava. |
| HTTPS | nginx do servidor, um `conf.d/<app>-https.conf` por domínio, certificado do certbot (webroot, renovação dele). O `provisionar.sh` só acrescenta arquivos, nunca edita os de outros apps. |
| Tarefas | `.timer` do systemd com hora de Brasília (`OnCalendar=*-*-* 08:30 America/Sao_Paulo`, `Persistent=true`). |
| Disparo de fora | O servidor web escreve um arquivo em `StateDirectory` e uma unidade `.path` roda o batch: o servidor web nunca tem a chave do banco. |
| Segredos | `/opt/<app>/credentials/.env` (600), levado à mão (`scp`) quando muda; `restart` depois. |
| Logs | journald, JSON por linha, 6 meses de retenção (Marco Civil). `journalctl -u <app>`. |
| Backup | `<app>-backup.timer`, `pg_dump` em `/var/backups/<app>`, 30 dias. |

Portas abertas: 22 (só chave), 80, 443. Portas dos apps: uma por app, anotadas no `CLAUDE.md` do app
(Finanças: 4173).

## Cuidados que já custaram

- Mudar o horário de um timer com `Persistent=true` faz o `daemon-reload` ver o horário novo de hoje como
  perdido e disparar na hora (o batch rodou às 21h do dia do deploy).
- O nginx do Debian 12 é 1.22: `listen 443 ssl http2`, não `http2 on`.
- O log do nginx de um app mal configurado cai no `access.log` compartilhado, sem o host: cada app tem os
  próprios `access_log` e `error_log`.
- `logrotate.d/nginx` é arquivo do pacote: numa atualização, manter a versão local (retenção de 183 dias).

## Medir

- Toda chamada à `/api` soma tempo e status por rota (p50, p95) e grava no journald a cada 10 min.
- O aparelho relata erro de JavaScript e chamada lenta (≥ 1,5 s).
- Uma ferramenta por pergunta, lendo o journald pelo SSH (`ferramentas/uso.mjs`, `jornada.mjs`): só no
  terminal de quem tem a chave, porque tem e-mails.
