// toLive Finanças · "Propósito" · stories e feed · na grade da música licenciada
// Música: "Our Story Begins", Kevin MacLeod (incompetech.com), CC BY 4.0, a partir de 55,869 s, o começo que
// `node estudio/batidas.mjs assets/musicas/kevin-macleod-our-story-begins.mp3 --trecho 5,6` achou: cinco compassos
// calmos, a virada (a energia sobe) no compasso 5 do filme, e a música termina de verdade no compasso 13.
// (Seis compassos calmos deixavam 11 s antes da virada: tempo demais pra quem ainda não decidiu ficar.)
// Estrutura (Sidney, 14/10/2026: inspirador, como a Apple): o peso → o sol nascendo → as features na virada, nas telas
// do app de verdade → o manifesto → o fim. O roteiro está em roteiro.md. Pintar é função pura de t.

const BPM = 129.25;                // medido na faixa
const B = n => (n * 60) / BPM;     // batida n (0,464 s)
const C = n => B(n * 4);           // compasso n (1,857 s)

// o peso: uma palavra por batida, cortando seco, papel e noite alternando; a frase fica quatro batidas
const PALAVRAS = [['Boleto'], ['Fatura'], ['Extrato'], ['Planilha'], ['Lembrete'], ['Susto no', 'dia 30']];
const FRASE = ['Cada um', 'pede um', 'pedaço', 'de você'];
// a prova: uma feature por compasso, a partir da virada, cada uma na tela de verdade do app (dados simulados)
const FEATURES = [
  { titulo: ['Conecta'], prova: 'Seus bancos pelo Open Finance. Só para ler.', img: 'contas' },
  { titulo: ['Organiza'], prova: 'Um lançamento por vez. Você só diz “certo”.', img: 'aprovar' },
  { titulo: ['Avisa antes'], prova: 'Quando o mês vai passar do limite, não depois.', img: 'mes' },
  { titulo: ['Projeta', 'o ano'], prova: 'Doze meses à vista, numa frase.', img: 'doze' },
  { titulo: ['Soma tudo'], prova: 'Contas e investimentos num número só.', img: 'patrimonio' },
];
const PROMESSA = ['Tecnologia', 'feita para não', 'ser usada'];
const T = {
  frase: B(6), sol: B(10), solNasce: B(11), promessa: B(14), virada: C(5),
  manifesto: C(5 + FEATURES.length), folha: C(6 + FEATURES.length),
};
T.logo = T.folha + B(1); T.solFim = T.folha + B(2); T.cta = T.folha + B(5);
const inicioFeature = i => T.virada + C(i);
const DURACAO = 24.5; // a música termina sozinha no compasso 13 (24,1 s); o resto é a cauda dela

export default {
  id: '2026-10-14-financas-proposito',
  titulo: 'Tecnologia feita para não ser usada',
  produto: 'financas',
  duracao: DURACAO,
  bpm: BPM,
  poster: inicioFeature(1) + 1.2,
  assets: {
    contas: 'assets/capturas/app-contas.png',
    aprovar: 'assets/capturas/app-aprovar.png',
    mes: 'assets/capturas/app-mes.png',
    doze: 'assets/capturas/app-12-meses.png',
    patrimonio: 'assets/capturas/app-patrimonio.png',
    logo: 'marca/logo/logo-escuro.svg#sem-sol',
  },
  som: {
    musica: 'assets/musicas/kevin-macleod-our-story-begins.mp3',
    inicio: 55.869,
    fimDe: 0.6,
    volumeEfeitos: 0.35,
    sons: [
      ...PALAVRAS.map((_, i) => ({ t: B(i), tipo: 'bate' })),
      ...FEATURES.slice(1).map((_, i) => ({ t: inicioFeature(i + 1) - 0.05, tipo: 'passa' })),
      { t: T.manifesto - 0.05, tipo: 'passa' },
      { t: T.folha - 0.05, tipo: 'passa' },
    ],
  },

  fundo(g, t, { L, d, COR }) { d.fundo(g, L, COR.papel); },

  cenas: [
    { // o peso: cada palavra bate na sua batida e corta seco na próxima; depois a frase, com o ponto
      de: 0, ate: T.sol, desenhar(g, t, ctx) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, ADIANTA = 0.08;
        const i = Math.floor((ctx.corte(t) + ADIANTA) / B(1)); // corte seco: decide pelo começo do quadro
        if (i < PALAVRAS.length) {
          const noite = i % 2 === 1, linhas = PALAVRAS[i];
          d.fundo(g, L, noite ? COR.noite : COR.papel);
          const desloc = linhas.map((_, k) => m.revela(t, (i === 0 ? -0.28 : B(i) - ADIANTA) + k * 0.05));
          d.textoRevelado(g, linhas, S.x, S.cy + 100 * u - (linhas.length - 1) * 130 * u, desloc, { tam: 300 * u, cor: noite ? COR.noiteTinta : COR.tinta, maxW: S.w });
        } else {
          const desloc = FRASE.map((_, k) => m.revela(t, T.frase - ADIANTA + k * 0.07));
          d.textoRevelado(g, FRASE, S.x, S.cy - 250 * u, desloc, { tam: 200 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(t, T.frase + 0.45, m.DUR.padrao, m.CURVA.forte) });
        }
      },
    },
    { // a virada de chave: na noite, o horizonte corre e o sol nasce atrás dele; a promessa
      de: T.sol, ate: T.virada, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        d.fundo(g, L, COR.noite);
        const tam = 340 * u, y = S.y + 120 * u;
        d.simbolo(g, S.cx - (tam * 100 / 92) / 2, y, tam, {
          horizonte: m.anima(tg, T.sol - 0.08, 0.6, m.CURVA.forte), // na batida, o traço já está correndo
          sol: m.anima(tg, T.solNasce, m.FILME.sol * 1.3, m.CURVA.forte),
          corHorizonte: COR.noiteTinta, corSol: COR.noiteSinal,
        });
        const desloc = PROMESSA.map((_, k) => m.revela(tg, T.promessa - 0.08 + k * B(1)));
        d.textoRevelado(g, PROMESSA, S.cx, y + tam + 230 * u, desloc, { tam: 130 * u, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
      },
    },
    { // a virada da música: cinco features, um compasso cada; a primeira corta seco, as outras empurram a anterior
      de: T.virada, ate: T.manifesto + 0.6, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        FEATURES.forEach((f, i) => {
          const ini = inicioFeature(i), prox = inicioFeature(i + 1);
          if (tg < ini - m.FILME.empurra || tg > prox + m.FILME.empurra) return;
          const entra = i === 0 ? 0 : (1 - m.anima(tg, ini - m.FILME.empurra * 0.5, m.FILME.empurra, m.CURVA.empurra)) * L.W;
          const sai = -m.anima(tg, prox - m.FILME.empurra * 0.5, m.FILME.empurra, m.CURVA.empurra) * L.W;
          g.save(); g.translate(entra + sai, 0);
          d.fundo(g, L, COR.papel);
          const tl = tg - ini; // negativo enquanto a cena ainda está entrando
          const desloc = f.titulo.map((_, k) => m.revela(tl, -0.12 + k * 0.06));
          const tit = d.textoRevelado(g, f.titulo, S.x, S.y + 190 * u, desloc, { tam: 190 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tl, 0.3, m.DUR.padrao, m.CURVA.forte) });
          const yProva = S.y + 190 * u + tit.h - tit.tam * 0.92 + 90 * u;
          const ep = m.anima(tl, 0.15, m.DUR.entrada, m.CURVA.forte);
          const prova = d.paragrafo(g, f.prova, S.x, yProva + (1 - ep) * 24 * u, { tam: 44 * u, peso: 500, cor: COR.tinta2, alfa: ep, maxW: S.w, entrelinha: 1.25 });
          // o celular com a tela de verdade sobe de baixo, a câmera empurra e para; o aparelho sai do quadro
          // embaixo de propósito (o que importa é o veredito no topo da tela)
          const topo = yProva + prova.h + 50 * u;
          const w = Math.min(S.w * 0.74, 700 * u, (L.H - topo) * 0.62);
          const pc = m.anima(tl, -0.1, m.FILME.camera, m.CURVA.forte);
          g.save();
          d.camera(g, { escala: 1.1 - 0.1 * pc, fx: S.cx, fy: topo, dy: (1 - pc) * 220 * u });
          d.celular(g, ctx.img[f.img], S.cx - w / 2, topo, w, { alfa: i === 0 ? m.anima(tl, -0.1, 0.12) : 1 });
          g.restore();
          g.restore();
        });
      },
    },
    { // o manifesto: o melhor elogio
      de: T.manifesto - 0.3, ate: T.folha + 0.6, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        const entra = (1 - m.anima(tg, T.manifesto - m.FILME.empurra * 0.5, m.FILME.empurra, m.CURVA.empurra)) * L.W;
        g.save(); g.translate(entra, 0);
        d.fundo(g, L, COR.papel);
        const e = m.anima(tg, T.manifesto, m.DUR.entrada, m.CURVA.forte);
        d.texto(g, 'O melhor elogio que podemos receber', S.x, S.cy - 330 * u + (1 - e) * 20 * u, { tam: 44 * u, peso: 500, cor: COR.tinta2, alfa: e });
        const linhas = ['“Esqueci', 'que tinha', 'o app”'];
        const desloc = linhas.map((_, k) => m.revela(tg, T.manifesto + 0.15 + k * 0.08));
        d.textoRevelado(g, linhas, S.x, S.cy - 140 * u, desloc, { tam: 210 * u, maxW: S.w });
        g.restore();
      },
    },
    { // o fim: a folha da noite sobe, o sol nasce no logo (a assinatura), o convite; a música termina aqui
      de: T.folha - 0.3, ate: DURACAO, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR, dominio, catalogo } = ctx, u = L.u, S = L.seguro;
        const p = m.anima(tg, T.folha - 0.25, m.FILME.empurra, m.CURVA.empurra);
        d.cartao(g, 0, L.H * (1 - p), L.W, L.H * p + 60 * u, { raio: 56 * u * (1 - p), cor: COR.noite });
        if (p < 1) return;
        const hLogo = 140 * u, yLogo = S.cy - 260 * u;
        const eLogo = m.anima(tg, T.logo, m.DUR.entrada, m.CURVA.forte);
        d.logoComSol(g, ctx.img.logo, S.cx, yLogo + (1 - eLogo) * 20 * u, hLogo, { alfa: eLogo, sol: m.anima(tg, T.solFim, m.FILME.sol * 1.3, m.CURVA.forte), corSol: COR.noiteSinal, alinhar: 'center' });
        const eNome = m.anima(tg, T.solFim + 0.6, m.DUR.entrada, m.CURVA.forte);
        d.texto(g, 'Finanças', S.cx, yLogo + hLogo + 100 * u + (1 - eNome) * 14 * u, { tam: 44 * u, peso: 700, letra: 0.12, caixaAlta: true, cor: dominio('financas').horizonte, alinhar: 'center', alfa: eNome });
        const eAss = m.anima(tg, T.solFim + 0.7, m.DUR.entrada, m.CURVA.forte);
        ['Tecnologia feita', 'para não ser usada'].forEach((l, i) => d.texto(g, l, S.cx, yLogo + hLogo + 210 * u + i * 52 * u + (1 - eAss) * 14 * u, { tam: 32 * u, peso: 500, letra: 0.3, caixaAlta: true, cor: COR.noiteTinta2, alinhar: 'center', alfa: eAss }));
        const eCta = m.anima(tg, T.cta, m.DUR.entrada, m.CURVA.forte), yCta = S.base - 150 * u;
        if (catalogo.teste) d.texto(g, catalogo.teste.charAt(0).toUpperCase() + catalogo.teste.slice(1), S.cx, yCta - 56 * u + (1 - eCta) * 16 * u, { tam: 38 * u, peso: 500, cor: COR.noiteTinta, alinhar: 'center', alfa: eCta });
        d.pilula(g, 'Comece em tolive.app', S.cx, yCta + (1 - eCta) * 16 * u, { tam: 42 * u, fundo: COR.papel, cor: COR.tinta, alinhar: 'center', alfa: eCta });
      },
    },
  ],
};
