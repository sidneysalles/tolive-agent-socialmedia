// As telas desmontadas (assets/capturas/camadas/<tela>/camadas.json, do capturar-app.mjs) no filme: os assets que o
// palco carrega e a ordem de chegada de cada peça. Puro (roda no navegador e no Node).

/** Os assets de uma tela desmontada, com o apelido como prefixo: { 'mes:fundo': …, 'mes:0': …, 'mes:1': … }. */
export function assetsDasCamadas(apelido, cam) {
  const base = `assets/capturas/camadas/${cam.tela}/`;
  return Object.fromEntries([[`${apelido}:fundo`, base + cam.fundo], ...cam.pecas.map(p => [`${apelido}:${p.i}`, base + p.arquivo])]);
}

/** Em que ordem as peças chegam: a faixa e o topo juntos, depois a ordem da leitura (de cima pra baixo). */
export function ordemDeChegada(cam) {
  const ordem = new Map();
  let n = 0;
  for (const p of [...cam.pecas].sort((a, b) => a.y - b.y || a.x - b.x)) ordem.set(p.i, p.tipo === 'topo' ? 0 : ++n);
  return ordem;
}
