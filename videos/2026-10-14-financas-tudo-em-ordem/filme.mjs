// toLive Finanças · "Tudo em ordem." · stories e feed · 16 s a 90 BPM (uma batida = 0,667 s, compasso = 2,667 s)
// O roteiro (batida a batida) está em roteiro.md. Pintar é função pura de t: nada de estado entre quadros.

const BPM = 90;
const B = n => (n * 60) / BPM; // o tempo da batida n

// A semana comum do site (tolive.app, "Uma semana comum, antes e depois"); a conta de luz cai por último,
// por cima: é a única que fica sendo sua.
const SEMANA = [
  ['financas', 'Boleto da escola', 'vence amanhã'],
  ['saude', 'Exame de rotina', 'atrasado 2 meses'],
  ['casa', 'Seguro do carro', 'renova sexta'],
  ['financas', 'Fatura do cartão', 'R$ 3.412,80'],
  ['pessoas', 'Aniversário da Ana', 'é sábado'],
  ['casa', 'IPVA, 2ª parcela', 'vence dia 20'],
  ['fe', 'Escala do louvor', 'faltam 2 pessoas'],
  ['financas', 'Streaming parado', 'R$ 39,90 por mês'],
  ['saude', 'Remédio da mãe', 'acaba em 3 dias'],
  ['casa', 'Revisão do carro', 'passou 10 mil km'],
  ['financas', 'Planilha de outubro', 'não atualizada'],
  ['financas', 'Conta de luz', '22% acima'],
];
const CHEGA = i => 0.35 + i * B(0.25);         // um papel por semicolcheia: 12 em 1,8 s
const SAI = i => B(5) + i * 0.06;              // os onze saem em sequência (o passo de 60 ms da marca)
const LUZ = SEMANA.length - 1;

const T = {
  veredito: B(6), ponto: B(6) + 0.4, celular: B(8), aviso: B(10), toque: B(12), resolvido: B(12.5),
  folha: B(14), frase: B(15), frase2: B(16.5), fraseSai: B(18), logo: B(18.5), sol: B(19), cta: B(20.5),
};

function papel(g, ctx, [app, titulo, estado], x, y, rot, alfa) {
  const { L, d, dominio, COR } = ctx, u = L.u, w = 470 * u, h = 168 * u, dm = dominio(app);
  g.save();
  g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.translate(-w / 2, -h / 2);
  d.cartao(g, 0, 0, w, h, { raio: 26 * u, cor: COR.cartao, alfa });
  g.save(); d.retangulo(g, 0, 0, w, h, 26 * u); g.clip(); g.globalAlpha *= alfa; g.fillStyle = dm.tom; g.fillRect(0, 0, w, 10 * u); g.restore();
  d.texto(g, dm.nome, 30 * u, 52 * u, { tam: 22 * u, peso: 700, cor: dm.texto, letra: 0.08, caixaAlta: true, alfa });
  d.texto(g, titulo, 30 * u, 100 * u, { tam: 38 * u, peso: 600, cor: COR.tinta, alfa });
  d.texto(g, estado, 30 * u, 142 * u, { tam: 30 * u, peso: 500, cor: COR.negativo, alfa });
  g.restore();
}

export default {
  id: '2026-10-14-financas-tudo-em-ordem',
  titulo: 'Tudo em ordem.',
  produto: 'financas',
  duracao: 16,
  bpm: BPM,
  poster: 7.6,
  assets: {
    celular: 'assets/capturas/celular-inicio.png',
    aviso: 'assets/capturas/aviso-luz.png',
    logo: 'marca/logo/logo-escuro.svg#sem-sol',
  },
  som: {
    progressao: ['I', 'vi', 'IV', 'V', 'I', 'IV'],
    sons: [
      ...SEMANA.map((_, i) => ({ t: CHEGA(i) + 0.12, tipo: 'toque' })),
      { t: SAI(0), tipo: 'entra' },
      { t: T.ponto, tipo: 'assenta' },
      { t: T.celular, tipo: 'entra' },
      { t: T.aviso, tipo: 'troca' },
      { t: T.toque, tipo: 'toque' },
      { t: T.folha, tipo: 'entra' },
      { t: T.frase + 0.4, tipo: 'assenta' },
      { t: T.frase2 + 0.4, tipo: 'assenta' },
      { t: T.sol + 0.5, tipo: 'troca' },
    ],
  },

  fundo(g, t, { L, d, COR }) { d.fundo(g, L, COR.papel); },

  cenas: [
    { // 0 – 4,7 s · o antes: doze coisas pedindo você, chegando uma atrás da outra
      de: 0, ate: B(7.5), desenhar(g, t, ctx) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        const sai12 = m.sai(t, B(5.5), { vai: 40 * u });
        const e12 = m.entra(t, -0.3, { sobe: 40 * u }); // já quase inteiro no quadro 0 (é a miniatura em alguns feeds)
        d.texto(g, '12', S.x - 14 * u, S.y + 360 * u + e12.y - sai12.d, { tam: 420 * u, fonte: 'display', letra: -0.05, alfa: e12.a * sai12.a });
        const eRot = m.entra(t, -0.1, { sobe: 24 * u });
        d.paragrafo(g, 'coisas pedindo você\nesta semana', S.x, S.y + 470 * u + eRot.y - sai12.d, { tam: 60 * u, peso: 600, maxW: S.w, entrelinha: 1.15, alfa: eRot.a * sai12.a });
        const r = m.semente(14);
        const lugares = SEMANA.map(() => ({ x: S.x - 40 * u + r() * (S.w - 390 * u), y: S.y + 640 * u + r() * (S.h - 830 * u), rot: (r() - 0.5) * 0.22 }));
        lugares[LUZ] = { x: S.cx - 235 * u, y: S.y + 640 * u + (S.h - 830 * u) * 0.55, rot: -0.03 };
        SEMANA.forEach((item, i) => {
          const e = m.entra(t, CHEGA(i), { sobe: 70 * u });
          const s = i === LUZ ? m.sai(t, B(7), { vai: 0 }) : m.sai(t, SAI(i), { vai: 90 * u });
          const p = lugares[i];
          papel(g, ctx, item, p.x - s.d, p.y + e.y, p.rot, e.a * s.a);
        });
      },
    },
    { // 4 – 10 s · a calma: o veredito, o app, a única pergunta e o "pronto"
      de: T.veredito, ate: B(15), desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        const tam = 150 * u, y0 = S.y + 140 * u;
        const l1 = m.entra(tg, T.veredito, { sobe: 24 * u }), l2 = m.entra(tg, T.veredito + 0.06, { sobe: 24 * u });
        d.veredito(g, '', S.x, y0, { tam, linhas: ['Tudo em', 'ordem'], alfas: [l1.a, l2.a], sobe: [l1.y, l2.y], pontoEscala: m.anima(tg, T.ponto, m.DUR.padrao), maxW: S.w });
        const sub = y0 + tam * 0.92 + 90 * u;
        const eSub = m.entra(tg, T.ponto + 0.06, { sobe: 16 * u });
        d.texto(g, 'Onze coisas resolvidas sem você.', S.x, sub + eSub.y, { tam: 46 * u, peso: 500, cor: COR.tinta2, alfa: eSub.a * m.trocaAlfa(tg, -1, T.resolvido) });
        d.texto(g, 'Pronto. Era só isso.', S.x, sub, { tam: 46 * u, peso: 500, cor: COR.tinta2, alfa: m.trocaAlfa(tg, T.resolvido) });

        // o celular sobe de baixo, sem mola nem quique (expressivo, 600 ms)
        const wCel = Math.min(560 * u, (L.H - S.y - 470 * u) * 0.75), topo = S.y + 440 * u;
        const eCel = m.entra(tg, T.celular, { dur: m.DUR.expressivo, sobe: 180 * u });
        d.imagem(g, ctx.img.celular, S.cx - wCel / 2, topo + eCel.y, wCel, { alfa: eCel.a });

        // a única coisa que é sua: o cartão de alerta de verdade, por cima do celular
        const wAv = Math.min(880 * u, S.w + 40 * u), hAv = wAv * 472 / 948, yAv = topo + 330 * u;
        const eAv = m.entra(tg, T.aviso, { sobe: 48 * u }), sAv = m.sai(tg, T.resolvido, { vai: 40 * u });
        d.imagem(g, ctx.img.aviso, S.cx - wAv / 2, yAv + eAv.y + sAv.d, wAv, { alfa: eAv.a * sAv.a });
        // o toque em "Está certo"
        const pToque = m.anima(tg, T.toque, m.DUR.entrada);
        if (pToque > 0 && pToque < 1) d.ponto(g, S.cx - wAv / 2 + wAv * 0.676, yAv + hAv * 0.75, (20 + 30 * pToque) * u, COR.tinta, 0.28 * (1 - pToque));
      },
    },
    { // 9,3 – 16 s · a folha da noite sobe; a frase; o logo com o sol nascendo; o convite
      de: T.folha, ate: 16, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR, dominio, catalogo } = ctx, u = L.u, S = L.seguro;
        const p = m.anima(tg, T.folha, m.DUR.expressivo);
        d.cartao(g, 0, L.H * (1 - p), L.W, L.H * p + 60 * u, { raio: 56 * u * (1 - p), cor: COR.noite });
        if (p < 1) return;

        // duas frases em sequência, cada uma com o seu ponto (um laranja por quadro), no meio da folha
        const tam = 160 * u, y0 = S.cy - 40 * u;
        const frase = (linhas, de, ate) => {
          const a1 = m.entra(tg, de, { sobe: 28 * u }), a2 = m.entra(tg, de + 0.06, { sobe: 28 * u }), s = m.sai(tg, ate, { vai: 36 * u });
          if (a1.a * s.a > 0) d.veredito(g, '', S.x, y0 - s.d, { tam, cor: COR.noiteTinta, corPonto: COR.noiteSinal, linhas, alfas: [a1.a * s.a, a2.a * s.a], sobe: [a1.y, a2.y], pontoEscala: m.anima(tg, de + 0.4, m.DUR.padrao), maxW: S.w });
        };
        frase(['Arrume', 'uma vez'], T.frase, T.frase2 - m.DUR.padrao);
        frase(['Depois,', 'vá viver'], T.frase2, T.fraseSai);

        // a abertura do app (guia, seção 7): o logo, o nome do app no tom claro do domínio, a assinatura
        const hLogo = 120 * u, yLogo = S.cy - 220 * u;
        const eLogo = m.entra(tg, T.logo, { sobe: 16 * u });
        d.logoComSol(g, ctx.img.logo, S.cx, yLogo + eLogo.y, hLogo, { alfa: eLogo.a, sol: m.anima(tg, T.sol, m.DUR.expressivo), corSol: COR.noiteSinal, alinhar: 'center' });
        const eNome = m.entra(tg, T.sol + 0.5, { sobe: 12 * u });
        d.texto(g, 'Finanças', S.cx, yLogo + hLogo + 90 * u + eNome.y, { tam: 40 * u, peso: 700, letra: 0.12, caixaAlta: true, cor: dominio('financas').horizonte, alinhar: 'center', alfa: eNome.a });
        const eAss = m.entra(tg, T.sol + 0.56, { sobe: 12 * u });
        ['Tecnologia feita', 'para não ser usada'].forEach((l, i) => d.texto(g, l, S.cx, yLogo + hLogo + 200 * u + i * 50 * u + eAss.y, { tam: 32 * u, peso: 500, letra: 0.3, caixaAlta: true, cor: COR.noiteTinta2, alinhar: 'center', alfa: eAss.a }));

        // o convite: o teste grátis vem da conta (catálogo), nunca escrito aqui
        const eCta = m.entra(tg, T.cta, { sobe: 16 * u });
        const yCta = S.base - 130 * u;
        if (catalogo.teste) d.texto(g, catalogo.teste.charAt(0).toUpperCase() + catalogo.teste.slice(1), S.cx, yCta - 50 * u + eCta.y, { tam: 36 * u, peso: 500, cor: COR.noiteTinta, alinhar: 'center', alfa: eCta.a });
        d.pilula(g, 'Comece em tolive.app', S.cx, yCta + eCta.y, { tam: 38 * u, fundo: COR.papel, cor: COR.tinta, alinhar: 'center', alfa: eCta.a });
      },
    },
  ],
};
