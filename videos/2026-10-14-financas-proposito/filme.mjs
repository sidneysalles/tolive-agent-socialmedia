// toLive Finanças · "Propósito" · stories e feed · 24,5 s a 116 BPM (batida = 0,517 s, compasso = 2,069 s)
// O segundo vídeo, na pegada que o Sidney pediu depois do primeiro ("muito lento, fraco; inspirador, como a Apple"):
// propósito → o sol nascendo → as features na virada da música → o manifesto → o fim. O roteiro está em roteiro.md.
// Pintar é função pura de t.

const BPM = 116;
const B = n => (n * 60) / BPM;     // batida n
const C = n => B(n * 4);           // compasso n

// 0 – 4,1 s · o peso: uma palavra por batida, cortando seco, papel e noite alternando
const PALAVRAS = [['Boleto'], ['Fatura'], ['Extrato'], ['Planilha'], ['Lembrete'], ['Susto no', 'dia 30']];
// 8,3 – 18,6 s · as features, uma por compasso, a partir da virada
const FEATURES = [
  { titulo: ['Conecta'], prova: 'Seus bancos pelo Open Finance. Só para ler.', img: 'conectar' },
  { titulo: ['Organiza'], prova: 'A IA propõe as regras. Nada vale até você aprovar.', img: 'ia' },
  { titulo: ['Avisa antes'], prova: 'Quando a categoria vai passar do limite, não depois.', img: 'orcamento' },
  { titulo: ['Projeta', 'o ano'], prova: 'Doze meses à vista, numa frase.', img: 'projecao' },
  { titulo: ['Acha o que', 'vaza'], prova: 'Assinatura parada, com o motivo e a fonte.', img: 'vazamentos' },
];
const T = { sol: C(2), solNasce: C(2) + B(1), frase: C(2) + B(4), virada: C(4), manifesto: C(9), folha: C(10), logo: C(10) + B(1), solFim: C(10) + B(1.5), cta: C(10) + B(4) };
const inicioFeature = i => T.virada + C(i);

export default {
  id: '2026-10-14-financas-proposito',
  titulo: 'Tecnologia feita para não ser usada',
  produto: 'financas',
  duracao: 24.5,
  bpm: BPM,
  poster: inicioFeature(1) + 1.2,
  assets: {
    conectar: 'assets/capturas/como-1-conectar.png',
    ia: 'assets/capturas/como-2-ia.png',
    orcamento: 'assets/capturas/faz-orcamento.png',
    projecao: 'assets/capturas/faz-projecao.png',
    vazamentos: 'assets/capturas/faz-vazamentos.png',
    logo: 'marca/logo/logo-escuro.svg#sem-sol',
  },
  som: {
    estilo: 'inspiradora',
    progressao: ['vi', 'IV', 'I', 'V'],
    secoes: [{ ate: 2, tipo: 'intro' }, { ate: 4, tipo: 'sobe' }, { ate: 10, tipo: 'cheio' }, { ate: 99, tipo: 'fim' }],
    sons: [
      ...PALAVRAS.map((_, i) => ({ t: B(i), tipo: 'bate' })),
      ...FEATURES.slice(1).map((_, i) => ({ t: inicioFeature(i + 1) - 0.05, tipo: 'passa' })),
      { t: T.folha - 0.05, tipo: 'passa' },
    ],
  },

  fundo(g, t, { L, d, COR }) { d.fundo(g, L, COR.papel); },

  cenas: [
    { // o peso: cada palavra bate na sua batida e corta seco na próxima
      de: 0, ate: C(2), desenhar(g, t, ctx) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        // o corte e a subida começam um pouco antes da batida: no tempo forte, a palavra já está chegando
        const ADIANTA = 0.08;
        const i = Math.min(Math.floor((ctx.corte(t) + ADIANTA) / B(1)), 7); // corte seco: decide pelo começo do quadro
        if (i < PALAVRAS.length) {
          const noite = i % 2 === 1;
          d.fundo(g, L, noite ? COR.noite : COR.papel);
          const linhas = PALAVRAS[i];
          // a primeira já está no lugar no quadro 0 (é a miniatura em alguns feeds)
          const desloc = linhas.map((_, k) => (i === 0 ? m.revela(t, -0.28 + k * 0.05) : m.revela(t, B(i) - ADIANTA + k * 0.05)));
          d.textoRevelado(g, linhas, S.x, S.cy + 100 * u - (linhas.length - 1) * 130 * u, desloc, { tam: 300 * u, cor: noite ? COR.noiteTinta : COR.tinta, maxW: S.w });
        } else {
          // "Cada um pede um pedaço de você": a única frase com ponto (o único laranja do trecho)
          const linhas = ['Cada um', 'pede um', 'pedaço', 'de você'];
          const desloc = linhas.map((_, k) => m.revela(t, B(6) - ADIANTA + k * 0.06));
          d.textoRevelado(g, linhas, S.x, S.cy - 250 * u, desloc, { tam: 200 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(t, B(6) + 0.4, m.DUR.padrao, m.CURVA.forte) });
        }
      },
    },
    { // a virada de chave: na noite, o horizonte se desenha e o sol nasce atrás dele; a promessa
      de: T.sol, ate: T.virada, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        d.fundo(g, L, COR.noite);
        const tam = 340 * u, x = S.cx - (tam * 100 / 92) / 2, y = S.y + 120 * u;
        d.simbolo(g, x, y, tam, {
          horizonte: m.anima(tg, T.sol - 0.08, 0.55, m.CURVA.forte), // na batida, o traço já está correndo
          sol: m.anima(tg, T.solNasce, m.FILME.sol, m.CURVA.forte),
          corHorizonte: COR.noiteTinta, corSol: COR.noiteSinal,
        });
        const linhas = ['Tecnologia', 'feita para não', 'ser usada'];
        const desloc = linhas.map((_, k) => m.revela(tg, T.frase + k * 0.09));
        d.textoRevelado(g, linhas, S.cx, y + tam + 230 * u, desloc, { tam: 130 * u, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
      },
    },
    { // a virada da música: cinco features, um compasso cada; a primeira corta seco, as outras empurram a anterior
      de: T.virada, ate: T.manifesto + 0.6, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        FEATURES.forEach((f, i) => {
          const ini = inicioFeature(i), prox = inicioFeature(i + 1);
          if (tg < ini - m.FILME.empurra || tg > prox + m.FILME.empurra) return;
          const entra = i === 0 ? 0 : (1 - m.anima(tg, ini - m.FILME.empurra * 0.5, m.FILME.empurra, m.CURVA.empurra)) * L.W;
          const sai = i === FEATURES.length - 1 ? 0 : -m.anima(tg, prox - m.FILME.empurra * 0.5, m.FILME.empurra, m.CURVA.empurra) * L.W;
          g.save(); g.translate(entra + sai, 0);
          d.fundo(g, L, COR.papel);
          const tl = tg - ini; // negativo enquanto a cena ainda está entrando
          // o título bate de dentro da máscara, com o ponto da marca; no tempo forte ele já está chegando
          const desloc = f.titulo.map((_, k) => m.revela(tl, -0.12 + k * 0.06));
          const tit = d.textoRevelado(g, f.titulo, S.x, S.y + 200 * u, desloc, { tam: 210 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tl, 0.3, m.DUR.padrao, m.CURVA.forte) });
          const yProva = S.y + 200 * u + tit.h - tit.tam * 0.92 + 96 * u;
          const ep = m.anima(tl, 0.18, m.DUR.entrada, m.CURVA.forte);
          const prova = d.paragrafo(g, f.prova, S.x, yProva + (1 - ep) * 24 * u, { tam: 46 * u, peso: 500, cor: COR.tinta2, alfa: ep, maxW: S.w, entrelinha: 1.25 });
          // a tela de verdade, centrada no espaço que sobra, com a câmera empurrando e parando
          const img = ctx.img[f.img], asp = img.naturalHeight / img.naturalWidth;
          const livreTopo = yProva + prova.h + 40 * u, livre = S.base - livreTopo; // sem sangria: embaixo, a interface do Instagram cobre (stories) ou o quadro corta (feed)
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
    { // o manifesto: o melhor elogio
      de: T.manifesto, ate: T.folha + 0.6, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        const entra = (1 - m.anima(tg, T.manifesto - m.FILME.empurra * 0.5, m.FILME.empurra, m.CURVA.empurra)) * L.W;
        g.save(); g.translate(entra, 0);
        d.fundo(g, L, COR.papel);
        const e = m.anima(tg, T.manifesto + 0.1, m.DUR.entrada, m.CURVA.forte);
        d.texto(g, 'O melhor elogio que podemos receber', S.x, S.cy - 330 * u + (1 - e) * 20 * u, { tam: 44 * u, peso: 500, cor: COR.tinta2, alfa: e });
        const linhas = ['“Esqueci', 'que tinha', 'o app”'];
        const desloc = linhas.map((_, k) => m.revela(tg, T.manifesto + 0.3 + k * 0.08));
        d.textoRevelado(g, linhas, S.x, S.cy - 140 * u, desloc, { tam: 210 * u, maxW: S.w });
        g.restore();
      },
    },
    { // o fim: a folha da noite sobe, o sol nasce no logo de novo (a assinatura), o convite. Termina parado.
      de: T.folha - 0.3, ate: 24.5, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR, dominio, catalogo } = ctx, u = L.u, S = L.seguro;
        const p = m.anima(tg, T.folha - 0.25, m.FILME.empurra, m.CURVA.empurra);
        d.cartao(g, 0, L.H * (1 - p), L.W, L.H * p + 60 * u, { raio: 56 * u * (1 - p), cor: COR.noite });
        if (p < 1) return;
        const hLogo = 140 * u, yLogo = S.cy - 260 * u;
        const eLogo = m.anima(tg, T.logo, m.DUR.entrada, m.CURVA.forte);
        d.logoComSol(g, ctx.img.logo, S.cx, yLogo + (1 - eLogo) * 20 * u, hLogo, { alfa: eLogo, sol: m.anima(tg, T.solFim, m.FILME.sol, m.CURVA.forte), corSol: COR.noiteSinal, alinhar: 'center' });
        const eNome = m.anima(tg, T.solFim + 0.55, m.DUR.entrada, m.CURVA.forte);
        d.texto(g, 'Finanças', S.cx, yLogo + hLogo + 100 * u + (1 - eNome) * 14 * u, { tam: 44 * u, peso: 700, letra: 0.12, caixaAlta: true, cor: dominio('financas').horizonte, alinhar: 'center', alfa: eNome });
        const eAss = m.anima(tg, T.solFim + 0.62, m.DUR.entrada, m.CURVA.forte);
        ['Tecnologia feita', 'para não ser usada'].forEach((l, i) => d.texto(g, l, S.cx, yLogo + hLogo + 210 * u + i * 52 * u + (1 - eAss) * 14 * u, { tam: 32 * u, peso: 500, letra: 0.3, caixaAlta: true, cor: COR.noiteTinta2, alinhar: 'center', alfa: eAss }));
        const eCta = m.anima(tg, T.cta, m.DUR.entrada, m.CURVA.forte), yCta = S.base - 150 * u;
        if (catalogo.teste) d.texto(g, catalogo.teste.charAt(0).toUpperCase() + catalogo.teste.slice(1), S.cx, yCta - 56 * u + (1 - eCta) * 16 * u, { tam: 38 * u, peso: 500, cor: COR.noiteTinta, alinhar: 'center', alfa: eCta });
        d.pilula(g, 'Comece em tolive.app', S.cx, yCta + (1 - eCta) * 16 * u, { tam: 42 * u, fundo: COR.papel, cor: COR.tinta, alinhar: 'center', alfa: eCta });
      },
    },
  ],
};
