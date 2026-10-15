// toLive · "Manifesto" · reels · a voz do Sidney manda na linha do tempo, a música na grade depois da virada
// O roteiro (fechado com o Sidney em 15/10/2026, roteiro.md): a tecnologia que prende (o caos, liberado só aqui) →
// o silêncio da noite → o sol nasce e vira o logo ("A toLive nasceu pro contrário") → as rotinas que a gente cuida →
// o Finanças como prova (abre, a decisão pronta, fecha) → o Toly que só chama quando a decisão é sua → sem sequência,
// sem medalha (o caos do começo, riscado) → "Tecnologia pra você viver", o logo e os dias grátis.
// Pintar é função pura de t: o caos também (cada peça tem a hora dela; o confete é balística, com semente).

import musica from './musica.json' with { type: 'json' };
import narr from './narracao.json' with { type: 'json' };
import { assetsDasCamadas } from '../../estudio/camadas.mjs';
import { acelerar } from '../../estudio/acelerar.mjs';
import { semente } from '../../estudio/movimento.mjs';
import camCelular from '../../assets/capturas/camadas/celular-tolive/camadas.json' with { type: 'json' };
import camToly from '../../assets/capturas/camadas/toly-balao/camadas.json' with { type: 'json' };
import camTolyDepois from '../../assets/capturas/camadas/toly-balao-depois/camadas.json' with { type: 'json' };

// o filme acelera 4/3 (como o Propósito, aprovado): a voz junto, a música no andamento dela. Os cortes depois da
// virada caem na batida da música no filme acelerado, então a grade aqui (no tempo de antes) é a batida × 4/3
const VELOCIDADE = 4 / 3;
const BPM = musica.bpm;
const B = n => (n * 60) / BPM;
const BG = B(1) * VELOCIDADE;

// a voz: EM[id] = a hora do filme em que a primeira palavra da fala entra; W(id, k), a palavra k; FIM(id), o fim
const FALA = Object.fromEntries(narr.falas.map(f => [f.id, f]));
const EM = {};
const W = (id, k) => EM[id] + FALA[id].palavras[k].i - FALA[id].palavras[0].i;
const FIM = id => EM[id] + FALA[id].palavras.at(-1).f - FALA[id].palavras[0].i;

// a linha do tempo, na ordem da voz
const T = {};
EM.gancho = 0.1;
EM.alerta = FIM('gancho') + 0.35;
T.silencio = FIM('alerta') + 0.3;            // o caos corta seco: noite e silêncio
EM.surge = T.silencio + 0.55;
EM.nenhum = FIM('surge') + 0.4;
EM.todas = FIM('nenhum') + 0.4;
T.sol = FIM('todas') + 0.35;                 // o horizonte se desenha, o sol nasce, o símbolo vira o logo
T.solNasce = T.sol + 0.2; T.vira = T.sol + 0.95;
EM.virada = T.vira + 0.3;                    // "A toLive" quando as letras se abrem
T.musica = EM.virada;                        // a virada da música
const naBatida = t => T.musica + Math.round((t - T.musica) / BG) * BG;
T.pilares = naBatida(FIM('virada') + 0.45);
EM.rotinas = T.pilares + 0.08;
EM.cuida = FIM('rotinas') + 0.35;
T.app = naBatida(FIM('cuida') + 0.45);
EM.comecamos = T.app + 0.15;
EM.abre = FIM('comecamos') + 0.3;
EM.isso = FIM('abre') + 0.45;
EM.restante = FIM('isso') + 0.3;
T.toly = naBatida(FIM('restante') + 0.45);
EM.decisao = T.toly + 0.25;
T.fim = naBatida(FIM('decisao') + 0.45);
EM.viver = T.fim + 0.75;                     // o logo e o sol primeiro, a voz depois
T.teste = FIM('viver') + 0.35;
const DURACAO = +(T.teste + 0.5 + 2.7).toFixed(2); // o fim parado: ~2 s no filme acelerado

// os textos da tela: o que a voz diz, cada linha na palavra que a puxa ([linha, palavra])
const GANCHO = [['Quase toda', 0], ['tecnologia foi', 3], ['feita pra', 5], ['te prender', 7]];
const ALERTA = [['Mais um', 0], ['alerta', 2]];
const MOTIVO = [['Mais um motivo', 5], ['pra voltar', 8]];
const NOITE = [
  ['surge', [['Todo dia surge', 0], ['algo novo', 3]]],
  ['nenhum', [['Nenhum pra você', 0], ['viver melhor', 3]]],
  ['todas', [['Todas pra te', 0], ['prender mais', 3]]],
];
const NASCEU = [['nasceu pro contrário:', 1], ['pra você viver', 4], ['fora da tela', 7]];
const ROTINAS = [['Dinheiro', 2], ['Casa', 4], ['Agendas', 5], ['Organização', 6]];
const CUIDA = [['A gente cuida', 0], ['e você vive', 3]];
const COMECA = [['Nós começamos', 0], ['pelo dinheiro', 2]];
const ISSO = [['É isso', 0]];
const RESTANTE = [['O restante', 0], ['deixa conosco', 2]];
const DECISAO = [['Só te chama', 4], ['quando a decisão', 7], ['é sua', 10]];
const SEM = [['Sem sequência', 12, 'chama'], ['Sem medalha', 14, 'medalha']];
const VIVER = [['Tecnologia', 0], ['pra você viver', 1]];

// a tela do site (o celular do toLive na comparação: "Uma coisa é sua. O resto está resolvido."), num aparelho; o
// dedo aperta "Ver a conta" no "decidir"
const CELULAR = { ...camCelular, semAparelho: false, uso: { alvo: { x: 34, y: 337.7, w: 99, h: 38 }, tocar: 'Ver a conta' } };
// o Toly: o "Agora não" apertado e o cartão de depois ("Tudo bem. Não pergunto de novo este mês."); cada peça troca
// no lugar (nada se pareia entre os dois estados)
const noLugar = (cam, pre) => ({ ...cam, pecas: cam.pecas.map(p => ({ ...p, tipo: 'texto', texto: `${pre}${p.i}`, conteudo: `${pre}${p.i}` })) });
const TOLY = { ...noLugar(camToly, 'a'), uso: { alvo: { x: 143, y: 190, w: 106, h: 44 }, tocar: 'Agora não' } };
const TOLY_DEPOIS = noLugar(camTolyDepois, 'd');

// O caos (só o gancho e o problema; o Sidney liberou: "gosto do caos visual no começo"): bolinhas vermelhas com
// número, avisos que descem, a chama da sequência, a medalha, confete. Cada peça tem a hora dela; a densidade cresce
// até o corte. Fica nas faixas de cima e de baixo, longe da frase. Nada de marca de ninguém: tudo genérico.
// <voz-de-fora>
const AVISOS = [
  ['Sentimos sua falta', 'Faz 3 dias que você não aparece.'],
  ['Não perca sua sequência', 'Só falta 1 minuto hoje.'],
  ['Você ganhou uma medalha', 'Abra pra ver o que desbloqueou.'],
  ['12 pessoas reagiram', 'Veja quem curtiu sua foto.'],
  ['A oferta acaba em 10 min', 'Toque pra aproveitar.'],
  ['Seu resumo chegou', 'Você passou 31 h na tela.'],
  ['Volte agora', 'Tem novidade esperando por você.'],
];
// </voz-de-fora>
const CAOS = (() => {
  const r = semente(41), lista = [];
  const n = 46, ate = T.silencio - 0.35;
  const tipos = ['bolinha', 'aviso', 'bolinha', 'chama', 'aviso', 'bolinha', 'medalha', 'confete'];
  for (let i = 0; i < n; i++) {
    const t = -2.2 + (ate + 2.2) * Math.pow(i / (n - 1), 0.85); // umas dez já no quadro 0 (a miniatura)
    const tipo = tipos[i % tipos.length];
    const cima = i % 2 === 0;
    lista.push({ i, t, tipo, cima, fx: r(), fy: r(), escala: 0.75 + r() * 0.5, numero: [3, 7, 12, 28, 99][Math.floor(r() * 5)], aviso: AVISOS[i % AVISOS.length], cor: Math.floor(r() * 4), seed: Math.floor(r() * 1e6) });
  }
  return lista;
})();

// a chama e a medalha, desenhadas aqui (o caos e a rima riscando os dois): formas simples, as cores dos dados
function chama(g, COR, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.beginPath(); g.moveTo(0, 50);
  g.bezierCurveTo(-38, 48, -46, 12, -26, -14); g.bezierCurveTo(-18, -26, -14, -40, -16, -52);
  g.bezierCurveTo(4, -40, 12, -24, 10, -10); g.bezierCurveTo(16, -18, 20, -26, 20, -34);
  g.bezierCurveTo(40, -14, 46, 26, 24, 44); g.bezierCurveTo(16, 50, 8, 51, 0, 50); g.closePath();
  g.fillStyle = COR.sinal; g.fill();
  g.beginPath(); g.moveTo(0, 46); g.bezierCurveTo(-18, 44, -20, 22, -6, 8); g.bezierCurveTo(-2, 18, 8, 20, 10, 12); g.bezierCurveTo(20, 28, 14, 44, 0, 46); g.closePath();
  g.fillStyle = COR.dado3; g.fill();
  g.restore();
}
function medalha(g, COR, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = COR.dado2;
  g.beginPath(); g.moveTo(-26, -56); g.lineTo(-6, -56); g.lineTo(6, -14); g.lineTo(-12, -14); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(26, -56); g.lineTo(6, -56); g.lineTo(-6, -14); g.lineTo(12, -14); g.closePath(); g.fill();
  g.beginPath(); g.arc(0, 14, 34, 0, Math.PI * 2); g.fillStyle = COR.dado3; g.fill();
  g.beginPath(); g.arc(0, 14, 23, 0, Math.PI * 2); g.lineWidth = 5; g.strokeStyle = COR.cartao; g.stroke();
  g.restore();
}

function pecaDoCaos(g, p, t, ctx) {
  const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
  const dt = t - p.t;
  if (dt < 0) return;
  // a faixa: em cima (do topo da área segura até a frase) ou embaixo (da frase até a base)
  const yTopo = S.y + 10 * u, yMeio1 = S.cy - 330 * u, yMeio2 = S.cy + 360 * u, yBase = S.base - 10 * u;
  const y = p.cima ? yTopo + p.fy * (yMeio1 - yTopo) : yMeio2 + p.fy * (yBase - yMeio2);
  const pula = m.quica(t, p.t); // o enfeite que quica: o retrato do inimigo
  const coresIcone = [COR.dado2, COR.dado4, COR.positivo, COR.dado3];
  if (p.tipo === 'bolinha') {
    const r = 46 * u * p.escala, x = S.x + r + p.fx * (S.w - 2 * r);
    g.save(); g.translate(x, y); g.scale(pula, pula);
    d.ponto(g, 0, 0, r, COR.negativo);
    d.texto(g, String(p.numero), 0, 2 * u, { tam: r * 0.95, peso: 700, cor: COR.cartao, alinhar: 'center', base: 'middle' });
    g.restore();
  } else if (p.tipo === 'aviso') {
    const w = S.w * 0.86, h = 126 * u, x = S.x + p.fx * (S.w - w);
    const desce = (1 - m.anima(t, p.t, 0.35, m.CURVA.forte)) * -60 * u;
    g.save(); g.translate(x + w / 2, y + desce); g.scale(0.9 + 0.1 * pula, 0.9 + 0.1 * pula); g.translate(-w / 2, -h / 2);
    g.globalAlpha *= m.clamp(dt / 0.12);
    d.cartao(g, 0, 0, w, h, { raio: 30 * u, cor: COR.cartao, borda: COR.linha, larguraBorda: 2 * u });
    d.cartao(g, 22 * u, 24 * u, 78 * u, 78 * u, { raio: 18 * u, cor: coresIcone[p.cor] });
    d.texto(g, p.aviso[0], 124 * u, 56 * u, { tam: 32 * u, peso: 700, cor: COR.tinta });
    d.texto(g, p.aviso[1], 124 * u, 96 * u, { tam: 28 * u, cor: COR.tinta2 });
    g.restore();
  } else if (p.tipo === 'chama' || p.tipo === 'medalha') {
    const s = 1.5 * u * p.escala, x = S.x + 70 * s + p.fx * (S.w - 220 * s);
    g.save(); g.translate(x, y); g.scale(pula, pula);
    (p.tipo === 'chama' ? chama : medalha)(g, COR, 0, 0, s);
    d.texto(g, p.tipo === 'chama' ? `${p.numero * 4} dias` : `Nível ${Math.ceil(p.numero / 4)}`, 56 * s, 14 * s, { tam: 30 * s, peso: 700, cor: COR.tinta, base: 'middle' });
    g.restore();
  } else if (p.tipo === 'confete') {
    // balística: cada papel sai do ponto com a velocidade dele, cai e gira
    const r = semente(p.seed), x0 = S.x + p.fx * S.w, cores = [COR.dado2, COR.dado3, COR.dado4, COR.positivo, COR.negativo];
    for (let k = 0; k < 26; k++) {
      const a = -Math.PI / 2 + (r() - 0.5) * 2.4, v = (520 + r() * 680) * u, gira = (r() - 0.5) * 14, cor = cores[k % cores.length], lado = (12 + r() * 12) * u;
      if (dt > 2.2) continue;
      const px = x0 + Math.cos(a) * v * dt, py = y + Math.sin(a) * v * dt + 0.5 * 2200 * u * dt * dt;
      g.save(); g.translate(px, py); g.rotate(gira * dt + k); g.fillStyle = cor; g.fillRect(-lado / 2, -lado * 0.3, lado, lado * 0.6); g.restore();
    }
  }
}

const filme = {
  id: '2026-10-15-suite-manifesto',
  titulo: 'Tecnologia pra você viver melhor',
  produto: 'suite',
  duracao: DURACAO,
  bpm: BPM,
  poster: T.sol + 1.6,
  musica: { antes: 5, depois: 8, compassos: 17 },
  previa: {
    de: 0, ate: DURACAO, titulo: 'O filme inteiro, com a sua voz e a música',
    texto: 'Em qualidade de rascunho (meia resolução, sai em segundos), 1,33× mais rápido como o Propósito (a voz junto, mesmo tom). O caos abre só com os avisos tocando; a música entra no silêncio da noite e vira quando o sol forma o logo.',
  },
  // a narração gravada (narracao.json): cada fala, a hora em que entra no filme e o que a tela escreve com ela
  narracao: narr.falas.map((f, k, todas) => ({ id: f.id, de: +EM[f.id].toFixed(2), ate: +(k + 1 < todas.length ? EM[todas[k + 1].id] : DURACAO).toFixed(2), texto: f.texto.trim(), nota: 'gravada' })),
  quadros: [
    { id: 'caos', t: W('alerta', 4), nome: 'O caos: a tecnologia que prende', texto: 'Bolinhas, avisos, chama, medalha, confete · "Mais um alerta"' },
    { id: 'noite', t: W('nenhum', 4), nome: 'A noite: o silêncio depois do caos', texto: NOITE.map(n => n[1].map(l => l[0]).join(' ')).join(' · ') },
    { id: 'sol', t: T.pilares - 0.25, nome: 'O sol nasce e vira o logo', texto: 'toLive · ' + NASCEU.map(l => l[0]).join(' ') },
    { id: 'rotinas', t: EM.cuida - 0.2, nome: 'As rotinas', texto: ROTINAS.map(l => l[0]).join(' · ') },
    { id: 'cuida', t: T.app - 0.15, nome: 'A gente cuida e você vive', texto: CUIDA.map(l => l[0]).join(' ') },
    { id: 'app', t: W('abre', 12), nome: 'O Finanças: a decisão pronta, o toque', texto: 'Uma coisa é sua · O resto está resolvido · "Ver a conta"' },
    { id: 'restante', t: T.toly - 0.15, nome: 'O restante deixa conosco', texto: RESTANTE.map(l => l[0]).join(' ') },
    { id: 'toly', t: W('decisao', 12) - 0.1, nome: 'O Toly: só chama quando a decisão é sua', texto: '"Agora não" → "Tudo bem. Não pergunto de novo este mês."' },
    { id: 'sem', t: T.fim - 0.15, nome: 'Sem sequência, sem medalha (o caos riscado)', texto: SEM.map(l => l[0]).join(' · ') },
    { id: 'fim', t: DURACAO - 0.2, nome: 'O fim: o logo, a frase, os dias grátis', texto: 'Tecnologia pra você viver · o teste grátis do catálogo · Comece em tolive.app' },
  ],
  assets: {
    ...assetsDasCamadas('celular', CELULAR),
    ...assetsDasCamadas('toly', TOLY),
    ...assetsDasCamadas('toly2', TOLY_DEPOIS),
    logo: 'marca/logo/logo-escuro.svg#sem-sol',
    letras: 'marca/logo/logo-escuro.svg#so-letras',
  },
  som: {
    musica: musica.arquivo,
    musicaEm: EM.surge - 0.45,  // a música chega no silêncio da noite; o caos é só aviso
    musicaSobe: 1.4,
    fimDe: 2.4,
    volumeEfeitos: 0.5,
    volumeMusica: 0.6,
    narracao: { arquivo: narr.arquivo, falas: narr.falas.map(f => ({ de: f.de, ate: f.ate, em: +(EM[f.id] - (f.palavras[0].i - f.de)).toFixed(3) })) },
    sons: [
      // o caos: cada peça que chega toca (o aviso, do lado de onde ela aparece); a bolinha gigante bate forte
      ...CAOS.filter(p => p.t >= 0).map(p => ({ t: p.t, tipo: p.tipo === 'confete' ? 'passa' : p.tipo === 'chama' || p.tipo === 'medalha' ? 'bate' : 'aviso', vol: 0.45 + 0.4 * (p.t / T.silencio), pan: p.fx * 1.4 - 0.7 })),
      { t: W('alerta', 3) - 0.02, tipo: 'aviso', vol: 1, pan: 0.4 },
      { t: EM.alerta - 0.04, tipo: 'bate', vol: 0.7 },
      { t: W('alerta', 5) - 0.04, tipo: 'bate', vol: 0.7 },
      // a virada
      { t: T.sol - 0.1, tipo: 'entra', vol: 0.5 },
      { t: EM.virada - 0.05, tipo: 'assenta', vol: 0.8 },
      // as rotinas, uma batida por palavra; a troca pra "A gente cuida"
      ...ROTINAS.map(([, k]) => ({ t: W('rotinas', k) - 0.04, tipo: 'bate', vol: 0.45 })),
      { t: EM.cuida - 0.1, tipo: 'passa', vol: 0.5 },
      // o app: chega pela direita, a câmera vai ao detalhe, o toque, a tela apaga e o aparelho sai
      { t: T.app - 0.1, tipo: 'entra', vol: 0.6, pan: 0.6 },
      { t: W('abre', 2) - 0.05, tipo: 'passa', vol: 0.4 },
      { t: W('abre', 11), tipo: 'toque' },
      { t: W('abre', 14), tipo: 'assenta', vol: 0.6 },
      { t: EM.restante - 0.1, tipo: 'passa', vol: 0.4 },
      // o Toly: chega de baixo, o "Agora não", o cartão de depois; a chama e a medalha riscadas
      { t: T.toly + 0.1, tipo: 'entra', vol: 0.6 },
      { t: W('decisao', 9), tipo: 'toque' },
      { t: W('decisao', 9) + 0.4, tipo: 'assenta', vol: 0.5 },
      ...SEM.map(([, k]) => ({ t: W('decisao', k) + 0.15, tipo: 'passa', vol: 0.45 })),
      // o fim
      { t: T.fim - 0.05, tipo: 'assenta', vol: 0.7 },
      { t: T.teste, tipo: 'bate', vol: 0.6 },
    ],
  },

  fundo(g, t, { L, d, COR }) { d.fundo(g, L, COR.papel); },

  cenas: [
    { // o gancho e o problema: a frase da voz, grande, e o caos crescendo em volta; a bolinha vermelha gigante no
      // "bolinha vermelha". Corta seco em cada frase (pelo começo do quadro)
      de: 0, ate: T.silencio, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, tc = ctx.corte(tg) + 0.06;
        d.fundo(g, L, COR.papel);
        for (const p of CAOS) pecaDoCaos(g, p, tg, ctx);
        // a bolinha vermelha gigante, no alto à direita, com "99+"
        const tb = W('alerta', 3) - 0.06;
        if (tg >= tb) {
          const r = 150 * u, pula = m.quica(tg, tb, 300, 10);
          g.save(); g.translate(S.direita - r - 10 * u, S.cy - 330 * u - r * 0.2); g.scale(pula, pula);
          d.ponto(g, 0, 0, r, COR.negativo);
          d.texto(g, '99+', 0, 6 * u, { tam: r * 0.8, peso: 700, cor: COR.cartao, alinhar: 'center', base: 'middle' });
          g.restore();
        }
        const fala = tc < EM.alerta - 0.06 ? ['gancho', GANCHO] : tc < W('alerta', 5) - 0.06 ? ['alerta', ALERTA] : ['alerta', MOTIVO];
        const [id, linhas] = fala, tam = (linhas.length > 2 ? 132 : 170) * u;
        const y0 = S.cy - 170 * u + (linhas.length > 2 ? 0 : 80 * u);
        // o quadro 0 é a miniatura: as duas primeiras linhas já estão lá
        const desloc = linhas.map(([, k], n) => m.revela(tg, (id === 'gancho' && n < 2 ? -0.4 + n * 0.06 : W(id, k) - 0.08)));
        d.textoRevelado(g, linhas.map(l => l[0]), S.x, y0, desloc, { tam, maxW: S.w });
      },
    },
    { // a noite: o caos some de uma vez; três frases, uma por fala, brancas no escuro
      de: T.silencio, ate: T.sol, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, tc = ctx.corte(tg) + 0.06;
        d.fundo(g, L, COR.noite);
        let i = 0;
        while (i + 1 < NOITE.length && EM[NOITE[i + 1][0]] - 0.06 <= tc) i++;
        const [id, linhas] = NOITE[i];
        const desloc = linhas.map(([, k]) => m.revela(tg, W(id, k) - 0.08));
        d.textoRevelado(g, linhas.map(l => l[0]), S.x, S.cy - 60 * u, desloc, { tam: 140 * u, cor: COR.noiteTinta, maxW: S.w });
      },
    },
    { // a virada: o horizonte, o sol nascendo, o símbolo que vira o "o" de toLive quando a voz diz "toLive"; embaixo,
      // "nasceu pro contrário: pra você viver fora da tela", com a voz. A música vira aqui
      de: T.sol, ate: T.pilares, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        d.fundo(g, L, COR.noite);
        const hLogo = Math.min(150 * u, (S.w * 0.8 * 72.1) / 289.2), sL = hLogo / 72.1, wLogo = 289.2 * sL;
        const grande = 340 * u, centro = S.cy - 260 * u, yGrande = centro - grande / 2;
        const xLogo = S.cx - wLogo / 2, yLogo = centro - hLogo / 2;
        const vira = m.anima(tg, T.vira, 0.6, m.CURVA.empurra);
        const tamFim = 92 * 0.612 * sL, xFim = xLogo + 43.5 * sL, yFim = yLogo + 14.3 * sL;
        d.simbolo(g, m.mix(S.cx - (grande * 100 / 92) / 2, xFim, vira), m.mix(yGrande, yFim, vira), m.mix(grande, tamFim, vira), {
          horizonte: m.anima(tg, T.sol - 0.08, 0.6, m.CURVA.forte),
          sol: m.anima(tg, T.solNasce, m.FILME.sol * 1.3, m.CURVA.forte),
          corHorizonte: COR.noiteTinta, corSol: COR.noiteSinal,
          tracoSol: m.mix(15, 17, vira), tracoHorizonte: m.mix(14, 16, vira),
        });
        const abre = m.anima(tg, EM.virada - 0.05, 0.5, m.CURVA.forte);
        if (abre > 0) {
          const meio = xFim + (tamFim * 100 / 92) / 2, meia = Math.max(meio - xLogo, xLogo + wLogo - meio) * abre;
          g.save(); g.beginPath(); g.rect(meio - meia, yLogo - 10 * u, meia * 2, hLogo + 20 * u); g.clip();
          d.imagem(g, ctx.img.letras, xLogo, yLogo, wLogo, { h: hLogo });
          g.restore();
        }
        const desloc = NASCEU.map(([, k]) => m.revela(tg, W('virada', k) - 0.08));
        d.textoRevelado(g, NASCEU.map(l => l[0]), S.cx, yLogo + hLogo + 200 * u, desloc, { tam: 100 * u, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
      },
    },
    { // as rotinas: "Rotinas de" e as quatro palavras, uma por palavra da voz; no "A gente cuida", a lista sai por
      // cima e a frase entra, com o ponto no "vive"
      de: T.pilares, ate: T.app, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        d.fundo(g, L, COR.papel);
        const sai = m.anima(tg, EM.cuida - 0.12, m.FILME.revela, m.CURVA.empurra);
        const yLista = S.cy - 150 * u;
        if (sai < 1) {
          const er = m.anima(tg, W('rotinas', 0) - 0.1, m.DUR.entrada, m.CURVA.forte) * (1 - sai);
          d.texto(g, 'Rotinas de', S.x, yLista - 150 * u + (1 - er) * 16 * u, { tam: 48 * u, peso: 500, cor: COR.tinta2, alfa: er });
          const desloc = ROTINAS.map(([, k]) => m.revela(tg, W('rotinas', k) - 0.08) - sai * 1.1);
          d.textoRevelado(g, ROTINAS.map(l => l[0]), S.x, yLista, desloc, { tam: 165 * u, maxW: S.w, entrelinha: 1.0 });
        }
        if (tg > EM.cuida - 0.2) {
          const desloc = CUIDA.map(([, k]) => m.revela(tg, W('cuida', k) - 0.08));
          d.textoRevelado(g, CUIDA.map(l => l[0]), S.x, S.cy - 30 * u, desloc, { tam: 165 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tg, W('cuida', 5) + 0.15, m.DUR.padrao, m.CURVA.forte) });
        }
      },
    },
    { // o Finanças como prova: "Nós começamos pelo dinheiro" e o aparelho chegando de lado, a tela se montando; no
      // "Você abre" o texto sai e o app toma o quadro; a câmera vai à decisão pronta; o dedo aperta no "decidir"; no
      // "fecha" a tela apaga e o aparelho desce. "É isso. O restante deixa conosco."
      de: T.app, ate: T.toly, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, tl = tg - T.app;
        d.fundo(g, L, COR.papel);
        const tAbre = EM.abre - T.app, tFoco = W('abre', 2) - T.app - 0.1, tToque = W('abre', 11) - T.app;
        const tApaga = W('abre', 14) - T.app, tDesce = tApaga + 0.35;
        // o título, saindo quando o app toma o quadro
        const sobe = m.anima(tl, tAbre - 0.1, m.FILME.revela, m.CURVA.empurra);
        if (sobe < 1) {
          const desloc = COMECA.map(([, k]) => m.revela(tg, W('comecamos', k) - 0.08) - sobe * 1.2);
          d.textoRevelado(g, COMECA.map(l => l[0]), S.x, S.y + 150 * u, desloc, { tam: 150 * u, maxW: S.w });
        }
        // o aparelho: largura do celular e a escala da tela (px do quadro por px do app)
        const wCel = Math.min(S.w * 0.62, 560 * u), s = (wCel * 0.93) / CELULAR.largura, hCel = CELULAR.altura * s + wCel * 0.07;
        const fx = CELULAR.largura / 2, fy = CELULAR.altura / 2;
        const embaixo = { rx: 8, ry: -14, escala: 0.82, x: S.cx + 40 * u, y: S.y + 420 * u + (hCel * 0.82) / 2, fx, fy };
        const entra = { ...embaixo, rx: 18, ry: -62, x: embaixo.x + L.W * 0.7 };
        const inteiro = { rx: 0, ry: 0, escala: Math.min(1.12, (S.h - 40 * u) / hCel), x: L.W / 2, y: S.cy, fx, fy };
        // o foco: da decisão pronta ("Uma coisa é sua") até o "você pode fechar o app" do rodapé, que a voz diz junto
        const zFoco = Math.min(S.h / (500 * s), (L.W * 1.02) / (CELULAR.largura * s));
        const foco = { rx: 4, ry: -6, escala: zFoco, x: L.W / 2, y: S.cy, fx, fy: 350 };
        const fora = { ...inteiro, rx: 34, ry: 6, y: L.H + hCel * 0.75 };
        const pose = m.poses(tl, [[-1, entra], [-0.05, embaixo, 1.0, m.CURVA.forte], [tAbre - 0.1, inteiro, 0.6], [tFoco, foco, 0.6], [tApaga - 0.2, inteiro, 0.45], [tDesce, fora, 0.5]]);
        if (tl < tDesce + 0.6) {
          g.save();
          if (sobe < 1) { const linha = m.mix(S.y + 360 * u, -20 * u, sobe); g.beginPath(); g.rect(-L.W, linha, L.W * 3, L.H * 2); g.clip(); }
          d.app3d(g, L, {
            cam: CELULAR, img: ctx.img, apelido: 'celular', w: wCel, t: tl + 0.1, pose,
            montagem: { passo: 0.09, dur: 0.6 },
            toque: { em: tToque }, apaga: m.anima(tl, tApaga, 0.14, m.CURVA.troca),
          });
          g.restore();
        }
        // "É isso." e "O restante deixa conosco.", com a voz, depois que o aparelho saiu
        if (tg > EM.isso - 0.2) {
          const ate = m.anima(tg, EM.restante - 0.12, m.FILME.revela, m.CURVA.empurra);
          if (ate < 1) d.textoRevelado(g, ISSO.map(l => l[0]), S.x, S.cy - 120 * u, ISSO.map(([, k]) => m.revela(tg, W('isso', k) - 0.08) - ate * 1.1), { tam: 190 * u, maxW: S.w });
          if (tg > EM.restante - 0.2) {
            const desloc = RESTANTE.map(([, k]) => m.revela(tg, W('restante', k) - 0.08));
            d.textoRevelado(g, RESTANTE.map(l => l[0]), S.x, S.cy - 120 * u, desloc, { tam: 165 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tg, FIM('restante') - 0.1, m.DUR.padrao, m.CURVA.forte) });
          }
        }
      },
    },
    { // o Toly: "Só te chama quando a decisão é sua"; o cartão sobe e se monta; o dedo aperta "Agora não" e o cartão
      // responde ("Tudo bem. Não pergunto de novo este mês."). No "sem sequência, sem medalha", a frase de cima vira
      // a chama e a medalha do começo, riscadas
      de: T.toly, ate: T.fim, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, tl = tg - T.toly;
        d.fundo(g, L, COR.papel);
        const troca = m.anima(tg, W('decisao', 12) - 0.14, m.FILME.revela, m.CURVA.empurra);
        const yTit = S.y + 140 * u;
        if (troca < 1) {
          const desloc = DECISAO.map(([, k]) => m.revela(tg, W('decisao', k) - 0.08) - troca * 1.2);
          d.textoRevelado(g, DECISAO.map(l => l[0]), S.x, yTit, desloc, { tam: 120 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tg, W('decisao', 11), m.DUR.padrao, m.CURVA.forte) * (1 - troca) });
        }
        // a rima: o ícone do caos, a frase, e o risco passando por cima do ícone
        SEM.forEach(([frase, k, icone], n) => {
          const t0 = W('decisao', k) - 0.08;
          if (tg < t0 - 0.05) return;
          const y = yTit + n * 160 * u, s = 1.15 * u, x = S.x + 50 * s;
          const e = m.anima(tg, t0, m.FILME.revela, m.CURVA.forte);
          g.save(); g.globalAlpha *= e; (icone === 'chama' ? chama : medalha)(g, COR, x, y - 30 * u + (1 - e) * 30 * u, s); g.restore();
          d.textoRevelado(g, [frase], S.x + 130 * u, y, [m.revela(tg, t0)], { tam: 100 * u, maxW: S.w - 130 * u });
          const risco = m.anima(tg, t0 + 0.25, 0.3, m.CURVA.forte);
          if (risco > 0) {
            g.save(); g.strokeStyle = COR.tinta; g.lineWidth = 10 * u; g.lineCap = 'round';
            g.beginPath(); g.moveTo(x - 52 * s, y - 30 * u + 52 * s); g.lineTo(x - 52 * s + 104 * s * risco, y - 30 * u + 52 * s - 104 * s * risco); g.stroke(); g.restore();
          }
        });
        // o cartão do Toly
        const wCard = S.w * 0.96, sC = wCard / TOLY.largura, hCard = TOLY.altura * sC;
        const fx = TOLY.largura / 2, fy = TOLY.altura / 2;
        const lugar = { rx: 0, ry: 0, escala: 1, x: S.cx, y: S.y + 560 * u + hCard / 2, fx, fy };
        const entra = { ...lugar, rx: 52, ry: 10, y: L.H + hCard * 0.6 };
        const pose = m.poses(tl, [[-1, entra], [0.0, lugar, 0.9, m.CURVA.forte]]);
        const tToque = W('decisao', 9) - T.toly;
        d.app3d(g, L, {
          cam: TOLY, img: ctx.img, apelido: 'toly', w: wCard, t: tl, pose, montagem: { passo: 0.12, dur: 0.6 },
          toque: { em: tToque }, depois: { cam: TOLY_DEPOIS, apelido: 'toly2', em: tToque + 0.16 },
        });
      },
    },
    { // o fim: a noite, o logo com o sol nascendo, "Tecnologia pra você viver" com a voz, os dias grátis do
      // catálogo em letra grande e o convite. Parado no fim
      de: T.fim, ate: DURACAO, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR, catalogo } = ctx, u = L.u, S = L.seguro;
        d.fundo(g, L, COR.noite);
        const hLogo = 110 * u, td = catalogo.testeDestaque, tamFrase = 104 * u;
        const tamTeste = td ? 180 * u : 0;
        const alturaBloco = hLogo + 110 * u + tamFrase * 1.84 + (td ? 90 * u + tamTeste * 1.84 + 90 * u : 0) + 110 * u;
        const yLogo = Math.max(S.y, S.cy - alturaBloco / 2);
        const eLogo = m.anima(tg, T.fim, m.DUR.entrada, m.CURVA.forte);
        d.logoComSol(g, ctx.img.logo, S.cx, yLogo + (1 - eLogo) * 20 * u, hLogo, { alfa: eLogo, sol: m.anima(tg, T.fim + 0.3, m.FILME.sol * 1.3, m.CURVA.forte), corSol: COR.noiteSinal, alinhar: 'center' });
        const yFrase = yLogo + hLogo + 110 * u + tamFrase * 0.8;
        const df = VIVER.map(([, k]) => m.revela(tg, W('viver', k) - 0.08));
        const rf = d.textoRevelado(g, VIVER.map(l => l[0]), S.cx, yFrase, df, { tam: tamFrase, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
        let yCta = yFrase + rf.h + 30 * u;
        if (td) {
          const k = td.grande.lastIndexOf(' '), linhas = [td.grande.slice(0, k), td.grande.slice(k + 1)];
          const yTeste = yFrase + rf.h - rf.tam * 0.92 + 90 * u + tamTeste * 0.8;
          const dl = [m.revela(tg, T.teste), m.revela(tg, T.teste + 0.1)];
          const r = d.textoRevelado(g, linhas, S.cx, yTeste, dl, { tam: tamTeste, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
          const eResto = m.anima(tg, T.teste + 0.25, m.DUR.entrada, m.CURVA.forte);
          const yResto = yTeste + r.h - r.tam * 0.92 + 80 * u;
          if (td.resto) d.texto(g, td.resto, S.cx, yResto + (1 - eResto) * 14 * u, { tam: 42 * u, peso: 500, cor: COR.noiteTinta2, alinhar: 'center', alfa: eResto });
          yCta = yResto + 55 * u;
        }
        const eCta = m.anima(tg, T.teste + 0.45, m.DUR.entrada, m.CURVA.forte);
        d.pilula(g, 'Comece em tolive.app', S.cx, yCta + (1 - eCta) * 16 * u, { tam: 40 * u, fundo: COR.papel, cor: COR.tinta, alinhar: 'center', alfa: eCta });
      },
    },
  ],
};

// a música entra no silêncio e vira no "toLive": no filme acelerado, a virada dela (musica.virada s depois do começo
// do trecho cortado) cai em T.musica / 4/3, e ela chega T.musica − musicaEm antes disso
const viradaNaFaixa = musica.inicio + musica.virada;
export default acelerar(filme, VELOCIDADE, { musicaInicio: +(viradaNaFaixa - (T.musica - filme.som.musicaEm) / VELOCIDADE).toFixed(3) });
