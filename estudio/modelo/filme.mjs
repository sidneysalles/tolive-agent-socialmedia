// {{titulo}} · {{produto}} · {{formatos}} · 12 s a 92 BPM
// O modelo do estúdio: três cenas que já funcionam (o gancho, o produto de verdade, o fim com o logo e o convite).
// Troque o texto, as capturas e o tempo; acrescente cenas. O roteiro batida a batida vai no roteiro.md.
// Pintar é função pura de t: nada de estado entre quadros, Math.random, timer ou transição de CSS.

const BPM = 92;
const B = n => (n * 60) / BPM;

const T = { gancho: 0, ponto: 0.4, captura: B(4), frase: B(4) + 0.5, folha: B(12), logo: B(13), sol: B(13.5), cta: B(15) };

export default {
  id: '{{id}}',
  titulo: '{{titulo}}',
  produto: '{{produto}}',
  duracao: 12,
  bpm: BPM,
  poster: B(6),
  assets: {
    captura: 'assets/capturas/{{captura}}.png',
    logo: 'marca/logo/logo-escuro.svg#sem-sol',
  },
  som: {
    progressao: ['I', 'vi', 'IV', 'V'],
    sons: [
      { t: T.ponto, tipo: 'assenta' },
      { t: T.captura, tipo: 'entra' },
      { t: T.folha, tipo: 'entra' },
      { t: T.sol + 0.5, tipo: 'troca' },
    ],
  },

  fundo(g, t, { L, d, COR }) { d.fundo(g, L, COR.papel); },

  cenas: [
    { // o gancho: o veredito grande, já no quadro 0
      de: 0, ate: T.folha + 1, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        const tam = 150 * u;
        const l1 = m.entra(tg, -0.3, { sobe: 24 * u }), l2 = m.entra(tg, -0.24, { sobe: 24 * u });
        d.veredito(g, '', S.x, S.y + 140 * u, { tam, linhas: ['{{gancho1}}', '{{gancho2}}'], alfas: [l1.a, l2.a], sobe: [l1.y, l2.y], pontoEscala: m.anima(tg, T.ponto, m.DUR.padrao), maxW: S.w });
        const e = m.entra(tg, T.frase, { sobe: 16 * u });
        d.texto(g, '{{frase}}', S.x, S.y + 140 * u + tam * 0.92 + 90 * u + e.y, { tam: 46 * u, peso: 500, cor: COR.tinta2, alfa: e.a });

        // o produto de verdade (assets/capturas), subindo de baixo
        const img = ctx.img.captura, w = Math.min(S.w, 900 * u), topo = S.y + 480 * u;
        const ec = m.entra(tg, T.captura, { dur: m.DUR.expressivo, sobe: 160 * u });
        d.imagem(g, img, S.cx - w / 2, topo + ec.y, w, { alfa: ec.a });
      },
    },
    { // o fim: a folha da noite sobe; o logo com o sol nascendo; o convite (o teste grátis vem do catálogo)
      de: T.folha, ate: 12, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR, dominio, catalogo } = ctx, u = L.u, S = L.seguro;
        const p = m.anima(tg, T.folha, m.DUR.expressivo);
        d.cartao(g, 0, L.H * (1 - p), L.W, L.H * p + 60 * u, { raio: 56 * u * (1 - p), cor: COR.noite });
        if (p < 1) return;
        const hLogo = 120 * u, yLogo = S.cy - 220 * u;
        const eLogo = m.entra(tg, T.logo, { sobe: 16 * u });
        d.logoComSol(g, ctx.img.logo, S.cx, yLogo + eLogo.y, hLogo, { alfa: eLogo.a, sol: m.anima(tg, T.sol, m.DUR.expressivo), corSol: COR.noiteSinal, alinhar: 'center' });
        const eNome = m.entra(tg, T.sol + 0.5, { sobe: 12 * u });
        d.texto(g, '{{nomeCurto}}', S.cx, yLogo + hLogo + 90 * u + eNome.y, { tam: 40 * u, peso: 700, letra: 0.12, caixaAlta: true, cor: dominio('{{dominio}}').horizonte, alinhar: 'center', alfa: eNome.a });
        const eAss = m.entra(tg, T.sol + 0.56, { sobe: 12 * u });
        ['Tecnologia feita', 'para não ser usada'].forEach((l, i) => d.texto(g, l, S.cx, yLogo + hLogo + 200 * u + i * 50 * u + eAss.y, { tam: 32 * u, peso: 500, letra: 0.3, caixaAlta: true, cor: COR.noiteTinta2, alinhar: 'center', alfa: eAss.a }));
        const eCta = m.entra(tg, T.cta, { sobe: 16 * u }), yCta = S.base - 130 * u;
        if (catalogo.teste) d.texto(g, catalogo.teste.charAt(0).toUpperCase() + catalogo.teste.slice(1), S.cx, yCta - 50 * u + eCta.y, { tam: 36 * u, peso: 500, cor: COR.noiteTinta, alinhar: 'center', alfa: eCta.a });
        d.pilula(g, 'Comece em tolive.app', S.cx, yCta + eCta.y, { tam: 38 * u, fundo: COR.papel, cor: COR.tinta, alinhar: 'center', alfa: eCta.a });
      },
    },
  ],
};
