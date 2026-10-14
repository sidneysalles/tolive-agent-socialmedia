// toLive Finanças · "Propósito" · stories e feed · na grade da música escolhida
// A música vem de musica.json (a aprovada na página de aprovação: estudio/musicas.mjs --escolher): o arquivo, o
// andamento medido e onde ela começa, cortada pra ter cinco compassos calmos e a virada (a energia sobe) no compasso 5
// do filme. Trocar a música é trocar o musica.json: o andamento, os cortes e a duração vêm dele.
// Estrutura (Sidney, 14/10/2026: inspirador, como a Apple): o peso → o sol nascendo → as features na virada, nas telas
// do app de verdade, sendo usadas → a tela que apaga ("pode fechar o app") → o fim. O roteiro está em roteiro.md.
// Cada feature tem dois compassos e um plano de câmera (a segunda rodada de pedidos do Sidney, 14/10/2026): o app
// entra por um ângulo diferente, a câmera mostra o app inteiro, vai até um detalhe, e lá o botão é apertado e o app
// confirma (as telas de antes e de depois do toque são capturas de verdade). Pintar é função pura de t.

import musica from './musica.json' with { type: 'json' };
import { assetsDasCamadas } from '../../estudio/camadas.mjs';
import camContas from '../../assets/capturas/camadas/app-contas/camadas.json' with { type: 'json' };
import camContasDepois from '../../assets/capturas/camadas/app-contas-depois/camadas.json' with { type: 'json' };
import camAprovar from '../../assets/capturas/camadas/app-aprovar/camadas.json' with { type: 'json' };
import camAprovarDepois from '../../assets/capturas/camadas/app-aprovar-depois/camadas.json' with { type: 'json' };
import camMes from '../../assets/capturas/camadas/app-mes/camadas.json' with { type: 'json' };
import camProjecao from '../../assets/capturas/camadas/faz-projecao/camadas.json' with { type: 'json' };
import camPatrimonio from '../../assets/capturas/camadas/app-patrimonio/camadas.json' with { type: 'json' };

const BPM = musica.bpm;            // medido na faixa
const B = n => (n * 60) / BPM;     // batida n (0,51 s)
const C = n => B(n * 4);           // compasso n (2,04 s)

// o peso: uma palavra por batida, cortando seco, papel e noite alternando; a frase fica cinco batidas. Só tarefas
// chatas: o "Susto no dia 30" saiu (Sidney, 14/10/2026: é outro problema, o do dinheiro que falta, pra outro vídeo)
const PALAVRAS = [['Boleto'], ['Fatura'], ['Extrato'], ['Planilha'], ['Lembrete']];
const FRASE = ['Cada um', 'pede um', 'pedaço', 'de você'];
// a prova: cada feature na tela de verdade (dados simulados), com o plano da câmera dela, em px do app (390 × 844):
// entra = a pose de onde o aparelho chega; inteiro = o app todo à vista; foco = { fy, alto }: o centro e a altura do
// trecho que a câmera enquadra de perto. Com depois, o botão de cam.uso é apertado e a tela muda pra de depois.
const FEATURES = [
  { titulo: ['Conecta'], prova: 'Seus bancos pelo Open Finance. Só para ler.', apelido: 'contas', cam: camContas,
    depois: { apelido: 'contas2', cam: camContasDepois },
    entra: { rx: 6, ry: -64, dx: 0.6 }, inteiro: { rx: 5, ry: -12 }, foco: { fy: 520, alto: 640, rx: 3, ry: -5 } },
  { titulo: ['Organiza'], prova: 'Um lançamento por vez. Você só diz “certo”.', apelido: 'aprovar', cam: camAprovar,
    depois: { apelido: 'aprovar2', cam: camAprovarDepois },
    entra: { rx: 58, ry: 4, dy: 0.5 }, inteiro: { rx: 8, ry: 10 }, foco: { fy: 440, alto: 760, rx: 5, ry: 4 } },
  { titulo: ['Avisa antes'], prova: 'Quando o mês vai passar do limite, não depois.', apelido: 'mes', cam: camMes,
    graficos: true,
    entra: { rx: -52, ry: 8, dy: -0.35, escala: 1.15 }, inteiro: { rx: -6, ry: -10 }, foco: { fy: 420, alto: 470, rx: -3, ry: -4 } },
  { titulo: ['Projeta', 'o ano'], prova: 'Doze meses à vista, mantendo o seu ritmo.', apelido: 'projecao', cam: camProjecao,
    barras: true, manterTitulo: true,
    entra: { rx: -42, ry: 22, dy: 0.25, escala: 0.55 }, inteiro: { rx: -10, ry: 12 }, foco: { fy: 150, alto: 300, rx: -14, ry: -10 } },
  { titulo: ['Soma tudo'], prova: 'Contas e investimentos num número só.', apelido: 'patrimonio', cam: camPatrimonio,
    graficos: true,
    entra: { rx: 6, ry: 62, dx: -0.6 }, inteiro: { rx: 6, ry: 12 }, foco: { fy: 470, alto: 420, rx: 4, ry: 5 } },
];
// a promessa logo depois dos problemas responde a eles; o mote "Tecnologia feita para não ser usada" fica só no fim,
// depois do "Pode fechar o app" (Sidney, 14/10/2026: logo depois dos problemas ele ficava "nada a ver")
const PROMESSA = ['Tecnologia', 'que te devolve', 'tempo de vida'];
const COMPASSOS_POR_FEATURE = 2;
const T = { frase: B(PALAVRAS.length), sol: B(10), solNasce: B(11), promessa: B(14), virada: C(5) };
const inicioFeature = i => T.virada + C(i * COMPASSOS_POR_FEATURE);
T.fecha = inicioFeature(FEATURES.length);   // a última tela fica de frente, apaga e a câmera entra nela
T.folha = T.fecha + C(1);                   // a noite que era a tela apagada: o fim
T.logo = T.folha; T.solFim = T.folha + B(1); T.teste = T.folha + B(5); T.cta = T.folha + B(7);
const DURACAO = +(T.folha + B(10.4)).toFixed(2); // o fim parado: o logo, os dias grátis e o convite
// dentro de uma feature (tempo local): a câmera vai ao detalhe, o dedo aperta na batida 5, o app confirma
const FOCO = 1.72, TOQUE = B(5), GRAFICO = 2.2;

// o enquadramento de cada feature (do layout: vale pra stories e feed)
function enquadrar(L, f, topoLivre) {
  const S = L.seguro, u = L.u;
  const semAparelho = Boolean(f.cam.semAparelho);
  const w = semAparelho ? S.w * 0.96 : Math.min(S.w * 0.6, 640 * u);
  const s = semAparelho ? w / f.cam.largura : (w * 0.93) / f.cam.largura;  // px do quadro por px do app
  const h = semAparelho ? f.cam.altura * s : f.cam.altura * s + w * 0.07;
  const livre = L.H - topoLivre - 40 * u;
  const escala = Math.min(1, livre / h);
  const inteiro = { ...f.inteiro, escala, x: S.cx, y: topoLivre + (h * escala) / 2, fx: f.cam.largura / 2, fy: f.cam.altura / 2 };
  // o foco: o trecho de f.foco.alto px do app ocupa 86% da altura livre, sem passar de 1,15 da largura (o celular
  // pode vazar dos lados; o cartão do site não); com manterTitulo, o título fica e o foco é embaixo dele
  const yLivre = f.manterTitulo ? topoLivre : 0;
  const z = Math.min(((L.H - yLivre) * 0.86) / (f.foco.alto * s), (L.W * (semAparelho ? 0.94 : 1.15)) / (f.cam.largura * s));
  const foco = { rx: f.foco.rx, ry: f.foco.ry, escala: z, x: L.W / 2, y: (yLivre + L.H) / 2, fx: f.foco.fx ?? f.cam.largura / 2, fy: f.foco.fy };
  const e = f.entra;
  const entra = { rx: e.rx, ry: e.ry, escala: escala * (e.escala ?? 1), x: inteiro.x + (e.dx ?? 0) * L.W, y: inteiro.y + (e.dy ?? 0) * L.H, fx: inteiro.fx, fy: inteiro.fy };
  return { w, s, h, inteiro, foco, entra };
}

export default {
  id: '2026-10-14-financas-proposito',
  titulo: 'Tecnologia feita para não ser usada',
  produto: 'financas',
  duracao: DURACAO,
  bpm: BPM,
  poster: inicioFeature(1) + 3.3,
  // o que a música precisa ter (estudio/musicas.mjs corta cada candidata assim): compassos calmos antes da virada,
  // compassos depois dela, e quantos compassos o filme dura
  musica: { antes: 5, depois: 6, compassos: Math.ceil(DURACAO / C(1)) },
  // o trecho com movimento que vai pra aprovação (aprovacao.mjs previa): o filme inteiro, com a música escolhida
  previa: {
    de: 0, ate: DURACAO, titulo: 'O filme inteiro, com a Inspired',
    texto: 'Em qualidade de prévia (menor, mais leve). Agora sem o "Susto no dia 30" (outro problema, pra outro vídeo) e com "Tecnologia que te devolve tempo de vida" depois dos problemas; o mote fica só no fim. Antes disso, com os seus comentários: cada feature tem dois compassos e um plano de câmera (o app entra por um ângulo, aparece inteiro, a câmera vai ao detalhe); em Conecta e Organiza o dedo aperta o botão e o próprio app confirma (a barra que sobe de baixo, capturada de verdade); a projeção é o gráfico subindo, barra por barra; o manifesto virou a tela que apaga ("Pode fechar o app"); os dias grátis (do catálogo) ficaram em letra grande no fim. E os dois defeitos: as peças que sumiam (a ordem de pintura do 3D) e as que passavam por cima da borda (agora a tela recorta). Comente nos quadros abaixo; os de ids novos começam sem aprovação.',
  },
  // os quadros-chave que vão pra aprovação antes do render (estudio/aprovacao.mjs): cada cena já assentada. As
  // features têm dois: o app inteiro e o detalhe (depois do toque, quando há). Id novo = quadro novo na página.
  quadros: [
    { id: 'peso', t: B(0) + 0.35, nome: 'O peso: uma palavra por batida', texto: PALAVRAS.map(l => l.join(' ')).join(' · ') },
    { id: 'frase', t: T.sol - 0.2, nome: 'A frase', texto: FRASE.join(' ') },
    { id: 'promessa-2', t: T.virada - 0.25, nome: 'O sol nasce: a promessa', texto: PROMESSA.join(' ') },
    ...FEATURES.flatMap((f, i) => [
      { id: `f${i + 1}-inteiro`, t: inicioFeature(i) + 1.5, nome: `${f.titulo.join(' ')}: o app inteiro`, texto: `${f.titulo.join(' ')}. ${f.prova}` },
      { id: `f${i + 1}-foco`, t: inicioFeature(i) + C(2) - 0.3, nome: `${f.titulo.join(' ')}: ${f.depois ? 'o toque e a confirmação do app' : f.barras ? 'o gráfico subindo' : 'o detalhe'}`, texto: f.depois ? `Toque em "${f.cam.uso.tocar}"` : '' },
    ]),
    { id: 'fecha', t: T.fecha + B(3), nome: 'A tela apaga: pode fechar o app', texto: 'Pode fechar o app' },
    { id: 'fim-2', t: DURACAO - 0.2, nome: 'O fim: o logo, os dias grátis em destaque e o convite', texto: 'toLive Finanças · Tecnologia feita para não ser usada · o teste grátis do catálogo, grande · Comece em tolive.app' },
  ],
  assets: {
    ...Object.assign({}, ...FEATURES.flatMap(f => [assetsDasCamadas(f.apelido, f.cam), f.depois ? assetsDasCamadas(f.depois.apelido, f.depois.cam) : {}])),
    logo: 'marca/logo/logo-escuro.svg#sem-sol',
  },
  som: {
    musica: musica.arquivo,
    inicio: musica.inicio,
    fimDe: 2.2, // a música some no fim parado (ela não termina sozinha neste corte)
    volumeEfeitos: 0.35,
    sons: [
      ...PALAVRAS.map((_, i) => ({ t: B(i), tipo: 'bate' })),
      ...FEATURES.slice(1).map((_, i) => ({ t: inicioFeature(i + 1) - 0.05, tipo: 'passa' })),
      ...FEATURES.flatMap((f, i) => (f.depois ? [{ t: inicioFeature(i) + TOQUE, tipo: 'toque' }, { t: inicioFeature(i) + TOQUE + 0.4, tipo: 'entra' }] : [])),
      { t: T.fecha + B(2), tipo: 'toque' },
      { t: T.folha - 0.45, tipo: 'passa' },
      { t: T.teste, tipo: 'bate' },
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
    { // a virada da música: cinco features, dois compassos cada; a primeira corta seco, as outras empurram a anterior.
      // A última não sai: fica de frente, apaga, e a câmera entra na tela apagada (a noite do fim).
      de: T.virada, ate: T.folha + 0.05, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro;
        FEATURES.forEach((f, i) => {
          const ini = inicioFeature(i), prox = inicioFeature(i + 1), ultima = i === FEATURES.length - 1;
          if (tg < ini - m.FILME.empurra || (!ultima && tg > prox + m.FILME.empurra)) return;
          const entra = i === 0 ? 0 : (1 - m.anima(tg, ini - m.FILME.empurra * 0.5, m.FILME.empurra, m.CURVA.empurra)) * L.W;
          const sai = ultima ? 0 : -m.anima(tg, prox - m.FILME.empurra * 0.5, m.FILME.empurra, m.CURVA.empurra) * L.W;
          g.save(); g.translate(entra + sai, 0);
          d.fundo(g, L, COR.papel);
          const tl = tg - ini; // negativo enquanto a cena ainda está entrando
          // o título e a prova: entram com a cena e saem (pela máscara) quando a câmera vai ao detalhe
          const sobeTit = f.manterTitulo ? 0 : m.anima(tl, FOCO - 0.05, m.FILME.revela, m.CURVA.empurra);
          const desloc = f.titulo.map((_, k) => m.revela(tl, -0.12 + k * 0.06) - sobeTit * 1.2);
          const tit = d.textoRevelado(g, f.titulo, S.x, S.y + 150 * u, desloc, { tam: 170 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tl, 0.3, m.DUR.padrao, m.CURVA.forte) });
          const yProva = S.y + 150 * u + tit.h - tit.tam * 0.92 + 80 * u;
          const ep = m.anima(tl, 0.15, m.DUR.entrada, m.CURVA.forte) * (f.manterTitulo ? 1 : 1 - m.anima(tl, FOCO - 0.1, 0.2, m.CURVA.saida));
          const prova = d.paragrafo(g, f.prova, S.x, yProva + (1 - ep) * 24 * u, { tam: 42 * u, peso: 500, cor: COR.tinta2, alfa: ep, maxW: S.w, entrelinha: 1.25 });
          // o plano: chega pelo ângulo dele, o app inteiro, o detalhe; na última, de frente e pra dentro da tela
          const q = enquadrar(L, f, yProva + prova.h + 30 * u);
          const chaves = [[-1, q.entra], [-0.05, q.inteiro, 1.2, m.CURVA.forte], [FOCO, q.foco, 0.6]];
          if (ultima) {
            const frente = { rx: 0, ry: 0, escala: q.inteiro.escala * 0.92, x: S.cx, y: L.H * 0.6, fx: f.cam.largura / 2, fy: f.cam.altura / 2 };
            chaves.push([T.fecha - ini - 0.1, frente, 0.6], [T.folha - ini - 0.5, { ...frente, escala: 16, y: L.H / 2, x: L.W / 2 }, 0.5, m.CURVA.empurra]);
          }
          const pose = m.poses(tl, chaves);
          // "Pode fechar o app": com a última tela de frente; o ponto só depois que ela apaga (um laranja por quadro)
          if (ultima && tg > T.fecha - 0.2) {
            const linhas = ['Pode fechar', 'o app'];
            const dl = linhas.map((_, k) => m.revela(tg, T.fecha + 0.1 + k * 0.07));
            d.textoRevelado(g, linhas, S.x, S.y + 150 * u, dl, { tam: 150 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tg, T.fecha + B(2) + 0.2, m.DUR.padrao, m.CURVA.forte) });
          }
          d.app3d(g, L, {
            cam: f.cam, img: ctx.img, apelido: f.apelido, w: q.w, t: tl + 0.05, pose,
            toque: f.depois ? { em: TOQUE } : undefined,
            depois: f.depois ? { ...f.depois, em: TOQUE + 0.16 } : undefined, // o dedo aperta, um instante, e o app responde
            graficos: f.graficos ? { em: GRAFICO, dur: 0.9 } : undefined,
            barras: f.barras ? { em: 0.35, passo: B(1) / 3, dur: 0.45 } : undefined,
            apaga: ultima ? m.anima(tg, T.fecha + B(2), 0.12, m.CURVA.troca) : 0,
          });
          g.restore();
        });
      },
    },
    { // o fim: a tela apagada virou a noite; o sol nasce no logo (a assinatura), os dias grátis em letra grande, o
      // convite. A música termina aqui
      de: T.folha, ate: DURACAO, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR, dominio, catalogo } = ctx, u = L.u, S = L.seguro;
        d.fundo(g, L, COR.noite);
        // o bloco todo (logo, assinatura, os dias grátis em duas linhas, o convite) centrado na área segura
        const hLogo = 120 * u, td = catalogo.testeDestaque, tamTeste = 230 * u;
        const alturaBloco = hLogo + 300 * u + (td ? tamTeste * 1.84 + 175 * u : 0) + 92 * u;
        const yLogo = Math.max(S.y, S.cy - alturaBloco / 2);
        const eLogo = m.anima(tg, T.logo, m.DUR.entrada, m.CURVA.forte);
        d.logoComSol(g, ctx.img.logo, S.cx, yLogo + (1 - eLogo) * 20 * u, hLogo, { alfa: eLogo, sol: m.anima(tg, T.solFim, m.FILME.sol * 1.3, m.CURVA.forte), corSol: COR.noiteSinal, alinhar: 'center' });
        const eNome = m.anima(tg, T.solFim + 0.6, m.DUR.entrada, m.CURVA.forte);
        d.texto(g, 'Finanças', S.cx, yLogo + hLogo + 86 * u + (1 - eNome) * 14 * u, { tam: 40 * u, peso: 700, letra: 0.12, caixaAlta: true, cor: dominio('financas').horizonte, alinhar: 'center', alfa: eNome });
        const eAss = m.anima(tg, T.solFim + 0.7, m.DUR.entrada, m.CURVA.forte);
        ['Tecnologia feita', 'para não ser usada'].forEach((l, i) => d.texto(g, l, S.cx, yLogo + hLogo + 176 * u + i * 48 * u + (1 - eAss) * 14 * u, { tam: 30 * u, peso: 500, letra: 0.3, caixaAlta: true, cor: COR.noiteTinta2, alinhar: 'center', alfa: eAss }));
        // os dias grátis: a frase grande do fim (o pedido do Sidney: "precisa ser mais chamativo"), do catálogo
        let yCta = yLogo + hLogo + 300 * u;
        if (td) {
          // "30 dias" / "grátis": a palavra final na segunda linha, em letra de veredito
          const k = td.grande.lastIndexOf(' '), linhas = [td.grande.slice(0, k), td.grande.slice(k + 1)];
          const yTeste = yLogo + hLogo + 300 * u + tamTeste * 0.8;
          const dl = linhas.map((_, i) => m.revela(tg, T.teste - 0.06 + i * 0.07));
          const r = d.textoRevelado(g, linhas, S.cx, yTeste, dl, { tam: tamTeste, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
          const eResto = m.anima(tg, T.teste + 0.25, m.DUR.entrada, m.CURVA.forte);
          const yResto = yTeste + r.h - r.tam * 0.92 + 105 * u;
          if (td.resto) d.texto(g, td.resto, S.cx, yResto + (1 - eResto) * 14 * u, { tam: 46 * u, peso: 500, cor: COR.noiteTinta2, alinhar: 'center', alfa: eResto });
          yCta = yResto + 70 * u;
        }
        const eCta = m.anima(tg, T.cta, m.DUR.entrada, m.CURVA.forte);
        d.pilula(g, 'Comece em tolive.app', S.cx, yCta + (1 - eCta) * 16 * u, { tam: 42 * u, fundo: COR.papel, cor: COR.tinta, alinhar: 'center', alfa: eCta });
      },
    },
  ],
};
