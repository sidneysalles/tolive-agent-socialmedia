# Músicas licenciadas

Toda faixa nesta pasta tem a licença registrada aqui antes de entrar num vídeo. Sem licença, não entra. O
`test/conteudo.test.mjs` confere: vídeo com `som.musica` precisa da linha aqui e do crédito na `legenda.md`.

**Que licença serve** (CC 4.0: sincronizar música com imagem é obra derivada):
- **CC0** (domínio público): serve, sem crédito.
- **CC BY**: serve, com o crédito na legenda do post (o `credito` abaixo, como está).
- **CC BY-ND** (sem derivação): **não** serve pra vídeo. **CC BY-SA**: obrigaria o vídeo a sair na mesma licença; não.
  **CC BY-NC** (não comercial): anúncio é comercial; não.
- Faixa "grátis" de banco (Pixabay, YouTube Audio Library) tem licença própria: ler antes, e saber que algumas são
  reivindicadas no Content ID por terceiros (o vídeo pode ficar mudo ou com aviso no Instagram/YouTube).

**Onde achar** (o que esta sessão alcançou em out/2026): incompetech.com (Kevin MacLeod, CC BY 4.0, baixa direto em
`incompetech.com/music/royalty-free/mp3-royaltyfree/<Título>.mp3`) e a API do Openverse
(`api.openverse.org/v1/audio/?q=…&license=cc0,by`, que lista Jamendo, Freesound, Wikimedia). Pixabay, Freesound e
upload.wikimedia.org deram 403 daqui; da máquina do Sidney costumam abrir.

**Como escolher sem ouvir**: `node estudio/batidas.mjs <faixa> --trecho 5,6` mede o andamento, a energia de cada
compasso e onde cortar pra o filme ter N compassos calmos e a virada no seguinte. Ouvir antes de publicar é do Sidney.

| Arquivo | Faixa e autor | Onde | Licença | Crédito (vai na legenda) | Data |
| --- | --- | --- | --- | --- | --- |
| `kevin-macleod-our-story-begins.mp3` | "Our Story Begins", Kevin MacLeod | https://incompetech.com (baixada de incompetech.com/music/royalty-free/mp3-royaltyfree/Our%20Story%20Begins.mp3) | CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ | Música: "Our Story Begins", Kevin MacLeod (incompetech.com), licença CC BY 4.0 | 2026-10-14 |
| `kevin-macleod-inspired.mp3` | "Inspired", Kevin MacLeod | https://incompetech.com (baixada de https://incompetech.com/music/royalty-free/mp3-royaltyfree/Inspired.mp3) | CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ | Música: "Inspired", Kevin MacLeod (incompetech.com), licença CC BY 4.0 | 2026-10-14 |
| `kevin-macleod-light-thought-var-1.mp3` | "Light Thought var 1", Kevin MacLeod | https://incompetech.com (baixada de https://incompetech.com/music/royalty-free/mp3-royaltyfree/Light%20Thought%20var%201.mp3) | CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ | Música: "Light Thought var 1", Kevin MacLeod (incompetech.com), licença CC BY 4.0 | 2026-10-15 |
