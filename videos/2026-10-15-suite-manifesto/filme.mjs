// toLive · "Manifesto" · reels · versão 2 · a voz do Sidney manda na linha do tempo, a música na grade depois da virada
// O roteiro (fechado com o Sidney em 15/10/2026, roteiro.md): a tecnologia que prende (o caos, liberado só aqui) →
// o silêncio da noite → o sol nasce e vira o logo ("A toLive nasceu pro contrário") → as rotinas que a gente cuida e
// a família lá fora → o Finanças como prova (abre, a decisão pronta, fecha) → o Toly que só chama quando a decisão é
// sua → sem sequência, sem medalha (o caos do começo, riscado) → "Tecnologia pra você viver", o logo e o mote.
//
// Versão 2 (Sidney, 15/10/2026, a primeira "nota 6": "muito acelerada pro padrão da música e o tom da voz", "pouca
// câmera, 3D; esperava mais elegância, sutileza mas com movimentos", "muito branco", os efeitos "estourando"): no tempo
// da voz (sem acelerar), uma câmera em toda cena (desenho.filmar: a cena num plano 3D que chega inclinado e assenta
// devagar), a noite depois do caos, a foto da família no "você vive", o fim só com o logo e o mote, os efeitos baixos.
// Pintar é função pura de t: o caos também (cada peça tem a hora dela; o confete é balística, com semente).

import musica from './musica.json' with { type: 'json' };
import narr from './narracao.json' with { type: 'json' };
import { assetsDasCamadas } from '../../estudio/camadas.mjs';
import { semente } from '../../estudio/movimento.mjs';
import camCelular from '../../assets/capturas/camadas/celular-tolive/camadas.json' with { type: 'json' };
import camToly from '../../assets/capturas/camadas/toly-balao/camadas.json' with { type: 'json' };
import camTolyDepois from '../../assets/capturas/camadas/toly-balao-depois/camadas.json' with { type: 'json' };

const BPM = musica.bpm;
const B = n => (n * 60) / BPM;

// a voz: EM[id] = a hora do filme em que a primeira palavra da fala entra; W(id, k), a palavra k; FIM(id), o fim
const FALA = Object.fromEntries(narr.falas.map(f => [f.id, f]));
const EM = {};
const W = (id, k) => EM[id] + FALA[id].palavras[k].i - FALA[id].palavras[0].i;
const FIM = id => EM[id] + FALA[id].palavras.at(-1).f - FALA[id].palavras[0].i;

// a linha do tempo, na ordem da voz, com respiro entre as falas
const T = {};
EM.gancho = 0.1;
EM.alerta = FIM('gancho') + 0.4;
T.silencio = FIM('alerta') + 0.35;           // o caos corta seco: noite e silêncio
EM.surge = T.silencio + 0.7;
EM.nenhum = FIM('surge') + 0.45;
EM.todas = FIM('nenhum') + 0.45;
T.sol = FIM('todas') + 0.5;                  // o horizonte se desenha, o sol nasce, o símbolo vira o logo
T.solNasce = T.sol + 0.35; T.vira = T.sol + 1.4;
EM.virada = T.vira + 0.35;                   // "A toLive" quando as letras se abrem
T.musica = EM.virada;                        // a virada da música
const naBatida = t => T.musica + Math.round((t - T.musica) / B(1)) * B(1);
T.pilares = naBatida(FIM('virada') + 0.5);
EM.rotinas = T.pilares + 0.15;
T.foto = naBatida(FIM('rotinas') + 0.3);     // a família lá fora, no "A gente cuida e você vive"
EM.cuida = T.foto + 0.35;
T.app = naBatida(FIM('cuida') + 0.6);
EM.comecamos = T.app + 0.5;                  // o aparelho chega antes da voz
EM.abre = FIM('comecamos') + 0.35;
EM.isso = FIM('abre') + 0.6;
EM.restante = FIM('isso') + 0.35;
T.toly = naBatida(FIM('restante') + 0.55);
EM.decisao = T.toly + 0.5;
T.viver = naBatida(FIM('decisao') + 0.6);
EM.viver = T.viver + 0.3;
T.logo = FIM('viver') + 0.5;                 // a frase sai, o logo e o sol, o mote só escrito
T.mote = T.logo + 0.9;
const DURACAO = +(T.mote + 0.6 + 2.0).toFixed(2); // o fim parado: 2 s

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
const MOTE = ['Tecnologia feita', 'para não ser usada'];

// a tela do site (o celular do toLive na comparação: "Uma coisa é sua. O resto está resolvido."), num aparelho; o
// dedo aperta "Ver a conta" no "decidir"
const CELULAR = { ...camCelular, semAparelho: false, uso: { alvo: { x: 34, y: 337.7, w: 99, h: 38 }, tocar: 'Ver a conta' } };
// o Toly: o "Agora não" apertado e o cartão de depois ("Tudo bem. Não pergunto de novo este mês."); cada peça troca
// no lugar (nada se pareia entre os dois estados)
const noLugar = (cam, pre) => ({ ...cam, pecas: cam.pecas.map(p => ({ ...p, tipo: 'texto', texto: `${pre}${p.i}`, conteudo: `${pre}${p.i}` })) });
const TOLY = { ...noLugar(camToly, 'a'), uso: { alvo: { x: 143, y: 190, w: 106, h: 44 }, tocar: 'Agora não' } };
const TOLY_DEPOIS = noLugar(camTolyDepois, 'd');

// A câmera das cenas de texto: chega inclinada (de um lado diferente a cada cena) e assenta devagar, sem passar do
// lugar; depois fica parada. de = { rx, ry, escala } de onde vem; dur, quanto leva.
const chega = (m, tl, de, dur = 1.8) => m.poses(tl, [[-1, { rx: de.rx ?? 0, ry: de.ry ?? 0, escala: de.escala ?? 0.97 }], [0, { rx: 0, ry: 0, escala: 1 }, dur, m.CURVA.forte]]);

// O caos (só o gancho e o problema; o Sidney liberou: "gosto do caos visual no começo"): bolinhas vermelhas com
// número, avisos que descem, a chama da sequência, a medalha, confete. Cada peça tem a hora dela; a densidade cresce
// até o corte. Em duas profundidades (atrás e na frente da frase), nas faixas de cima e de baixo. Nada de marca de
// ninguém: tudo genérico.
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
  const n = 46, ate = T.silencio - 0.4;
  const tipos = ['bolinha', 'aviso', 'bolinha', 'chama', 'aviso', 'bolinha', 'medalha', 'confete'];
  for (let i = 0; i < n; i++) {
    const t = -2.2 + (ate + 2.2) * Math.pow(i / (n - 1), 0.85); // umas dez já no quadro 0 (a miniatura)
    lista.push({ i, t, tipo: tipos[i % tipos.length], cima: i % 2 === 0, frente: i % 3 === 0, fx: r(), fy: r(), escala: 0.75 + r() * 0.5, numero: [3, 7, 12, 28, 99][Math.floor(r() * 5)], aviso: AVISOS[i % AVISOS.length], cor: Math.floor(r() * 4), seed: Math.floor(r() * 1e6) });
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

// a foto (CC0, assets/fotos/LICENCAS.md): cobre o quadro, com o pai e a filha um pouco à direita do centro
function fotoCobrindo(g, L, img, { centroX = 0.6 } = {}) {
  const s = Math.max(L.W / img.naturalWidth, L.H / img.naturalHeight), w = img.naturalWidth * s, h = img.naturalHeight * s;
  const x = Math.min(0, Math.max(L.W - w, L.W / 2 - centroX * w));
  g.drawImage(img, x, (L.H - h) / 2, w, h);
}

export default {
  id: '2026-10-15-suite-manifesto',
  titulo: 'Tecnologia pra você viver melhor',
  produto: 'suite',
  duracao: DURACAO,
  bpm: BPM,
  poster: T.vira + 1.6,
  musica: { antes: 5, depois: 8, compassos: 17 },
  previa: {
    de: 0, ate: DURACAO, titulo: 'O filme inteiro, com a sua voz',
    texto: 'Em qualidade de rascunho (meia resolução). No tempo da sua voz, sem acelerar; a câmera em toda cena.',
  },
  // a narração gravada (narracao.json): cada fala, a hora em que entra no filme e o que a tela escreve com ela
  narracao: narr.falas.map((f, k, todas) => ({ id: f.id, de: +EM[f.id].toFixed(2), ate: +(k + 1 < todas.length ? EM[todas[k + 1].id] : DURACAO).toFixed(2), texto: f.texto.trim(), nota: 'gravada' })),
  quadros: [
    { id: 'caos-2', t: W('alerta', 4), nome: 'O caos: a tecnologia que prende, em profundidade', texto: 'Bolinhas, avisos, chama, medalha, confete · "Mais um alerta"' },
    { id: 'noite-2', t: W('nenhum', 4), nome: 'A noite: o silêncio depois do caos', texto: NOITE.map(n => n[1].map(l => l[0]).join(' ')).join(' · ') },
    { id: 'sol-2', t: T.pilares - 0.25, nome: 'O sol nasce e vira o logo', texto: 'toLive · ' + NASCEU.map(l => l[0]).join(' ') },
    { id: 'rotinas-2', t: T.foto - 0.2, nome: 'As rotinas, na noite', texto: ROTINAS.map(l => l[0]).join(' · ') },
    { id: 'cuida-2', t: T.app - 0.2, nome: 'A gente cuida e você vive: a família lá fora (foto CC0)', texto: CUIDA.map(l => l[0]).join(' ') },
    { id: 'app-2', t: W('abre', 12), nome: 'O Finanças: a decisão pronta, o toque', texto: 'Uma coisa é sua · O resto está resolvido · "Ver a conta"' },
    { id: 'restante-2', t: T.toly - 0.2, nome: 'O restante deixa conosco, na noite', texto: RESTANTE.map(l => l[0]).join(' ') },
    { id: 'toly-2', t: W('decisao', 12) - 0.1, nome: 'O Toly: só chama quando a decisão é sua', texto: '"Agora não" → "Tudo bem. Não pergunto de novo este mês."' },
    { id: 'sem-2', t: T.viver - 0.2, nome: 'Sem sequência, sem medalha (o caos riscado)', texto: SEM.map(l => l[0]).join(' · ') },
    { id: 'fim-2', t: DURACAO - 0.2, nome: 'O fim: o logo e o mote', texto: 'toLive · Tecnologia feita para não ser usada' },
  ],
  assets: {
    ...assetsDasCamadas('celular', CELULAR),
    ...assetsDasCamadas('toly', TOLY),
    ...assetsDasCamadas('toly2', TOLY_DEPOIS),
    foto: 'assets/fotos/negative-space-pai-e-filha.jpg',
    logo: 'marca/logo/logo-escuro.svg#sem-sol',
    letras: 'marca/logo/logo-escuro.svg#so-letras',
  },
  som: {
    musica: musica.arquivo,
    inicio: +(musica.inicio + musica.virada - (T.musica - (EM.surge - 0.5))).toFixed(3), // a virada dela no "toLive"
    musicaEm: EM.surge - 0.5,  // a música chega no silêncio da noite; o caos é só aviso
    musicaSobe: 1.6,
    fimDe: 2.6,
    volumeEfeitos: 0.16,       // os efeitos por baixo (Sidney: "muito alto, estourando"); a trilha dos efeitos vem a −1 dBFS
    volumeMusica: 0.6,
    narracao: { arquivo: narr.arquivo, falas: narr.falas.map(f => ({ de: f.de, ate: f.ate, em: +(EM[f.id] - (f.palavras[0].i - f.de)).toFixed(3) })) },
    sons: [
      // o caos: cada peça que chega toca (o aviso, do lado de onde ela aparece), crescendo devagar
      ...CAOS.filter(p => p.t >= 0).map(p => ({ t: p.t, tipo: p.tipo === 'confete' ? 'passa' : p.tipo === 'chama' || p.tipo === 'medalha' ? 'bate' : 'aviso', vol: 0.25 + 0.3 * (p.t / T.silencio), pan: p.fx * 1.2 - 0.6 })),
      { t: W('alerta', 3) - 0.02, tipo: 'aviso', vol: 0.7, pan: 0.4 },
      // a virada
      { t: T.sol - 0.1, tipo: 'entra', vol: 0.4 },
      { t: EM.virada - 0.05, tipo: 'assenta', vol: 0.6 },
      // a foto; o app chega pela direita, o toque, a tela apaga; o Toly e o toque; o fim
      { t: T.foto - 0.1, tipo: 'passa', vol: 0.35 },
      { t: T.app - 0.1, tipo: 'entra', vol: 0.45, pan: 0.6 },
      { t: W('abre', 11), tipo: 'toque', vol: 0.6 },
      { t: W('abre', 14), tipo: 'assenta', vol: 0.45 },
      { t: T.toly + 0.1, tipo: 'entra', vol: 0.45 },
      { t: W('decisao', 9), tipo: 'toque', vol: 0.6 },
      ...SEM.map(([, k]) => ({ t: W('decisao', k) + 0.15, tipo: 'passa', vol: 0.3 })),
      { t: T.logo - 0.05, tipo: 'assenta', vol: 0.5 },
    ],
  },

  fundo(g, t, { L, d, COR }) { d.fundo(g, L, COR.noite); },

  cenas: [
    { // o gancho e o problema: a frase da voz, grande, e o caos crescendo em volta, em duas profundidades; a câmera
      // muda de lado em cada frase e para. A bolinha vermelha gigante no "bolinha vermelha"
      de: 0, ate: T.silencio, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, tc = ctx.corte(tg) + 0.06;
        d.fundo(g, L, COR.papel);
        const pose = m.poses(tg, [[-1, { rx: 6, ry: -10, escala: 1.03 }], [EM.alerta - 0.15, { rx: -4, ry: 8, escala: 1.0 }, 1.0, m.CURVA.forte], [W('alerta', 5) - 0.15, { rx: 3, ry: -4, escala: 0.98 }, 1.0, m.CURVA.forte]]);
        const fala = tc < EM.alerta - 0.06 ? ['gancho', GANCHO] : tc < W('alerta', 5) - 0.06 ? ['alerta', ALERTA] : ['alerta', MOTIVO];
        const [id, linhas] = fala, tam = (linhas.length > 2 ? 132 : 170) * u;
        const y0 = S.cy - 170 * u + (linhas.length > 2 ? 0 : 80 * u);
        // o quadro 0 é a miniatura: as duas primeiras linhas já estão lá
        const desloc = linhas.map(([, k], n) => m.revela(tg, (id === 'gancho' && n < 2 ? -0.4 + n * 0.06 : W(id, k) - 0.08)));
        const tb = W('alerta', 3) - 0.06;
        d.filmar(g, L, pose, [
          { z: -360, pintar: k => { for (const p of CAOS) if (!p.frente) pecaDoCaos(k, p, tg, ctx); } },
          { z: 0, pintar: k => d.textoRevelado(k, linhas.map(l => l[0]), S.x, y0, desloc, { tam, maxW: S.w }) },
          { z: 200, pintar: k => {
            for (const p of CAOS) if (p.frente) pecaDoCaos(k, p, tg, ctx);
            if (tg >= tb) { // a bolinha vermelha gigante, no alto à direita, com "99+"
              const r = 150 * u, pula = m.quica(tg, tb, 300, 10);
              k.save(); k.translate(S.direita - r - 10 * u, S.cy - 330 * u - r * 0.2); k.scale(pula, pula);
              d.ponto(k, 0, 0, r, COR.negativo);
              d.texto(k, '99+', 0, 6 * u, { tam: r * 0.8, peso: 700, cor: COR.cartao, alinhar: 'center', base: 'middle' });
              k.restore();
            }
          } },
        ]);
      },
    },
    { // a noite: o caos some de uma vez; três frases, uma por fala, brancas no escuro, cada uma chegando de um lado
      de: T.silencio, ate: T.sol, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, tc = ctx.corte(tg) + 0.06;
        let i = 0;
        while (i + 1 < NOITE.length && EM[NOITE[i + 1][0]] - 0.06 <= tc) i++;
        const [id, linhas] = NOITE[i];
        const lados = [{ ry: 12, rx: 3 }, { ry: -10, rx: -3 }, { ry: 8, rx: -4 }];
        const pose = chega(m, tg - (i === 0 ? EM.surge - 0.4 : EM[id] - 0.06), { ...lados[i], escala: 0.96 }, 2.2);
        const desloc = linhas.map(([, k]) => m.revela(tg, W(id, k) - 0.08, 0.5));
        d.filmar(g, L, pose, k => d.textoRevelado(k, linhas.map(l => l[0]), S.x, S.cy - 60 * u, desloc, { tam: 140 * u, cor: COR.noiteTinta, maxW: S.w }));
      },
    },
    { // a virada: o horizonte, o sol nascendo, o símbolo que vira o "o" de toLive quando a voz diz "toLive"; embaixo,
      // "nasceu pro contrário: pra você viver fora da tela", com a voz. A câmera sobe com o sol. A música vira aqui
      de: T.sol, ate: T.pilares, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        const hLogo = Math.min(150 * u, (S.w * 0.8 * 72.1) / 289.2), sL = hLogo / 72.1, wLogo = 289.2 * sL;
        const grande = 340 * u, centro = S.cy - 260 * u, yGrande = centro - grande / 2;
        const xLogo = S.cx - wLogo / 2, yLogo = centro - hLogo / 2;
        const pose = m.poses(tg, [[-1, { rx: -9, ry: 0, escala: 0.92 }], [T.sol, { rx: 0, ry: 0, escala: 1 }, 3.2, m.CURVA.forte]]);
        d.filmar(g, L, { ...pose, fy: centro }, k => {
          const vira = m.anima(tg, T.vira, 0.8, m.CURVA.empurra);
          const tamFim = 92 * 0.612 * sL, xFim = xLogo + 43.5 * sL, yFim = yLogo + 14.3 * sL;
          d.simbolo(k, m.mix(S.cx - (grande * 100 / 92) / 2, xFim, vira), m.mix(yGrande, yFim, vira), m.mix(grande, tamFim, vira), {
            horizonte: m.anima(tg, T.sol - 0.08, 0.9, m.CURVA.forte),
            sol: m.anima(tg, T.solNasce, m.FILME.sol * 1.8, m.CURVA.forte),
            corHorizonte: COR.noiteTinta, corSol: COR.noiteSinal,
            tracoSol: m.mix(15, 17, vira), tracoHorizonte: m.mix(14, 16, vira),
          });
          const abre = m.anima(tg, EM.virada - 0.05, 0.7, m.CURVA.forte);
          if (abre > 0) {
            const meio = xFim + (tamFim * 100 / 92) / 2, meia = Math.max(meio - xLogo, xLogo + wLogo - meio) * abre;
            k.save(); k.beginPath(); k.rect(meio - meia, yLogo - 10 * u, meia * 2, hLogo + 20 * u); k.clip();
            d.imagem(k, ctx.img.letras, xLogo, yLogo, wLogo, { h: hLogo });
            k.restore();
          }
          const desloc = NASCEU.map(([, j]) => m.revela(tg, W('virada', j) - 0.08, 0.5));
          d.textoRevelado(k, NASCEU.map(l => l[0]), S.cx, yLogo + hLogo + 200 * u, desloc, { tam: 100 * u, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
        });
      },
    },
    { // as rotinas: "Rotinas de" e as quatro palavras, uma por palavra da voz, num plano que chega de lado e endireita
      // devagar. Depois, a família lá fora (a foto, que a câmera deixa ver aos poucos): "A gente cuida e você vive"
      de: T.pilares, ate: T.app, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, tc = ctx.corte(tg);
        if (tc < T.foto) {
          const yLista = S.cy - 150 * u;
          const pose = chega(m, tg - T.pilares, { ry: 22, rx: 5, escala: 0.95 }, 3.0);
          d.filmar(g, L, { ...pose, fx: S.x, fy: S.cy, x: S.x }, k => {
            const er = m.anima(tg, W('rotinas', 0) - 0.1, m.DUR.expressivo, m.CURVA.forte);
            d.texto(k, 'Rotinas de', S.x, yLista - 150 * u + (1 - er) * 16 * u, { tam: 48 * u, peso: 500, cor: COR.noiteTinta2, alfa: er });
            const desloc = ROTINAS.map(([, j]) => m.revela(tg, W('rotinas', j) - 0.08, 0.45));
            d.textoRevelado(k, ROTINAS.map(l => l[0]), S.x, yLista, desloc, { tam: 165 * u, maxW: S.w, entrelinha: 1.0, cor: COR.noiteTinta });
          });
          return;
        }
        // a foto: a câmera abre devagar (do pai e da filha pro caminho todo) e para; a noite por cima, rala, pra o
        // texto ler. Um laranja só: o sol da foto (a frase fica sem o ponto)
        const tf = tg - T.foto;
        const pose = m.poses(tf, [[-1, { rx: 0, ry: 0, escala: 1.14 }], [0, { rx: 0, ry: 0, escala: 1.02 }, 3.6, m.CURVA.forte]]);
        d.filmar(g, L, { ...pose, fx: L.W * 0.58, fy: L.H * 0.5, x: L.W * 0.58 }, k => {
          fotoCobrindo(k, L, ctx.img.foto);
          k.globalAlpha = 0.38; k.fillStyle = COR.noite; k.fillRect(0, 0, L.W, L.H); k.globalAlpha = 1;
        });
        const desloc = CUIDA.map(([, j]) => m.revela(tg, W('cuida', j) - 0.08, 0.5));
        d.textoRevelado(g, CUIDA.map(l => l[0]), S.x, S.base - 260 * u, desloc, { tam: 150 * u, cor: COR.noiteTinta, maxW: S.w });
      },
    },
    { // o Finanças como prova, na noite: o aparelho chega de longe e de lado, a tela se monta; "Nós começamos pelo
      // dinheiro"; no "Você abre" ele vira de frente e toma o quadro; a câmera vai à decisão pronta; o dedo aperta no
      // "decidir"; no "fecha" a tela apaga e o aparelho desce e sai. "É isso. O restante deixa conosco."
      de: T.app, ate: T.toly, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, tl = tg - T.app;
        const tAbre = EM.abre - T.app, tFoco = W('abre', 2) - T.app - 0.1, tToque = W('abre', 11) - T.app;
        const tApaga = W('abre', 14) - T.app;
        // o título, saindo quando o app toma o quadro
        const sobe = m.anima(tl, tAbre - 0.15, 0.5, m.CURVA.empurra);
        if (sobe < 1) {
          const desloc = COMECA.map(([, j]) => m.revela(tg, W('comecamos', j) - 0.08, 0.5) - sobe * 1.2);
          d.filmar(g, L, chega(m, tl - 0.3, { ry: 10, rx: 3, escala: 0.97 }, 2.0), k => d.textoRevelado(k, COMECA.map(l => l[0]), S.x, S.y + 150 * u, desloc, { tam: 150 * u, maxW: S.w, cor: COR.noiteTinta }));
        }
        // o aparelho: largura do celular e a escala da tela (px do quadro por px do app)
        const wCel = Math.min(S.w * 0.62, 560 * u), s = (wCel * 0.93) / CELULAR.largura, hCel = CELULAR.altura * s + wCel * 0.07;
        const fx = CELULAR.largura / 2, fy = CELULAR.altura / 2;
        const embaixo = { rx: 10, ry: -20, escala: 0.82, x: S.cx + 40 * u, y: S.y + 420 * u + (hCel * 0.82) / 2, fx, fy };
        const entra = { ...embaixo, rx: 30, ry: -52, escala: 0.55, x: embaixo.x + 260 * u, y: embaixo.y + 380 * u };
        const inteiro = { rx: 3, ry: 9, escala: Math.min(1.12, (S.h - 40 * u) / hCel), x: L.W / 2, y: S.cy, fx, fy };
        const zFoco = Math.min(S.h / (500 * s), (L.W * 1.02) / (CELULAR.largura * s));
        const foco = { rx: -3, ry: -6, escala: zFoco, x: L.W / 2, y: S.cy, fx, fy: 350 };
        const fora = { ...inteiro, rx: 48, ry: -6, escala: 0.8, y: L.H + 900 * u }; // a tela apagada desce e sai
        const pose = m.poses(tl, [[-1, entra], [0, embaixo, 1.8, m.CURVA.forte], [tAbre - 0.15, inteiro, 1.1, m.CURVA.empurra], [tFoco, foco, 1.2, m.CURVA.empurra], [tApaga - 0.5, inteiro, 0.8], [tApaga + 0.3, fora, 1.1, m.CURVA.empurra]]);
        if (tl < tApaga + 2.0) {
          g.save();
          g.globalAlpha = 1 - m.anima(tl, tApaga + 0.35, 0.7, m.CURVA.chegada); // apagada, ela desce e some
          if (sobe < 1) { const linha = m.mix(S.y + 360 * u, -20 * u, sobe); g.beginPath(); g.rect(-L.W, linha, L.W * 3, L.H * 2); g.clip(); }
          d.app3d(g, L, {
            cam: CELULAR, img: ctx.img, apelido: 'celular', w: wCel, t: tl + 0.1, pose, cor: COR.noiteBorda,
            montagem: { passo: 0.12, dur: 0.8 },
            toque: { em: tToque }, apaga: m.anima(tl, tApaga, 0.3, m.CURVA.troca),
          });
          g.restore();
        }
        // "É isso." e "O restante deixa conosco.", com a voz, em cima, enquanto o aparelho vai embora
        if (tg > EM.isso - 0.2) {
          const ate = m.anima(tg, EM.restante - 0.15, 0.45, m.CURVA.empurra);
          d.filmar(g, L, chega(m, tg - EM.isso + 0.2, { ry: -8, rx: -3, escala: 0.97 }, 2.4), k => {
            if (ate < 1) d.textoRevelado(k, ISSO.map(l => l[0]), S.x, S.cy - 120 * u, ISSO.map(([, j]) => m.revela(tg, W('isso', j) - 0.08, 0.45) - ate * 1.1), { tam: 190 * u, maxW: S.w, cor: COR.noiteTinta });
            if (tg > EM.restante - 0.2) {
              const desloc = RESTANTE.map(([, j]) => m.revela(tg, W('restante', j) - 0.08, 0.45));
              d.textoRevelado(k, RESTANTE.map(l => l[0]), S.x, S.cy - 120 * u, desloc, { tam: 165 * u, maxW: S.w, cor: COR.noiteTinta, ponto: true, corPonto: COR.noiteSinal, pontoEscala: m.anima(tg, FIM('restante') - 0.1, m.DUR.padrao, m.CURVA.forte) });
            }
          });
        }
      },
    },
    { // o Toly, no papel (o dia): "Só te chama quando a decisão é sua"; o cartão vem de longe, inclinado, e assenta;
      // o dedo aperta "Agora não" e o cartão responde ("Tudo bem. Não pergunto de novo este mês."). No "sem sequência,
      // sem medalha", a frase de cima vira a chama e a medalha do começo, riscadas
      de: T.toly, ate: T.viver, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, tl = tg - T.toly;
        d.fundo(g, L, COR.papel);
        const troca = m.anima(tg, W('decisao', 12) - 0.14, 0.45, m.CURVA.empurra);
        const yTit = S.y + 140 * u;
        d.filmar(g, L, chega(m, tl - 0.3, { ry: 9, rx: 4, escala: 0.97 }, 2.6), k => {
          if (troca < 1) {
            const desloc = DECISAO.map(([, j]) => m.revela(tg, W('decisao', j) - 0.08, 0.45) - troca * 1.2);
            d.textoRevelado(k, DECISAO.map(l => l[0]), S.x, yTit, desloc, { tam: 120 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tg, W('decisao', 11), m.DUR.padrao, m.CURVA.forte) * (1 - troca) });
          }
          // a rima: o ícone do caos, a frase, e o risco passando por cima do ícone
          SEM.forEach(([frase, j, icone], n) => {
            const t0 = W('decisao', j) - 0.08;
            if (tg < t0 - 0.05) return;
            const y = yTit + n * 160 * u, s = 1.15 * u, x = S.x + 50 * s;
            const e = m.anima(tg, t0, 0.45, m.CURVA.forte);
            k.save(); k.globalAlpha *= e; (icone === 'chama' ? chama : medalha)(k, COR, x, y - 30 * u + (1 - e) * 30 * u, s); k.restore();
            d.textoRevelado(k, [frase], S.x + 130 * u, y, [m.revela(tg, t0, 0.45)], { tam: 100 * u, maxW: S.w - 130 * u });
            const risco = m.anima(tg, t0 + 0.3, 0.4, m.CURVA.forte);
            if (risco > 0) {
              k.save(); k.strokeStyle = COR.tinta; k.lineWidth = 10 * u; k.lineCap = 'round';
              k.beginPath(); k.moveTo(x - 52 * s, y - 30 * u + 52 * s); k.lineTo(x - 52 * s + 104 * s * risco, y - 30 * u + 52 * s - 104 * s * risco); k.stroke(); k.restore();
            }
          });
        });
        // o cartão do Toly
        const wCard = S.w * 0.96, sC = wCard / TOLY.largura, hCard = TOLY.altura * sC;
        const fx = TOLY.largura / 2, fy = TOLY.altura / 2;
        const lugar = { rx: 0, ry: 0, escala: 1, x: S.cx, y: S.y + 560 * u + hCard / 2, fx, fy };
        const tToque = W('decisao', 9) - T.toly;
        const pose = m.poses(tl, [[-1, { ...lugar, rx: 40, ry: -22, escala: 0.7, y: L.H + hCard * 0.3 }], [0, { ...lugar, rx: 9, ry: -12 }, 1.6, m.CURVA.forte], [tToque - 0.9, lugar, 0.9, m.CURVA.forte]]);
        d.app3d(g, L, {
          cam: TOLY, img: ctx.img, apelido: 'toly', w: wCard, t: tl, pose, montagem: { passo: 0.14, dur: 0.7 },
          toque: { em: tToque }, depois: { cam: TOLY_DEPOIS, apelido: 'toly2', em: tToque + 0.2 },
        });
      },
    },
    { // o fim: a noite, "Tecnologia pra você viver" com a voz; a frase sai, o logo com o sol nascendo e o mote, só
      // escrito (Sidney, 15/10/2026: "deixa só o toLive com o mote"). Parado no fim
      de: T.viver, ate: DURACAO, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        const sai = m.anima(tg, T.logo - 0.3, 0.5, m.CURVA.empurra);
        if (sai < 1) {
          const desloc = VIVER.map(([, j]) => m.revela(tg, W('viver', j) - 0.08, 0.5) - sai * 1.2);
          d.filmar(g, L, chega(m, tg - T.viver, { ry: -9, rx: 4, escala: 0.96 }, 2.4), k => d.textoRevelado(k, VIVER.map(l => l[0]), S.x, S.cy - 60 * u, desloc, { tam: 160 * u, cor: COR.noiteTinta, maxW: S.w }));
        }
        if (tg < T.logo - 0.2) return;
        const hLogo = 130 * u, tamMote = 92 * u;
        const yLogo = S.cy - (hLogo + 120 * u + tamMote * 1.84) / 2;
        const pose = m.poses(tg, [[-1, { rx: -6, ry: 0, escala: 0.95 }], [T.logo - 0.2, { rx: 0, ry: 0, escala: 1 }, 2.0, m.CURVA.forte]]);
        d.filmar(g, L, pose, k => {
          const eLogo = m.anima(tg, T.logo, m.DUR.expressivo, m.CURVA.forte);
          d.logoComSol(k, ctx.img.logo, S.cx, yLogo + (1 - eLogo) * 20 * u, hLogo, { alfa: eLogo, sol: m.anima(tg, T.logo + 0.35, m.FILME.sol * 1.6, m.CURVA.forte), corSol: COR.noiteSinal, alinhar: 'center' });
          const dm = MOTE.map((_, j) => m.revela(tg, T.mote + j * 0.15, 0.5));
          d.textoRevelado(k, MOTE, S.cx, yLogo + hLogo + 120 * u + tamMote * 0.8, dm, { tam: tamMote, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
        });
      },
    },
  ],
};
