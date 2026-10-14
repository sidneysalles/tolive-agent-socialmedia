import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { oQueDizer, reais } from '../estudio/catalogo.mjs';
import { cobertura, fichas, produtos, velhos } from '../estudio/historico.mjs';
import { conferirVideo } from '../estudio/texto.mjs';
import { sintetizar, wav, SR } from '../estudio/som.mjs';
import { estimarBatidas, melhoresTrechos } from '../estudio/batidas.mjs';
import { readFileSync } from 'node:fs';

const CONTA = { planos: [
  { tipo: 'plano', codigo: 'ate2', titulo: 'Até 2 conexões', teste_dias: 30, valor_centavos: 1490, limite_conexoes: 2 },
  { tipo: 'plano', codigo: 'ate5', titulo: 'Até 5 conexões', teste_dias: 0, valor_centavos: 3190, limite_conexoes: 5 },
] };

test('o catálogo diz o que a conta diz (mesma regra do site)', () => {
  const d = oQueDizer(CONTA);
  assert.equal(d.menorPreco, 'R$ 14,90 por mês');
  assert.equal(d.teste, '30 dias grátis com até duas conexões');
  assert.equal(oQueDizer({ planos: CONTA.planos.map(p => ({ ...p, teste_dias: 30 })) }).teste, '30 dias grátis em qualquer plano');
  assert.equal(oQueDizer({ planos: CONTA.planos.map(p => ({ ...p, teste_dias: 0 })) }).teste, null);
  assert.deepEqual(oQueDizer(null), { planos: [], menorPreco: null, teste: null });
  assert.equal(reais(123456), 'R$ 1.234,56');
});

test('a cobertura conta só o que foi entregue, e acha o que nunca foi dito', () => {
  const lista = [
    { id: 'a', data: '2026-10-01', produto: 'financas', angulo: 'antes-depois', gancho: 'x', features: ['veredito'], status: 'entregue' },
    { id: 'b', data: '2026-10-02', produto: 'financas', angulo: 'vazamento', features: ['vazamentos'], status: 'rascunho' },
  ];
  const c = cobertura(lista, produtos()).financas;
  assert.equal(c.videos, 1);
  assert.ok(c.nunca.includes('vazamentos'), 'rascunho não é memória');
  assert.ok(!c.nunca.includes('veredito'));
  assert.ok(!c.angulosLivres.includes('antes-depois'));
});

test('vídeo com teste grátis velho aparece pra refazer', () => {
  const hoje = oQueDizer(CONTA);
  const lista = [
    { id: 'velho', usa: ['teste'], catalogo: { teste: '15 dias grátis em qualquer plano', menorPreco: 'R$ 14,90 por mês' } },
    { id: 'em-dia', usa: ['teste'], catalogo: { teste: hoje.teste, menorPreco: hoje.menorPreco } },
    { id: 'sem-preco', usa: [], catalogo: { teste: 'outro' } },
  ];
  assert.deepEqual(velhos(lista, hoje).map(f => f.id), ['velho']);
});

test('todo ângulo e feature de produtos.json tem id estável e prova', () => {
  for (const [chave, p] of Object.entries(produtos())) {
    assert.ok(p.nome.startsWith('toLive'), chave);
    for (const [id, f] of Object.entries(p.features)) {
      assert.match(id, /^[a-z0-9-]+$/); assert.ok(f.prova, `${chave}.${id} sem prova`);
      for (const c of f.captura) assert.ok(existsSync(new URL(`../assets/capturas/${c}.png`, import.meta.url)), `captura ${c} não existe`);
    }
    for (const id of Object.keys(p.angulos)) assert.match(id, /^[a-z0-9-]+$/);
  }
});

test('todo vídeo do repositório tem ficha válida, filme que carrega e texto na voz', async () => {
  const catalogo = produtos();
  const raiz = new URL('../', import.meta.url).pathname;
  for (const f of fichas(raiz)) {
    assert.ok(catalogo[f.produto], `${f.id}: produto ${f.produto}`);
    assert.ok(!f.angulo || catalogo[f.produto].angulos[f.angulo], `${f.id}: ângulo ${f.angulo}`);
    for (const id of f.features ?? []) assert.ok(catalogo[f.produto].features[id], `${f.id}: feature ${id}`);
    assert.ok(['rascunho', 'entregue', 'publicado', 'reprovado'].includes(f.status), `${f.id}: status ${f.status}`);
    if (f.status === 'reprovado') assert.ok(f.reprovado?.motivo, `${f.id}: reprovado sem o motivo (é o que a próxima pauta aprende)`);
    const filme = (await import(`../videos/${f.id}/filme.mjs`)).default;
    assert.ok(filme.duracao > 0 && filme.bpm > 0, f.id);
    for (const src of Object.values(filme.assets ?? {})) assert.ok(existsSync(join(raiz, src.replace(/#.*$/, ''))), `${f.id}: falta ${src}`);
    for (const s of filme.som?.sons ?? []) assert.ok(s.t >= 0 && s.t < filme.duracao, `${f.id}: som fora do filme em ${s.t}`);
    assert.deepEqual(conferirVideo(join(raiz, 'videos', f.id)).filter(a => a.nivel === 'erro'), [], f.id);
    if (filme.som?.musica) {
      // música de fora: o arquivo, a linha da licença (só CC0 ou CC BY servem pra vídeo) e o crédito na legenda
      const nome = filme.som.musica.split('/').pop();
      assert.ok(existsSync(join(raiz, filme.som.musica)), `${f.id}: falta ${filme.som.musica}`);
      const linha = readFileSync(join(raiz, 'assets/musicas/LICENCAS.md'), 'utf8').split('\n').find(l => l.includes(`\`${nome}\``));
      assert.ok(linha, `${f.id}: ${nome} sem a linha em assets/musicas/LICENCAS.md`);
      assert.match(linha, /CC0|CC BY \d/, `${f.id}: licença que não serve pra vídeo`);
      assert.doesNotMatch(linha, /\| CC BY[- ](?:ND|SA|NC)/, `${f.id}: ND, SA e NC não servem pra vídeo`);
      if (/CC BY/.test(linha)) assert.ok(readFileSync(join(raiz, 'videos', f.id, 'legenda.md'), 'utf8').includes(f.musica?.credito ?? '@@'), `${f.id}: o crédito da música (ficha.musica.credito) tem de estar na legenda`);
    }
  }
});

test('o melhor trecho da música põe a virada onde a energia sobe', () => {
  // 20 compassos: 8 calmos (−20 dB), 12 cheios (−10 dB); a virada é o compasso 8
  const energia = [...Array(8).fill(-20), ...Array(12).fill(-10)];
  const compassos = energia.map((_, i) => i * 2);
  const [melhor] = melhoresTrechos({ compassos, energia }, { antes: 4, depois: 6 });
  assert.equal(melhor.compasso, 8);
  assert.equal(melhor.inicio, 8);
  assert.equal(melhor.virada, 16);
  assert.ok(melhor.subida >= 9.9);
});

test('a trilha sintetizada tem a duração do filme, é determinística e a batida dela é medida certa', () => {
  const [a] = sintetizar({ bpm: 96, duracao: 8, sons: [{ t: 1, tipo: 'toque' }] });
  assert.equal(a.length, Math.ceil(8 * SR));
  assert.deepEqual(a.slice(48000, 48100), sintetizar({ bpm: 96, duracao: 8, sons: [{ t: 1, tipo: 'toque' }] })[0].slice(48000, 48100));
  let pico = 0;
  for (const v of a) pico = Math.max(pico, Math.abs(v));
  assert.ok(pico <= 0.9, `pico ${pico}`);
  assert.equal(wav([a, a]).toString('ascii', 0, 4), 'RIFF');
  // a 22050 Hz, como o batidas.mjs lê do ffmpeg
  const reamostrada = Float32Array.from({ length: Math.floor(a.length * 22050 / SR) }, (_, i) => a[Math.floor(i * SR / 22050)]);
  const { bpm, batidas } = estimarBatidas(reamostrada, 22050);
  assert.ok(Math.abs(bpm - 96) < 1.5, `mediu ${bpm}`);
  const fase = ((batidas[0] / (60 / 96)) % 1 + 1) % 1;
  assert.ok(fase < 0.1 || fase > 0.9, `a batida caiu fora do tempo (fase ${fase.toFixed(2)})`);
});

test('a trilha inspiradora cresce na virada, cai no fim e a batida dela é medida certa', () => {
  const comp = (4 * 60) / 116;
  const [E, D] = sintetizar({ estilo: 'inspiradora', bpm: 116, duracao: 10 * comp, secoes: [{ ate: 2, tipo: 'intro' }, { ate: 4, tipo: 'sobe' }, { ate: 8, tipo: 'cheio' }, { ate: 99, tipo: 'fim' }], sons: [{ t: 1, tipo: 'bate' }, { t: 9, tipo: 'passa' }] });
  assert.notDeepEqual(E.slice(200000, 200100), D.slice(200000, 200100), 'é estéreo');
  const db = c => { let s = 0, k = 0; for (let i = Math.floor(c * comp * SR); i < (c + 1) * comp * SR; i++) { s += E[i] ** 2; k++; } return 10 * Math.log10(s / k); };
  assert.ok(db(5) > db(0) + 4, `a virada (${db(5).toFixed(1)} dB) não cresce sobre a intro (${db(0).toFixed(1)} dB)`);
  assert.ok(db(9) < db(5) - 4, 'o fim não cai');
  const reamostrada = Float32Array.from({ length: Math.floor(E.length * 22050 / SR) }, (_, i) => E[Math.floor(i * SR / 22050)]);
  assert.ok(Math.abs(estimarBatidas(reamostrada, 22050).bpm - 116) < 2.5);
});

test('o novo-video cria a pasta com ficha, briefing e um filme que passa na voz', async () => {
  const { criarVideo } = await import('../estudio/novo-video.mjs');
  const raiz = mkdtempSync(join(tmpdir(), 'estudio-'));
  mkdirSync(join(raiz, 'videos'));
  const { pasta } = criarVideo({ produto: 'financas', angulo: 'vazamento', features: 'vazamentos,toly', palavras: 'Streaming|Academia|Nuvem', frase: 'Três assinaturas,paradas', data: '2026-01-01', raiz });
  assert.deepEqual(readdirSync(pasta).sort(), ['briefing.md', 'critica.md', 'ficha.json', 'filme.mjs', 'legenda.md', 'roteiro.md']);
  assert.deepEqual(conferirVideo(pasta).filter(a => a.nivel === 'erro'), []);
  const filme = (await import(join(pasta, 'filme.mjs'))).default;
  assert.ok(filme.assets['faz-vazamentos'] && filme.assets['toly-balao'], 'as capturas das features');
  assert.ok(filme.duracao > 15 && filme.duracao < 20, `duração ${filme.duracao}`);
  assert.throws(() => criarVideo({ produto: 'financas', angulo: 'vazamento', features: 'cancelar', raiz, data: '2026-01-02' }), /não tem captura/);
  assert.throws(() => criarVideo({ produto: 'financas', angulo: 'nao-existe', raiz }), /ângulo desconhecido/);
  assert.throws(() => criarVideo({ produto: 'cripto', angulo: 'x', raiz }), /produto desconhecido/);
});
