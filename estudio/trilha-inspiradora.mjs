// A trilha "inspiradora" (decisão do Sidney, 14/10/2026: a calma do primeiro vídeo ficou "horrível"; a pegada é a
// dos filmes de produto da Apple). Estrutura de filme, em seções que o roteiro marca em compassos:
//   intro  piano em semínimas e colchão, sem bateria (o propósito, o tipo que bate)
//   sobe   o piano vira colcheias, entram os pratos; no último compasso, a subida (ruído que abre, palmas
//          adensando) e um respiro de uma colcheia antes da virada
//   cheio  a virada: bumbo nos quatro tempos, palmas no 2 e no 4, baixo pulsando, arpejo brilhante, o resto
//          "respirando" com o bumbo (sidechain). É onde entram as features
//   fim    o acorde da tônica soando, sem bateria, e some junto com o quadro parado
// Tudo determinístico (ruído com semente), estéreo, em Ré maior. Continua sendo síntese: pra um filme de
// lançamento de verdade, a música licenciada (som.musica no filme) ganha sempre.

import { semente } from './movimento.mjs';

const SR = 48000;
const midi = n => 440 * 2 ** ((n - 69) / 12);
const ACORDES = {
  I: [50, 57, 62, 66, 69], ii: [52, 59, 64, 67, 71], iii: [54, 61, 66, 69, 73],
  IV: [43, 55, 59, 62, 67], V: [45, 57, 61, 64, 69], vi: [47, 54, 59, 62, 66],
};

function lp(coef) { let y = 0; return x => (y += coef * (x - y)); }

export function sintetizarInspiradora({ bpm = 116, duracao, secoes = [{ ate: 2, tipo: 'intro' }, { ate: 4, tipo: 'sobe' }, { ate: 99, tipo: 'cheio' }], progressao = ['vi', 'IV', 'I', 'V'], fimDe = 1.8, seed = 11 }) {
  const n = Math.ceil(duracao * SR);
  const E = new Float32Array(n), D = new Float32Array(n), V = new Float32Array(n); // esquerda, direita, envio pro reverb
  const b = 60 / bpm, comp = 4 * b, total = Math.ceil(duracao / comp);
  const r = semente(seed), ruido = () => r() * 2 - 1;
  const tipoDo = c => (secoes.find(s => c < s.ate) ?? secoes.at(-1)).tipo;
  const acordeDo = c => (tipoDo(c) === 'fim' ? 'I' : progressao[c % progressao.length]);
  const bumbos = [];

  const pôr = (t0, dur, pan, envio, fn) => {
    const i0 = Math.floor(t0 * SR), m = Math.min(Math.floor(dur * SR), n - i0);
    const ge = Math.cos((pan + 1) * Math.PI / 4), gd = Math.sin((pan + 1) * Math.PI / 4);
    for (let i = 0; i < m; i++) { const v = fn(i / SR); E[i0 + i] += v * ge; D[i0 + i] += v * gd; V[i0 + i] += v * envio; }
  };

  // piano: parciais levemente inarmônicos, os agudos morrendo antes, um martelo curto no ataque
  const piano = (t0, nota, vel, dur, pan = 0) => {
    const f = midi(nota);
    const parciais = [1, 2, 3, 4, 5, 6].map(k => ({ f: f * k * Math.sqrt(1 + 0.0004 * k * k), a: 1 / k ** 1.4, d: 1.6 + k * 0.9 }));
    pôr(t0, dur, pan, 0.35, t => {
      let v = 0;
      for (const p of parciais) v += p.a * Math.exp(-t * p.d) * Math.sin(2 * Math.PI * p.f * t);
      return v * vel * Math.min(1, t / 0.003) * 0.06 * Math.min(1, (dur - t) / 0.05);
    });
  };
  const acorde = (t0, notas, vel, dur) => notas.slice(1).forEach((nota, k) => piano(t0 + k * 0.004, nota, vel, dur, (k - 2) * 0.18));

  for (let c = 0; c < total; c++) {
    const t0 = c * comp, tipo = tipoDo(c), notas = ACORDES[acordeDo(c)];
    if (t0 >= duracao) break;
    const ultimoDoSobe = tipo === 'sobe' && tipoDo(c + 1) !== 'sobe';

    // colchão: dentes de serra suaves (três harmônicos), desafinados em estéreo, abrindo no "cheio"
    const brilho = tipo === 'cheio' ? 0.35 : 0.12, volPad = tipo === 'intro' ? 0.012 : 0.016;
    for (const [k, nota] of notas.slice(1).entries()) {
      for (const [lado, desaf] of [[-0.7, 0.997], [0.7, 1.003]]) {
        const f = midi(nota) * desaf, filtro = lp(brilho);
        const dur = tipo === 'fim' ? duracao - t0 : comp + 0.3;
        pôr(t0, dur, lado, 0.5, t => {
          const s = Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(4 * Math.PI * f * t) + 0.33 * Math.sin(6 * Math.PI * f * t);
          return filtro(s) * volPad * Math.min(1, t / 0.25) * Math.min(1, Math.max(0, (dur - t) / 0.3)) * (k === 0 ? 1.2 : 1);
        });
      }
    }

    // piano: semínimas na intro, colcheias depois (o pulso que empurra), o acorde inteiro no fim
    if (tipo === 'fim') acorde(t0, notas, 1.1, Math.max(0.1, duracao - t0));
    else {
      const passos = tipo === 'intro' ? 4 : 8, passo = comp / passos;
      for (let k = 0; k < passos; k++) {
        if (ultimoDoSobe && k === passos - 1) continue; // o respiro antes da virada
        acorde(t0 + k * passo, notas, (k % (passos / 4) === 0 ? 1 : 0.62) * (tipo === 'cheio' ? 1 : 0.85), passo * 1.6);
      }
      if (tipo === 'intro' && c % 2 === 0) piano(t0, notas[0] + 12, 1.2, comp);
    }

    // baixo: colcheias na raiz, saturado de leve
    if (tipo === 'cheio') {
      for (let k = 0; k < 8; k++) {
        const f = midi(notas[0] - 12);
        pôr(t0 + k * b / 2, b / 2, 0, 0, t => Math.tanh(2.2 * Math.sin(2 * Math.PI * f * t)) * Math.exp(-t * 5) * Math.min(1, t / 0.004) * 0.16);
      }
    }

    // bateria
    if (tipo === 'cheio' || tipo === 'sobe') {
      const tempos = tipo === 'cheio' ? [0, 1, 2, 3] : [0];
      for (const k of tempos) {
        const tk = t0 + k * b;
        if (ultimoDoSobe) continue;
        bumbos.push(tk);
        pôr(tk, 0.45, 0, 0, t => Math.sin(2 * Math.PI * (48 * t + 90 * (1 - Math.exp(-t * 28)) / 28)) * Math.exp(-t * 7.5) * 0.55 + (t < 0.004 ? ruido() * 0.2 : 0));
      }
      if (tipo === 'cheio') {
        for (const k of [1, 3]) {
          const hp = lp(0.5);
          pôr(t0 + k * b, 0.35, 0.1, 0.4, t => {
            const x = ruido(), banda = x - hp(x);
            const rajadas = [0, 0.011, 0.022].reduce((a, d) => a + (t >= d ? Math.exp(-(t - d) * (d < 0.02 ? 140 : 18)) : 0), 0);
            return banda * rajadas * 0.22;
          });
        }
      }
      // pratos: colcheias (no contratempo, no "cheio"); semicolcheias crescendo no último compasso da subida
      const passos = ultimoDoSobe ? 16 : 8;
      for (let k = 0; k < passos; k++) {
        if (tipo === 'cheio' && k % 2 === 0) continue;
        if (ultimoDoSobe && k >= 14) continue;
        const hp = lp(0.85), vel = ultimoDoSobe ? 0.25 + 0.75 * (k / passos) : 0.7;
        pôr(t0 + k * comp / passos, 0.09, (k % 2 ? 0.35 : -0.35), 0.05, t => { const x = ruido(); return (x - hp(x)) * Math.exp(-t * 45) * 0.11 * vel; });
      }
      // a subida: ruído que abre e palmas que adensam; o último oitavo fica em silêncio
      if (ultimoDoSobe) {
        const dur = comp - b / 2, abre = lp(0.01);
        let coef = 0.01;
        pôr(t0, dur, 0, 0.3, t => { coef = 0.01 + 0.5 * (t / dur) ** 2; const x = ruido(); return (abre(x) * (1 - coef) + x * coef) * (t / dur) ** 2 * 0.12; });
        for (let k = 0; k < 8; k++) {
          const tk = t0 + 2 * b + k * b / 4;
          if (tk >= t0 + comp - b / 2) break;
          const hp = lp(0.5);
          pôr(tk, 0.12, 0, 0.3, t => { const x = ruido(); return (x - hp(x)) * Math.exp(-t * 60) * (0.08 + 0.02 * k); });
        }
      }
    }

    // arpejo brilhante (semicolcheias, duas oitavas acima) só no "cheio"
    if (tipo === 'cheio') {
      const ordem = [1, 2, 3, 4, 3, 2, 4, 3];
      for (let k = 0; k < 16; k++) {
        const f = midi(notas[ordem[k % 8]] + 24);
        pôr(t0 + k * comp / 16, 0.25, (k % 2 ? 0.45 : -0.45), 0.4, t => Math.sin(2 * Math.PI * f * t + 0.8 * Math.exp(-t * 20) * Math.sin(2 * Math.PI * f * 2 * t)) * Math.exp(-t * 14) * 0.03);
      }
    }
  }

  // a virada: um impacto no primeiro tempo do primeiro "cheio" que vem depois de uma subida
  secoes.forEach((s, i) => {
    if (s.tipo !== 'cheio' || secoes[i - 1]?.tipo !== 'sobe') return;
    const tv = secoes[i - 1].ate * comp;
    if (tv >= duracao) return;
    const hp = lp(0.7);
    pôr(tv, 2.2, 0, 0.6, t => Math.sin(2 * Math.PI * (40 + 30 * Math.exp(-t * 6)) * t) * Math.exp(-t * 2.2) * 0.35 + (() => { const x = ruido(); return (x - hp(x)) * Math.exp(-t * 2.4) * 0.07; })());
  });

  // o "respiro" do sidechain: o que não é bateria abaixa um pouco a cada bumbo
  const duck = new Float32Array(n).fill(1);
  for (const tk of bumbos) {
    const i0 = Math.floor(tk * SR);
    for (let i = 0; i < 0.25 * SR && i0 + i < n; i++) duck[i0 + i] = Math.min(duck[i0 + i], 1 - 0.45 * Math.exp(-(i / SR) / 0.08));
  }

  // reverb estéreo (pentes diferentes em cada lado) sobre o envio
  const sala = (atrasos) => {
    const out = new Float32Array(n);
    const pentes = atrasos.map(a => ({ buf: new Float32Array(a), i: 0 }));
    let fb = 0;
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (const p of pentes) { const y = p.buf[p.i]; fb = y * 0.6 + fb * 0.4; p.buf[p.i] = V[i] + fb * 0.78; p.i = (p.i + 1) % p.buf.length; s += y; }
      out[i] = s / pentes.length;
    }
    return out;
  };
  const RE = sala([1693, 1759, 1621, 1543]), RD = sala([1723, 1787, 1601, 1567]);
  for (let i = 0; i < n; i++) {
    const t = i / SR, env = Math.min(1, t / 0.02) * Math.min(1, Math.max(0, (duracao - t) / fimDe));
    E[i] = (E[i] * duck[i] + RE[i] * 0.3) * env;
    D[i] = (D[i] * duck[i] + RD[i] * 0.3) * env;
  }
  return [E, D];
}
