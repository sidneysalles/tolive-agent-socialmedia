// A maior parte da tecnologia pede mais atenção · suite · reels · 116 BPM (batida = 0,517 s, compasso = 2,069 s)
// O modelo do estúdio, no registro do filme (o "Propósito", videos/2026-10-14-financas-proposito, aprovado como
// direção em 14/10/2026): palavras batendo na intro → o sol nascendo com a promessa → as features na virada da
// música, uma por compasso → o fim com o sol no logo. Já renderiza; troque o texto, as telas e o tempo.
// Pintar é função pura de t: nada de estado entre quadros, Math.random, timer ou transição de CSS.

const BPM = 116;
const B = n => (n * 60) / BPM;
const C = n => B(n * 4);

// o peso: uma palavra (ou duas linhas) por batida; a frase da batida 6 fecha com o ponto
const PALAVRAS = [["Mais um","alerta"],["Mais um","motivo"],["pra voltar"]];
const FRASE = ["Quase nenhum","pra você","viver","melhor"];
// a prova: uma feature por compasso (títulos e linhas de conhecimento/produtos.json: curto, linha, captura)
const FEATURES = [
  {
    "titulo": [
      "Responde numa",
      "frase"
    ],
    "prova": "Abriu, leu uma frase, fechou.",
    "img": "app-inicio"
  },
  {
    "titulo": [
      "Traz a decisão",
      "pronta"
    ],
    "prova": "Surge quando vale o seu tempo. Depois, some.",
    "img": "toly-balao"
  }
];
const PROMESSA = ['Tecnologia', 'feita para não', 'ser usada'];

const T = { sol: C(2), solNasce: C(2) + B(1), promessa: C(2) + B(4), virada: C(4) };
const inicioFeature = i => T.virada + C(i);
T.folha = inicioFeature(FEATURES.length);
T.logo = T.folha + B(1); T.solFim = T.folha + B(1.5); T.cta = T.folha + B(4);
const DURACAO = +(T.folha + C(2) - B(1)).toFixed(2);

export default {
  id: '2026-10-15-suite-manifesto',
  titulo: 'A maior parte da tecnologia pede mais atenção',
  produto: 'suite',
  duracao: DURACAO,
  bpm: BPM,
  // a fala pra gravar (etapa B): a voz diz o que a tela escreve, na hora em que escreve. Janelas na grade de 116 BPM,
  // na fala calma; o filme acelera 4/3 depois (estudio/acelerar.mjs, como o Propósito): ~44 s viram ~33 s.
  // Entre a rima e o teste, dois segundos sem voz: o mote só escrito (decisão 9).
  narracao: [
    { id: 'gancho', de: 0, ate: B(7), texto: 'Quase toda tecnologia foi feita pra te prender.', nota: 'Calma, por cima do caos: a voz é o contraste. Sem indignação.' },
    { id: 'problema', de: B(7), ate: B(14), texto: 'Mais um alerta. Mais um motivo pra voltar.', nota: 'Duas frases, ponto final de verdade em cada uma.' },
    { id: 'fundo', de: B(14), ate: B(24), texto: 'Todo dia surge um app novo. Quase nenhum pra você viver melhor.', nota: 'No silêncio (o caos acabou de sumir). Mais baixa, mais perto, uma pausa no ponto.' },
    { id: 'virada', de: B(24), ate: B(34), texto: 'A toLive nasceu pro contrário: pra você viver fora da tela.', nota: 'Com o sol nascendo. A primeira frase que sobe: decidida, sem anúncio.' },
    { id: 'pilares', de: B(34), ate: B(46), texto: 'Dinheiro, casa, saúde, fé: a gente cuida da rotina. Você fica com a vida.', nota: 'As quatro palavras uma por batida (a tela escreve cada uma na hora); "Você fica com a vida" sorrindo.' },
    { id: 'dinheiro', de: B(46), ate: B(54), texto: 'Começamos pelo dinheiro. Você abre, lê uma frase e fecha.', nota: 'Simples, quase rindo da simplicidade.' },
    { id: 'toly', de: B(54), ate: B(62), texto: 'E ele só te chama quando a decisão é sua.', nota: '"Ele" é o app. Ênfase leve em "sua".' },
    { id: 'rima', de: B(62), ate: B(70), texto: 'Sem sequência. Sem medalha. Tecnologia pra você viver melhor.', nota: 'As duas primeiras curtas, secas (a tela risca cada uma); a última aberta, é a frase do filme.' },
    { id: 'teste', de: B(74), ate: B(82), catalogo: true, texto: 'Comece em tolive.app.', nota: 'A parte dos dias grátis vem do catálogo: se mudar na conta, só esta se regrava.' },
  ],
  // o que a música precisa ter: calma (ou tensa) por baixo do caos, a virada no sol, cheia até o logo
  musica: { antes: 5, depois: 8, compassos: 17 },
  poster: inicioFeature(0) + 1.2,
  assets: {
    ...Object.fromEntries(FEATURES.map(f => [f.img, `assets/capturas/${f.img}.png`])),
    logo: 'marca/logo/logo-escuro.svg#sem-sol',
  },
  som: {
    estilo: 'inspiradora',
    progressao: ['vi', 'IV', 'I', 'V'],
    secoes: [{ ate: 2, tipo: 'intro' }, { ate: 4, tipo: 'sobe' }, { ate: 4 + FEATURES.length, tipo: 'cheio' }, { ate: 99, tipo: 'fim' }],
    sons: [
      ...PALAVRAS.map((_, i) => ({ t: B(i), tipo: 'bate' })),
      ...FEATURES.slice(1).map((_, i) => ({ t: inicioFeature(i + 1) - 0.05, tipo: 'passa' })),
      { t: T.folha - 0.05, tipo: 'passa' },
    ],
  },

  fundo(g, t, { L, d, COR }) { d.fundo(g, L, COR.papel); },

  cenas: [
    { // o peso: cada palavra bate na sua batida (0,08 s antes, pra estar chegando no tempo forte), papel e noite alternando
      de: 0, ate: C(2), desenhar(g, t, ctx) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, ADIANTA = 0.08;
        const i = Math.min(Math.floor((ctx.corte(t) + ADIANTA) / B(1)), 7); // corte seco: decide pelo começo do quadro
        if (i < PALAVRAS.length) {
          const noite = i % 2 === 1, linhas = PALAVRAS[i];
          d.fundo(g, L, noite ? COR.noite : COR.papel);
          const desloc = linhas.map((_, k) => m.revela(t, (i === 0 ? -0.28 : B(i) - ADIANTA) + k * 0.05));
          d.textoRevelado(g, linhas, S.x, S.cy + 100 * u - (linhas.length - 1) * 130 * u, desloc, { tam: 300 * u, cor: noite ? COR.noiteTinta : COR.tinta, maxW: S.w });
        } else {
          const desloc = FRASE.map((_, k) => m.revela(t, B(PALAVRAS.length) - ADIANTA + k * 0.06));
          d.textoRevelado(g, FRASE, S.x, S.cy - 250 * u, desloc, { tam: 200 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(t, B(PALAVRAS.length) + 0.4, m.DUR.padrao, m.CURVA.forte) });
        }
      },
    },
    { // a virada de chave: o horizonte corre, o sol nasce atrás dele (a assinatura), a promessa
      de: T.sol, ate: T.virada, desenhar(g, t, { L, d, m, COR }, tg) {
        const u = L.u, S = L.seguro;
        d.fundo(g, L, COR.noite);
        const tam = 340 * u, y = S.y + 120 * u;
        d.simbolo(g, S.cx - (tam * 100 / 92) / 2, y, tam, {
          horizonte: m.anima(tg, T.sol - 0.08, 0.55, m.CURVA.forte), sol: m.anima(tg, T.solNasce, m.FILME.sol, m.CURVA.forte),
          corHorizonte: COR.noiteTinta, corSol: COR.noiteSinal,
        });
        const desloc = PROMESSA.map((_, k) => m.revela(tg, T.promessa + k * 0.09));
        d.textoRevelado(g, PROMESSA, S.cx, y + tam + 230 * u, desloc, { tam: 130 * u, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
      },
    },
    { // a prova: uma feature por compasso; a primeira corta seco na virada, as outras empurram a anterior
      de: T.virada, ate: T.folha + 0.6, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        FEATURES.forEach((f, i) => {
          const ini = inicioFeature(i), prox = inicioFeature(i + 1);
          if (tg < ini - m.FILME.empurra || tg > prox + m.FILME.empurra) return;
          const entra = i === 0 ? 0 : (1 - m.anima(tg, ini - m.FILME.empurra * 0.5, m.FILME.empurra, m.CURVA.empurra)) * L.W;
          const sai = -m.anima(tg, prox - m.FILME.empurra * 0.5, m.FILME.empurra, m.CURVA.empurra) * L.W;
          g.save(); g.translate(entra + sai, 0);
          d.fundo(g, L, COR.papel);
          const tl = tg - ini;
          const desloc = f.titulo.map((_, k) => m.revela(tl, -0.12 + k * 0.06));
          const tit = d.textoRevelado(g, f.titulo, S.x, S.y + 200 * u, desloc, { tam: 210 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tl, 0.3, m.DUR.padrao, m.CURVA.forte) });
          const yProva = S.y + 200 * u + tit.h - tit.tam * 0.92 + 96 * u;
          const ep = m.anima(tl, 0.18, m.DUR.entrada, m.CURVA.forte);
          const prova = d.paragrafo(g, f.prova, S.x, yProva + (1 - ep) * 24 * u, { tam: 46 * u, peso: 500, cor: COR.tinta2, alfa: ep, maxW: S.w, entrelinha: 1.25 });
          const img = ctx.img[f.img], asp = img.naturalHeight / img.naturalWidth;
          const livreTopo = yProva + prova.h + 40 * u, livre = S.base - livreTopo;
          const w = Math.min(S.w + 60 * u, livre / asp), topo = livreTopo + Math.max(0, livre - w * asp) * 0.42;
          const pc = m.anima(tl, -0.08, m.FILME.camera, m.CURVA.forte);
          g.save();
          d.camera(g, { escala: 1.14 - 0.14 * pc, fx: S.cx, fy: topo, dy: (1 - pc) * 120 * u });
          d.imagem(g, img, S.cx - w / 2, topo, w, { alfa: i === 0 ? m.anima(tl, -0.1, 0.12) : 1 });
          g.restore();
          g.restore();
        });
      },
    },
    { // o fim: a folha da noite sobe, o sol nasce no logo, o convite (o teste grátis vem do catálogo). Termina parado.
      de: T.folha - 0.3, ate: DURACAO, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR, dominio, catalogo } = ctx, u = L.u, S = L.seguro;
        const p = m.anima(tg, T.folha - 0.25, m.FILME.empurra, m.CURVA.empurra);
        d.cartao(g, 0, L.H * (1 - p), L.W, L.H * p + 60 * u, { raio: 56 * u * (1 - p), cor: COR.noite });
        if (p < 1) return;
        const hLogo = 140 * u, yLogo = S.cy - 260 * u;
        const eLogo = m.anima(tg, T.logo, m.DUR.entrada, m.CURVA.forte);
        d.logoComSol(g, ctx.img.logo, S.cx, yLogo + (1 - eLogo) * 20 * u, hLogo, { alfa: eLogo, sol: m.anima(tg, T.solFim, m.FILME.sol, m.CURVA.forte), corSol: COR.noiteSinal, alinhar: 'center' });
        const eNome = m.anima(tg, T.solFim + 0.55, m.DUR.entrada, m.CURVA.forte);
        d.texto(g, 'toLive', S.cx, yLogo + hLogo + 100 * u + (1 - eNome) * 14 * u, { tam: 44 * u, peso: 700, letra: 0.12, caixaAlta: true, cor: dominio('financas').horizonte, alinhar: 'center', alfa: eNome });
        const eAss = m.anima(tg, T.solFim + 0.62, m.DUR.entrada, m.CURVA.forte);
        ['Tecnologia feita', 'para não ser usada'].forEach((l, i) => d.texto(g, l, S.cx, yLogo + hLogo + 210 * u + i * 52 * u + (1 - eAss) * 14 * u, { tam: 32 * u, peso: 500, letra: 0.3, caixaAlta: true, cor: COR.noiteTinta2, alinhar: 'center', alfa: eAss }));
        const eCta = m.anima(tg, T.cta, m.DUR.entrada, m.CURVA.forte), yCta = S.base - 150 * u;
        if (catalogo.teste) d.texto(g, catalogo.teste.charAt(0).toUpperCase() + catalogo.teste.slice(1), S.cx, yCta - 56 * u + (1 - eCta) * 16 * u, { tam: 38 * u, peso: 500, cor: COR.noiteTinta, alinhar: 'center', alfa: eCta });
        d.pilula(g, 'Comece em tolive.app', S.cx, yCta + (1 - eCta) * 16 * u, { tam: 42 * u, fundo: COR.papel, cor: COR.tinta, alinhar: 'center', alfa: eCta });
      },
    },
  ],
};
