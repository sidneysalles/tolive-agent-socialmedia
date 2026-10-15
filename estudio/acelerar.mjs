// O filme inteiro mais rápido (Sidney, 15/10/2026: "dava pra acelerar a voz e as animações"), sem reescrever as cenas:
// as cenas continuam pensadas no tempo de antes e recebem t × k; os tempos de fora (duração, quadros, prévia, sons, a
// voz) são divididos por k, e a voz ganha o atempo (mais rápida, mesmo tom). A música não acelera: o filme escolhe um
// k que mantém os cortes na batida dela (com features de dois compassos, k = 4/3 põe cada corte em 1,5 compasso) e diz
// onde a música começa (`musicaInicio`) pra a virada continuar no lugar. Puro: roda no navegador e no Node.

export function acelerar(filme, k, { musicaInicio } = {}) {
  if (!k || k === 1) return filme;
  const div = t => +(t / k).toFixed(3);
  const cena = c => ({
    ...c, de: div(c.de), ate: div(c.ate),
    // a cena pensa no tempo de antes; o corte seco continua decidido pelo começo do quadro de verdade
    desenhar: (g, t, ctx, tg) => c.desenhar(g, t * k, { ...ctx, corte: tt => ctx.corte(tt / k) * k }, tg * k),
  });
  const som = filme.som && {
    ...filme.som,
    ...(musicaInicio !== undefined ? { inicio: musicaInicio } : {}),
    sons: (filme.som.sons ?? []).map(s => ({ ...s, t: div(s.t) })),
    ...(filme.som.narracao ? { narracao: { ...filme.som.narracao, tempo: k, falas: filme.som.narracao.falas.map(f => ({ ...f, em: div(f.em) })) } } : {}),
  };
  return {
    ...filme,
    velocidade: k,
    duracao: div(filme.duracao),
    poster: filme.poster !== undefined ? div(filme.poster) : undefined,
    quadros: filme.quadros?.map(q => ({ ...q, t: div(q.t) })),
    previa: filme.previa && { ...filme.previa, de: div(filme.previa.de), ate: div(filme.previa.ate) },
    narracao: filme.narracao?.map(n => ({ ...n, de: div(n.de), ate: div(n.ate) })),
    som,
    fundo: filme.fundo && ((g, t, ctx) => filme.fundo(g, t * k, ctx)),
    desenhar: filme.desenhar && ((g, t, ctx) => filme.desenhar(g, t * k, ctx)),
    cenas: filme.cenas?.map(cena),
  };
}
