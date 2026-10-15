// A memória do que já foi dito: cada vídeo tem a sua videos/<id>/ficha.json (produto, ângulo, gancho,
// features, status, onde saiu); isto aqui junta todas e responde o que a próxima pauta precisa saber:
// o que já se falou de cada produto, o que nunca se falou, que gancho já foi usado, que vídeo ficou velho
// porque o preço ou o teste grátis mudou na conta, e o que foi reprovado e por quê (status "reprovado", com
// reprovado.motivo: não conta como dito, mas ensina).
//
//   node estudio/historico.mjs                 a lista e a cobertura de todos os produtos
//   node estudio/historico.mjs financas        só um produto (o que falta dizer vem primeiro)
//   node estudio/historico.mjs --json          tudo em JSON (pra uma skill ler)

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { guardado, oQueDizer } from './catalogo.mjs';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));

export function produtos() {
  return JSON.parse(readFileSync(join(RAIZ, 'conhecimento', 'produtos.json'), 'utf8')).produtos;
}

/** Todas as fichas, da mais nova pra mais velha. */
export function fichas(raiz = RAIZ) {
  const dir = join(raiz, 'videos');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(id => existsSync(join(dir, id, 'ficha.json')))
    .map(id => ({ id, ...JSON.parse(readFileSync(join(dir, id, 'ficha.json'), 'utf8')) }))
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : a.id < b.id ? 1 : -1));
}

/** O que já foi dito e o que falta, por produto. Só conta vídeo entregue ou publicado (rascunho não é memória). */
export function cobertura(lista, catalogo) {
  const contam = lista.filter(f => f.status === 'entregue' || f.status === 'publicado');
  return Object.fromEntries(Object.entries(catalogo).map(([chave, p]) => {
    const deste = contam.filter(f => f.produto === chave);
    // a feature conta também quando outro vídeo (o da marca) a usa como prova: "financas:veredito"
    const vezes = id => deste.filter(f => (f.features ?? []).includes(id)).length + contam.filter(f => (f.features ?? []).includes(`${chave}:${id}`)).length;
    const features = Object.keys(p.features).map(id => ({ id, nome: p.features[id].nome, vezes: vezes(id) }));
    const angulos = Object.keys(p.angulos).map(id => ({ id, vezes: deste.filter(f => f.angulo === id).length }));
    return [chave, {
      videos: deste.length,
      nunca: features.filter(f => !f.vezes).map(f => f.id),
      features: features.sort((a, b) => a.vezes - b.vezes),
      angulosLivres: angulos.filter(a => !a.vezes).map(a => a.id),
      ganchos: deste.map(f => f.gancho).filter(Boolean),
    }];
  }));
}

/** Os vídeos que dizem preço ou teste grátis diferente do que a conta diz hoje. */
export function velhos(lista, hoje = oQueDizer(guardado().resposta)) {
  return lista.filter(f => f.catalogo && ((f.catalogo.teste ?? null) !== (hoje.teste ?? null) || (f.catalogo.menorPreco ?? null) !== (hoje.menorPreco ?? null)) && (f.usa ?? []).some(u => u === 'teste' || u === 'preco'));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const lista = fichas(), catalogo = produtos();
  const so = process.argv.slice(2).find(a => !a.startsWith('--'));
  const cob = cobertura(lista, catalogo);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ videos: lista, cobertura: cob, velhos: velhos(lista).map(f => f.id) }, null, 2));
    process.exit(0);
  }
  console.log(`${lista.length} vídeo(s)\n`);
  for (const f of lista.filter(f => !so || f.produto === so)) {
    console.log(`${f.data}  ${f.status.padEnd(9)}  ${f.produto.padEnd(8)}  ${(f.angulo ?? '').padEnd(16)}  "${f.gancho ?? ''}"  [${(f.formatos ?? []).join(', ')}]`);
  }
  for (const [chave, c] of Object.entries(cob)) {
    if (so && chave !== so) continue;
    console.log(`\n${catalogo[chave].nome} (${catalogo[chave].estado}) · ${c.videos} vídeo(s) entregue(s)`);
    console.log(`  nunca dito:      ${c.nunca.join(', ') || '—'}`);
    console.log(`  ângulos livres:  ${c.angulosLivres.join(', ') || '—'}`);
    console.log(`  já dito:         ${c.features.filter(f => f.vezes).map(f => `${f.id} ×${f.vezes}`).join(', ') || '—'}`);
    if (c.ganchos.length) console.log(`  ganchos usados:  ${c.ganchos.map(g => `"${g}"`).join(' · ')}`);
  }
  const reprovados = lista.filter(f => f.status === 'reprovado' && (!so || f.produto === so));
  if (reprovados.length) {
    console.log('\nReprovados (o que não repetir):');
    for (const f of reprovados) console.log(`  ${f.id}: ${f.reprovado?.motivo ?? ''}${f.reprovado?.o_que_ficou ? `\n    ficou: ${f.reprovado.o_que_ficou}` : ''}`);
  }
  const v = velhos(lista);
  if (v.length) console.log(`\nRefazer (o preço ou o teste grátis mudou na conta): ${v.map(f => f.id).join(', ')}`);
}
