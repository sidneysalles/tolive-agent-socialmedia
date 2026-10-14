# Login

Uma conta toLive para todos os apps: todos fazem login no **mesmo projeto Supabase** (us-east-2), então a pessoa tem o mesmo `auth.users.id` em todos. A implementação de referência é [`modelo/backend/web/autenticacao.mjs`](../modelo/backend/web/autenticacao.mjs) (~200 linhas, sem dependências, com testes), que todo app novo recebe pronta.

## O fluxo

1. A pessoa toca "Entrar com Google". O **servidor** gera o verificador PKCE, guarda num cookie curto (`HttpOnly`, cifrado, 10 min) e redireciona pro `/auth/v1/authorize` do Supabase com o desafio.
2. O Google devolve pro Supabase, que devolve pro app em `/auth/retorno?code=...`.
3. O **servidor** troca o código pelos tokens (`/auth/v1/token?grant_type=pkce`) e guarda access e refresh token num cookie de sessão `HttpOnly`, `Secure`, `SameSite=Lax`, **cifrado com AES-256-GCM** (a chave em `credentials/sessao.chave`, gerada na primeira execução, ou `SESSAO_SEGREDO`).
4. Em cada requisição o servidor decifra o cookie, confere a assinatura do JWT pelas chaves públicas do Supabase (JWKS, em cache), a validade e o e-mail, e renova com o refresh token pouco antes de vencer. Sessão de 30 dias, renovada a cada uso.
5. O servidor chama o banco **com o token da pessoa**: a RLS decide o que ela vê.

**O token nunca chega ao JavaScript da página.** Por isso não se usa `supabase-js` no navegador: ele
guarda o token em `localStorage`, onde qualquer script da página o lê.

## Quem pode entrar

- O Supabase cria a conta no primeiro login. Quem decide se pode nascer é o hook `antes_de_criar_usuario` (Authentication › Hooks): hoje, só quem tem convite em aberto. Com o cadastro aberto (parâmetro do administrador, ver o plano da conta), qualquer e-mail.
- Depois de logada, a pessoa só usa o app se tiver acesso a ele (`conta.acesso('<app>')`, ver [banco.md](banco.md)). Sem acesso, a tela diz isso e oferece o caminho (convite ou plano), não um erro.
- A sessão guarda em cache, por e-mail, o que vem do banco sobre a pessoa (grupo, papel, se é administradora) por 10 minutos; trocar de grupo ou ser removida limpa o cache na hora.

## Cada app tem a sua sessão

O cookie é de cada domínio (`finance.tolive.app`, `fe.tolive.app`…). Na primeira vez em cada app a pessoa toca "Entrar com Google" de novo, e o Google não pede senha. Login sem toque entre apps (cookie no `.tolive.app` inteiro, ou a conta como servidor de login) fica pra quando houver motivo: ele obriga todos
os apps a dividir a chave do cookie.

## No Supabase, por app novo

- Authentication › URL Configuration: acrescentar `https://<app>.tolive.app/auth/retorno` nas URLs de retorno. Esquecer derruba o login daquele domínio.
- O provedor Google já está configurado no projeto; não se cria outro cliente OAuth.

## Modo local

`npm run local` entra sem Google: um cookie local (`fp_local`) com o e-mail escolhido, só quando o servidor sobe em modo local. Nunca em produção.
