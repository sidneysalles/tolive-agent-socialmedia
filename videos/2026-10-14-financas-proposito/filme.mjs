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
import narr from './narracao.json' with { type: 'json' };
import { assetsDasCamadas } from '../../estudio/camadas.mjs';
import { acelerar } from '../../estudio/acelerar.mjs';
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

// A narração (a voz do Sidney, 14/10/2026): narracao.json diz, no arquivo, onde cada fala começa e acaba e o tempo de
// cada palavra (estudio/narracao.mjs --medir). EM[id] é a hora do filme em que a primeira palavra da fala entra; as
// outras palavras vêm na mesma distância que têm na voz. As palavras puxam os cortes e o texto da tela, que escreve o
// que a voz diz (a fala e a imagem conectadas; e quem vê sem som lê a mesma coisa).
const FALA = Object.fromEntries(narr.falas.map(f => [f.id, f]));
const EM = {};
const W = (id, k) => EM[id] + FALA[id].palavras[k].i - FALA[id].palavras[0].i;              // quando a palavra k entra
const FIM = id => EM[id] + FALA[id].palavras.at(-1).f - FALA[id].palavras[0].i;            // quando a fala acaba

// o peso: uma palavra por fala, cortando seco, papel e noite alternando; depois a frase, uma linha por palavra. Só
// tarefas chatas: o "Susto no dia 30" saiu (Sidney, 14/10/2026: é outro problema, o do dinheiro que falta)
const PALAVRAS = [['Boleto'], ['Fatura'], ['Extrato'], ['Planilha'], ['Lembrete']];
const FRASE = [['Cada um', 0], ['pede um', 2], ['pedaço', 4], ['de você', 5]]; // [linha, palavra da voz que a puxa]
// a prova: cada feature na tela de verdade (dados simulados), com o plano da câmera dela, em px do app (390 × 844):
// entra = a pose de onde o aparelho chega; inteiro = o app todo à vista; foco = { fy, alto }: o centro e a altura do
// trecho que a câmera enquadra de perto. Com depois, o botão de cam.uso é apertado e a tela muda pra de depois.
// fala: [a palavra do título, a palavra em que a prova começa] na voz; a voz entra `voz` s depois do corte.
const FEATURES = [
  { titulo: ['Conecta'], prova: 'E lê seus bancos pelo Open Finance.', apelido: 'contas', cam: camContas, fala: [1, 2], voz: -0.15,
    depois: { apelido: 'contas2', cam: camContasDepois },
    entra: { rx: 6, ry: -64, dx: 0.6 }, inteiro: { rx: 5, ry: -12 }, foco: { fy: 520, alto: 640, rx: 3, ry: -5 } },
  { titulo: ['Organiza'], prova: 'Seus lançamentos, aprendendo com você.', apelido: 'aprovar', cam: camAprovar, fala: [0, 1], voz: 0.05,
    depois: { apelido: 'aprovar2', cam: camAprovarDepois },
    entra: { rx: 58, ry: 4, dy: 0.5 }, inteiro: { rx: 8, ry: 10 }, foco: { fy: 440, alto: 760, rx: 5, ry: 4 } },
  { titulo: ['Avisa antes'], prova: 'Quando o mês vai estourar.', apelido: 'mes', cam: camMes, fala: [0, 2], voz: 0.05,
    graficos: true,
    entra: { rx: -52, ry: 8, dy: -0.35, escala: 1.15 }, inteiro: { rx: -6, ry: -10 }, foco: { fy: 420, alto: 470, rx: -3, ry: -4 } },
  { titulo: ['Projeta', 'seu ano'], prova: 'Antecipando os seus próximos 12 meses.', apelido: 'projecao', cam: camProjecao, fala: [0, 3], voz: 0.05,
    barras: true,
    entra: { rx: -42, ry: 22, dy: 0.25, escala: 0.55 }, inteiro: { rx: -10, ry: 12 }, foco: { fy: 150, alto: 300, rx: -14, ry: -10 } },
  { titulo: ['Acompanhe'], prova: 'Todo o seu patrimônio em um lugar só.', apelido: 'patrimonio', cam: camPatrimonio, fala: [0, 1], voz: 0.05,
    graficos: true,
    entra: { rx: 6, ry: 62, dx: -0.6 }, inteiro: { rx: 6, ry: 12 }, foco: { fy: 470, alto: 420, rx: 4, ry: 5 } },
];
// a promessa logo depois dos problemas responde a eles, com o logo inteiro (o símbolo vira o "o" de toLive na hora em
// que a voz diz "toLive"); o mote "Tecnologia feita para não ser usada" fica só no fim
const PROMESSA = [['Nosso app que', 2], ['te devolve', 5], ['tempo para viver', 7]];
const MOTE = ['Tecnologia feita', 'para não ser usada'];
const COMPASSOS_POR_FEATURE = 2;

// a linha do tempo: a abertura e a promessa seguem a voz; das features em diante, a grade da música (a virada no
// compasso 6), com cada fala na hora da cena dela
EM.abertura = 0;
EM.frase = 4.4;
const T = { frase: EM.frase - 0.06, sol: FIM('frase') + 0.08 };
T.solNasce = T.sol + 0.2; T.vira = T.sol + 0.95;
EM.promessa = T.vira + 0.35;                // "toLive" quando as letras se abrem
T.virada = C(6);
const inicioFeature = i => T.virada + C(i * COMPASSOS_POR_FEATURE);
FEATURES.forEach((f, i) => { EM[f.apelido] = inicioFeature(i) + f.voz; });
T.fecha = inicioFeature(FEATURES.length);   // a última tela fica de frente, apaga e a câmera entra nela
EM.fecha = T.fecha + 0.1;
T.apaga = FIM('fecha') + 0.05;              // a tela apaga logo depois do "app"
T.folha = T.fecha + B(5);                   // a noite que era a tela apagada: o fim
// o mote só escrito, sem voz (Sidney, 15/10/2026: dito no fim ficava sem sentido); a voz volta nos dias grátis
EM.mote = T.folha;                          // a fala gravada fica fora da mistura (som.narracao)
T.logo = T.folha; T.solFim = T.folha + 0.3; T.mote = T.folha + 0.95;
EM.teste = T.mote + 1.3;
T.teste = EM.teste; T.cta = FIM('teste') + 0.15;
const DURACAO = +(FIM('teste') + 1.9).toFixed(2); // o fim parado: o logo, o mote, os dias grátis e o convite
// dentro de uma feature (tempo local): a câmera vai ao detalhe, o dedo aperta na batida 5, o app confirma
const FOCO = 1.72, TOQUE = B(5), GRAFICO = 2.2;

// o enquadramento de cada feature (do layout: vale pra stories e feed)
function enquadrar(L, f, topoLivre, livreFoco) {
  const S = L.seguro, u = L.u;
  const semAparelho = Boolean(f.cam.semAparelho);
  const w = semAparelho ? S.w * 0.96 : Math.min(S.w * 0.6, 640 * u);
  const s = semAparelho ? w / f.cam.largura : (w * 0.93) / f.cam.largura;  // px do quadro por px do app
  const h = semAparelho ? f.cam.altura * s : f.cam.altura * s + w * 0.07;
  const livre = L.H - topoLivre - 40 * u;
  const escala = Math.min(1, livre / h);
  const inteiro = { ...f.inteiro, escala, x: S.cx, y: topoLivre + (h * escala) / 2, fx: f.cam.largura / 2, fy: f.cam.altura / 2 };
  // o foco: o trecho de f.foco.alto px do app ocupa 86% da altura que o texto compacto deixa livre, sem passar de 1,15
  // da largura (o celular pode vazar dos lados; o cartão do site não)
  const yLivre = livreFoco;
  const z = Math.min(((L.H - yLivre) * 0.86) / (f.foco.alto * s), (L.W * (semAparelho ? 0.94 : 1.15)) / (f.cam.largura * s));
  const foco = { rx: f.foco.rx, ry: f.foco.ry, escala: z, x: L.W / 2, y: (yLivre + L.H) / 2, fx: f.foco.fx ?? f.cam.largura / 2, fy: f.foco.fy };
  const e = f.entra;
  const entra = { rx: e.rx, ry: e.ry, escala: escala * (e.escala ?? 1), x: inteiro.x + (e.dx ?? 0) * L.W, y: inteiro.y + (e.dy ?? 0) * L.H, fx: inteiro.fx, fy: inteiro.fy };
  return { w, s, h, inteiro, foco, entra };
}

// o filme acelerado (Sidney, 15/10/2026: "dava pra renderizar acelerando em 1,25×"): 4/3 em vez de 1,25 porque, com
// a música no andamento dela, só 4/3 põe cada corte de feature numa batida (dois compassos viram um e meio); a música
// começa mais adiante pra a virada continuar na primeira feature
const VELOCIDADE = 4 / 3;

const filme = {
  id: '2026-10-14-financas-proposito',
  titulo: 'Tecnologia feita para não ser usada',
  produto: 'financas',
  duracao: DURACAO,
  bpm: BPM,
  poster: inicioFeature(1) + 3.3,
  // o que a música precisa ter (estudio/musicas.mjs corta cada candidata assim): compassos calmos antes da virada,
  // compassos depois dela, e quantos compassos o filme dura
  musica: { antes: 6, depois: 6, compassos: Math.ceil(DURACAO / C(1)) },
  // o trecho com movimento que vai pra aprovação (aprovacao.mjs previa): o filme inteiro, com a música e a voz
  previa: {
    de: 0, ate: DURACAO, titulo: 'O filme inteiro, com a sua voz',
    texto: 'Em qualidade de rascunho (meia resolução, sai em segundos). Agora 1,33× mais rápido, a voz junto (mesmo tom); 1,33 e não 1,25 porque é a velocidade em que cada corte de feature continua caindo numa batida da música, que segue no andamento dela. E o som de cada movimento (o passo do curso que tinha ficado pra trás): o celular que chega soa do lado de onde vem, a câmera que vai ao detalhe, o gráfico que se desenha, cada barra da projeção, a confirmação do app que pousa, o logo que se forma. O filme ficou com 31 s.',
  },
  // a narração gravada (narracao.json, medida no áudio): cada fala, a hora em que entra no filme e o que a tela
  // escreve com ela. estudio/narracao.mjs escreve o narracao.md a partir daqui.
  narracao: narr.falas.map((f, k, todas) => ({ id: f.id, de: +EM[f.id].toFixed(2), ate: +(k + 1 < todas.length ? EM[todas[k + 1].id] : DURACAO).toFixed(2), texto: f.texto, nota: f.id === 'mote' ? 'gravada e cortada: o mote fica só escrito' : 'gravada' })),
  // os quadros-chave que vão pra aprovação antes do render (estudio/aprovacao.mjs): cada cena já assentada. As
  // features têm dois: o app inteiro e o detalhe (depois do toque, quando há). Id novo = quadro novo na página.
  quadros: [
    { id: 'peso-n', t: W('abertura', 1) + 0.3, nome: 'O peso: uma palavra por fala', texto: PALAVRAS.map(l => l.join(' ')).join(' · ') },
    { id: 'frase-n', t: T.sol - 0.1, nome: 'A frase, linha por linha com a voz', texto: FRASE.map(l => l[0]).join(' ') },
    { id: 'promessa-n', t: T.virada - 0.25, nome: 'O sol nasce, o logo se forma com "toLive": a promessa', texto: 'toLive Finanças · ' + PROMESSA.map(l => l[0]).join(' ') },
    ...FEATURES.flatMap((f, i) => [
      { id: `f${i + 1}-inteiro-n`, t: inicioFeature(i) + 1.5, nome: `${f.titulo.join(' ')}: o app inteiro`, texto: `${f.titulo.join(' ')}. ${f.prova}` },
      { id: `f${i + 1}-foco-n`, t: inicioFeature(i) + C(2) - 0.3, nome: `${f.titulo.join(' ')}: ${f.depois ? 'o toque e a confirmação do app' : f.barras ? 'o gráfico subindo' : 'o detalhe'}, com o texto compacto`, texto: f.depois ? `Toque em "${f.cam.uso.tocar}"` : '' },
    ]),
    { id: 'fecha-n', t: T.apaga + 0.35, nome: 'A tela apaga: e pode fechar o app', texto: 'E pode fechar o app' },
    { id: 'fim-n', t: DURACAO - 0.2, nome: 'O fim: o logo, o mote, os dias grátis e o convite', texto: 'toLive Finanças · Tecnologia feita para não ser usada · o teste grátis do catálogo, grande · Comece em tolive.app' },
  ],
  assets: {
    ...Object.assign({}, ...FEATURES.flatMap(f => [assetsDasCamadas(f.apelido, f.cam), f.depois ? assetsDasCamadas(f.depois.apelido, f.depois.cam) : {}])),
    logo: 'marca/logo/logo-escuro.svg#sem-sol',
    letras: 'marca/logo/logo-escuro.svg#so-letras',
  },
  som: {
    musica: musica.arquivo,
    inicio: musica.inicio,
    fimDe: 2.2, // a música some no fim parado (ela não termina sozinha neste corte)
    volumeEfeitos: 0.45,
    volumeMusica: 0.6, // com a voz: a música uns 4 dB abaixo, e mais ~6 dB enquanto a voz fala (a voz e a música mediam o mesmo)
    // a voz: cada fala cortada no arquivo e posta na hora dela; a música baixa sob a voz
    narracao: { arquivo: narr.arquivo, falas: narr.falas.filter(f => f.id !== 'mote').map(f => ({ de: f.de, ate: f.ate, em: +(EM[f.id] - (f.palavras[0].i - f.de)).toFixed(3) })) },
    sons: [
      ...PALAVRAS.map((_, i) => ({ t: W('abertura', i), tipo: 'bate' })),
      ...FEATURES.slice(1).map((_, i) => ({ t: inicioFeature(i + 1) - 0.05, tipo: 'passa' })),
      ...FEATURES.flatMap((f, i) => (f.depois ? [{ t: inicioFeature(i) + TOQUE, tipo: 'toque' }, { t: inicioFeature(i) + TOQUE + 0.4, tipo: 'entra' }] : [])),
      // o som de cada movimento (o passo 9 do curso): o celular que chega (do lado de onde vem), a câmera que vai ao
      // detalhe, o gráfico que se desenha, cada barra que sobe, a confirmação que pousa, o logo que se forma, o mote
      ...FEATURES.flatMap((f, i) => {
        const ini = inicioFeature(i), lado = Math.max(-1, Math.min(1, f.entra.dx ?? 0));
        return [
          { t: ini - 0.1, tipo: 'entra', vol: 0.6, pan: lado },
          { t: ini + FOCO - 0.05, tipo: 'passa', vol: 0.4 },
          ...(f.graficos ? [{ t: ini + GRAFICO, tipo: 'troca', vol: 0.45 }] : []),
          ...(f.barras ? f.cam.pecas.map(p => ({ t: W(f.apelido, f.fala[1]) + p.i * (B(1) / 3), tipo: 'toque', vol: 0.5, pan: (p.x / f.cam.largura) * 1.2 - 0.6 })) : []),
          ...(f.depois ? [{ t: ini + TOQUE + 0.75, tipo: 'assenta', vol: 0.55 }] : []),
        ];
      }),
      { t: EM.promessa - 0.05, tipo: 'assenta', vol: 0.8 },
      { t: T.mote, tipo: 'assenta', vol: 0.45 },
      { t: T.apaga, tipo: 'toque' },
      { t: T.folha - 0.45, tipo: 'passa' },
      { t: T.teste, tipo: 'bate' },
    ],
  },

  fundo(g, t, { L, d, COR }) { d.fundo(g, L, COR.papel); },

  cenas: [
    { // o peso: cada palavra entra com a voz e corta seco na próxima; depois a frase, uma linha por palavra, com o ponto
      de: 0, ate: T.sol, desenhar(g, t, ctx) {
        const { L, d, m, COR } = ctx, u = L.u, S = L.seguro, ADIANTA = 0.06;
        const tc = ctx.corte(t) + ADIANTA; // corte seco: decide pelo começo do quadro
        let i = 0;
        while (i + 1 < PALAVRAS.length && W('abertura', i + 1) <= tc) i++;
        if (tc < T.frase) {
          const noite = i % 2 === 1, linhas = PALAVRAS[i];
          d.fundo(g, L, noite ? COR.noite : COR.papel);
          const desloc = linhas.map((_, k) => m.revela(t, (i === 0 ? -0.28 : W('abertura', i) - ADIANTA) + k * 0.05));
          d.textoRevelado(g, linhas, S.x, S.cy + 100 * u - (linhas.length - 1) * 130 * u, desloc, { tam: 300 * u, cor: noite ? COR.noiteTinta : COR.tinta, maxW: S.w });
        } else {
          const desloc = FRASE.map(([, k]) => m.revela(t, W('frase', k) - ADIANTA));
          d.textoRevelado(g, FRASE.map(l => l[0]), S.x, S.cy - 250 * u, desloc, { tam: 200 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(t, FIM('frase') - 0.1, m.DUR.padrao, m.CURVA.forte) });
        }
      },
    },
    { // a virada de chave: na noite, o horizonte corre e o sol nasce atrás dele; o símbolo encolhe até o lugar do "o"
      // e o "t" e o "Live" se abrem a partir dele quando a voz diz "toLive" (o logo inteiro); FINANÇAS; a promessa
      de: T.sol, ate: T.virada, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR, dominio } = ctx, u = L.u, S = L.seguro;
        d.fundo(g, L, COR.noite);
        // o logo (viewBox 289,2 × 72,1; o símbolo em translate(43.5 14.3) scale(0.612), traços 17/16)
        const hLogo = Math.min(150 * u, (S.w * 0.8 * 72.1) / 289.2), sL = hLogo / 72.1, wLogo = 289.2 * sL;
        // o logo e a promessa centrados juntos na área segura (o símbolo grande nasce no mesmo centro do logo)
        const grande = 340 * u, centro = S.cy - 230 * u, yGrande = centro - grande / 2;
        const xLogo = S.cx - wLogo / 2, yLogo = centro - hLogo / 2;
        const vira = m.anima(tg, T.vira, 0.6, m.CURVA.empurra);
        const tamFim = 92 * 0.612 * sL, xFim = xLogo + 43.5 * sL, yFim = yLogo + 14.3 * sL;
        const tam = m.mix(grande, tamFim, vira);
        d.simbolo(g, m.mix(S.cx - (grande * 100 / 92) / 2, xFim, vira), m.mix(yGrande, yFim, vira), tam, {
          horizonte: m.anima(tg, T.sol - 0.08, 0.6, m.CURVA.forte),
          sol: m.anima(tg, T.solNasce, m.FILME.sol * 1.3, m.CURVA.forte),
          corHorizonte: COR.noiteTinta, corSol: COR.noiteSinal,
          tracoSol: m.mix(15, 17, vira), tracoHorizonte: m.mix(14, 16, vira),
        });
        const abre = m.anima(tg, EM.promessa - 0.05, 0.5, m.CURVA.forte);
        if (abre > 0) { // as letras saem de trás do símbolo, pros dois lados
          const meio = xFim + (tamFim * 100 / 92) / 2, meia = Math.max(meio - xLogo, xLogo + wLogo - meio) * abre;
          g.save(); g.beginPath(); g.rect(meio - meia, yLogo - 10 * u, meia * 2, hLogo + 20 * u); g.clip();
          d.imagem(g, ctx.img.letras, xLogo, yLogo, wLogo, { h: hLogo });
          g.restore();
        }
        const eNome = m.anima(tg, W('promessa', 1) - 0.05, m.DUR.entrada, m.CURVA.forte);
        d.texto(g, 'Finanças', S.cx, yLogo + hLogo + 70 * u + (1 - eNome) * 14 * u, { tam: 40 * u, peso: 700, letra: 0.12, caixaAlta: true, cor: dominio('financas').horizonte, alinhar: 'center', alfa: eNome });
        const desloc = PROMESSA.map(([, k]) => m.revela(tg, W('promessa', k) - 0.08));
        d.textoRevelado(g, PROMESSA.map(l => l[0]), S.cx, yLogo + hLogo + 250 * u, desloc, { tam: 110 * u, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
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
          // o texto escreve o que a voz diz: o título entra na palavra dele e a prova logo junto (fica mais tempo na tela
          // pra quem vê sem som); quando a câmera vai ao detalhe, o texto sai e o app toma o quadro (Sidney, 15/10/2026:
          // a voz acompanha a fala; o texto pode sumir quando o zoom pede)
          const c = m.anima(tl, FOCO - 0.05, 0.6, m.CURVA.empurra);
          const sobe = m.anima(tl, FOCO - 0.05, m.FILME.revela, m.CURVA.empurra);
          const tTit = W(f.apelido, f.fala[0]) - 0.1;
          const desloc = f.titulo.map((_, k) => m.revela(tg, tTit + k * 0.06) - sobe * 1.2);
          const tit = d.textoRevelado(g, f.titulo, S.x, S.y + 150 * u, desloc, { tam: 170 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tg, tTit + 0.35, m.DUR.padrao, m.CURVA.forte) });
          const yProva = S.y + 150 * u + tit.h - tit.tam * 0.92 + 80 * u;
          const ep = m.anima(tg, tTit + 0.15, m.DUR.entrada, m.CURVA.forte) * (1 - m.anima(tl, FOCO - 0.1, 0.2, m.CURVA.saida));
          const prova = d.paragrafo(g, f.prova, S.x, yProva + (1 - ep) * 20 * u, { tam: 42 * u, peso: 500, cor: COR.tinta2, alfa: ep, maxW: S.w, entrelinha: 1.25 });
          const fundoTexto = yProva + prova.h - 42 * u * 0.9;
          // o plano: chega pelo ângulo dele, o app inteiro, o detalhe; na última, de frente e pra dentro da tela
          const q = enquadrar(L, f, fundoTexto + 30 * u, 0);
          const chaves = [[-1, q.entra], [-0.05, q.inteiro, 1.2, m.CURVA.forte], [FOCO, q.foco, 0.6]];
          if (ultima) {
            const frente = { rx: 0, ry: 0, escala: q.inteiro.escala * 0.92, x: S.cx, y: L.H * 0.6, fx: f.cam.largura / 2, fy: f.cam.altura / 2 };
            chaves.push([T.fecha - ini - 0.1, frente, 0.6], [T.folha - ini - 0.5, { ...frente, escala: 16, y: L.H / 2, x: L.W / 2 }, 0.5, m.CURVA.empurra]);
          }
          const pose = m.poses(tl, chaves);
          // "E pode fechar o app": com a última tela de frente, linha por linha com a voz; o ponto só depois que ela
          // apaga (um laranja por quadro)
          if (ultima && tg > T.fecha - 0.2) {
            const linhas = [['E pode fechar', 0], ['o app', 3]];
            const dl = linhas.map(([, k]) => m.revela(tg, W('fecha', k) - 0.08));
            d.textoRevelado(g, linhas.map(l => l[0]), S.x, S.y + 150 * u, dl, { tam: 150 * u, maxW: S.w, ponto: true, pontoEscala: m.anima(tg, T.apaga + 0.2, m.DUR.padrao, m.CURVA.forte) });
          }
          // enquanto o texto está na tela, o aparelho fica embaixo dele (recortado na linha); a linha sobe junto com o
          // texto saindo, até o app tomar o quadro
          const linha = m.mix(fundoTexto + 12 * u, -20 * u, c);
          g.save(); g.beginPath(); g.rect(-L.W, linha, L.W * 3, L.H * 2); g.clip();
          d.app3d(g, L, {
            cam: f.cam, img: ctx.img, apelido: f.apelido, w: q.w, t: tl + 0.05, pose,
            toque: f.depois ? { em: TOQUE } : undefined,
            depois: f.depois ? { ...f.depois, em: TOQUE + 0.16 } : undefined, // o dedo aperta, um instante, e o app responde
            graficos: f.graficos ? { em: GRAFICO, dur: 0.9 } : undefined,
            barras: f.barras ? { em: W(f.apelido, f.fala[1]) - ini, passo: B(1) / 3, dur: 0.45 } : undefined, // sobem com o "antecipando"
            apaga: ultima ? m.anima(tg, T.apaga, 0.12, m.CURVA.troca) : 0,
          });
          g.restore();
          g.restore();
        });
      },
    },
    { // o fim: a tela apagada virou a noite; o logo com o sol nascendo, o mote escrito, os dias grátis em letra grande
      // com a voz, o convite. A música termina aqui
      de: T.folha, ate: DURACAO, desenhar(g, t, ctx, tg) {
        const { L, d, m, COR, dominio, catalogo } = ctx, u = L.u, S = L.seguro;
        d.fundo(g, L, COR.noite);
        // o bloco todo (logo, mote, os dias grátis em duas linhas, o convite) centrado na área segura; os dias encolhem
        // se não couber (o feed)
        const hLogo = 110 * u, td = catalogo.testeDestaque, tamMote = 78 * u;
        const fixo = hLogo + 80 * u + 120 * u + tamMote * 1.84 + 92 * u + (td ? 175 * u : 0);
        const tamTeste = td ? Math.min(220 * u, (S.h - fixo - 40 * u) / 1.84) : 0;
        const alturaBloco = fixo + tamTeste * 1.84;
        const yLogo = Math.max(S.y, S.cy - alturaBloco / 2);
        const eLogo = m.anima(tg, T.logo, m.DUR.entrada, m.CURVA.forte);
        d.logoComSol(g, ctx.img.logo, S.cx, yLogo + (1 - eLogo) * 20 * u, hLogo, { alfa: eLogo, sol: m.anima(tg, T.solFim, m.FILME.sol * 1.3, m.CURVA.forte), corSol: COR.noiteSinal, alinhar: 'center' });
        const eNome = m.anima(tg, T.solFim + 0.4, m.DUR.entrada, m.CURVA.forte);
        d.texto(g, 'Finanças', S.cx, yLogo + hLogo + 80 * u + (1 - eNome) * 14 * u, { tam: 38 * u, peso: 700, letra: 0.12, caixaAlta: true, cor: dominio('financas').horizonte, alinhar: 'center', alfa: eNome });
        // o mote, só escrito (sem voz), em letra de veredito, logo depois do logo
        const yMote = yLogo + hLogo + 80 * u + 120 * u + tamMote * 0.8;
        const dm = MOTE.map((_, k) => m.revela(tg, T.mote + k * 0.12));
        const rm = d.textoRevelado(g, MOTE, S.cx, yMote, dm, { tam: tamMote, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
        // os dias grátis: a frase grande do fim (o pedido do Sidney: "precisa ser mais chamativo"), do catálogo
        let yCta = yMote + rm.h + 40 * u;
        if (td) {
          // "30 dias" / "grátis": a palavra final na segunda linha, em letra de veredito, com a voz
          const k = td.grande.lastIndexOf(' '), linhas = [td.grande.slice(0, k), td.grande.slice(k + 1)];
          const yTeste = yMote + rm.h - rm.tam * 0.92 + 80 * u + tamTeste * 0.8;
          const dl = [m.revela(tg, W('teste', 0) - 0.08), m.revela(tg, W('teste', 2) - 0.08)];
          const r = d.textoRevelado(g, linhas, S.cx, yTeste, dl, { tam: tamTeste, cor: COR.noiteTinta, alinhar: 'center', maxW: S.w });
          const eResto = m.anima(tg, W('teste', 3) - 0.08, m.DUR.entrada, m.CURVA.forte);
          const yResto = yTeste + r.h - r.tam * 0.92 + 95 * u;
          if (td.resto) d.texto(g, td.resto, S.cx, yResto + (1 - eResto) * 14 * u, { tam: 44 * u, peso: 500, cor: COR.noiteTinta2, alinhar: 'center', alfa: eResto });
          yCta = yResto + 60 * u;
        }
        const eCta = m.anima(tg, T.cta, m.DUR.entrada, m.CURVA.forte);
        d.pilula(g, 'Comece em tolive.app', S.cx, yCta + (1 - eCta) * 16 * u, { tam: 42 * u, fundo: COR.papel, cor: COR.tinta, alinhar: 'center', alfa: eCta });
      },
    },
  ],
};

export default acelerar(filme, VELOCIDADE, { musicaInicio: +(musica.inicio + T.virada * (1 - 1 / VELOCIDADE)).toFixed(3) });
