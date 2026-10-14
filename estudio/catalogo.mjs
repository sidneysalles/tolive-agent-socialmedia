// Os planos, os preços e o teste grátis do vídeo vêm da conta toLive, nunca do código (a mesma decisão do
// site, Sidney, 14/10/2026): GET conta.tolive.app/api/publico/planos?app=financas. A última resposta boa fica em
// conhecimento/planos.json (com a data), e vale com a conta fora. Vídeo com preço é refeito quando o preço
// muda: o historico.mjs avisa quais.
//
//   node estudio/catalogo.mjs          atualiza conhecimento/planos.json e mostra o que o vídeo pode dizer

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { oQueDizer, reais } from './catalogo-navegador.mjs';

export const ENDERECO = 'https://conta.tolive.app/api/publico/planos?app=financas';
const ARQUIVO = new URL('../conhecimento/planos.json', import.meta.url);

export { oQueDizer, reais };

/** O catálogo guardado (ou vazio, se nunca houve resposta). */
export function guardado() {
  if (!existsSync(ARQUIVO)) return { lido_em: null, resposta: null };
  return JSON.parse(readFileSync(ARQUIVO, 'utf8'));
}

/** Pergunta à conta (5 s); guarda se veio bom. Devolve o guardado de qualquer jeito. */
export async function atualizar() {
  try {
    const r = await fetch(ENDERECO, { signal: AbortSignal.timeout(5000) });
    if (r.ok) {
      const resposta = await r.json();
      if (oQueDizer(resposta).planos.length) {
        writeFileSync(ARQUIVO, JSON.stringify({ lido_em: new Date().toISOString(), resposta }, null, 2) + '\n');
      }
    }
  } catch { /* a conta fora: vale o guardado */ }
  return guardado();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { lido_em, resposta } = await atualizar();
  if (!resposta) { console.log('A conta não respondeu e não há catálogo guardado: o vídeo não fala em preço nem em teste.'); process.exit(0); }
  const d = oQueDizer(resposta);
  console.log(`Lido em ${lido_em}`);
  for (const p of d.planos) console.log(`  ${p.titulo}: ${reais(p.centavos)} por mês${p.testeDias ? ` · ${p.testeDias} dias grátis` : ''}`);
  console.log(`\nO vídeo pode dizer: "${d.aPartirDe}"${d.teste ? ` e "${d.teste}"` : ' (sem teste grátis)'}.`);
}
