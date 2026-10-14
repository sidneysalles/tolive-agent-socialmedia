// A parte pura do catálogo (sem node:*), que o palco também usa no navegador. Ver catalogo.mjs.

const POR_EXTENSO = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];
const porExtenso = n => (n >= 0 && n <= 10 ? POR_EXTENSO[n] : String(n));
const inteiro = v => (Number.isInteger(v) && v >= 0 ? v : null);

/** "R$ 1.234,56", de centavos inteiros. */
export function reais(centavos) {
  return `R$ ${Math.floor(centavos / 100).toLocaleString('pt-BR')},${String(centavos % 100).padStart(2, '0')}`;
}

/**
 * O que um vídeo pode dizer, a partir da resposta da conta (mesma regra de tolive/publico/js/dominio/planos.mjs):
 * { planos, menorPreco: "R$ 14,90 por mês" | null, teste: "30 dias grátis com até duas conexões" | null,
 * testeDestaque: { grande: "30 dias grátis", resto: "com até duas conexões" } | null }.
 */
export function oQueDizer(resposta) {
  const planos = (Array.isArray(resposta?.planos) ? resposta.planos : [])
    .filter(p => p?.tipo === 'plano' && inteiro(p.valor_centavos) > 0 && inteiro(p.limite_conexoes) > 0)
    .map(p => ({ codigo: p.codigo, titulo: String(p.titulo ?? ''), limite: p.limite_conexoes, centavos: p.valor_centavos, testeDias: inteiro(p.teste_dias) ?? 0 }))
    .sort((a, b) => a.limite - b.limite || a.centavos - b.centavos);
  if (!planos.length) return { planos, menorPreco: null, teste: null, testeDestaque: null };
  const menor = Math.min(...planos.map(p => p.centavos));
  const comTeste = planos.filter(p => p.testeDias > 0);
  let teste = null, testeDestaque = null;
  if (comTeste.length) {
    const dias = Math.max(...comTeste.map(p => p.testeDias));
    // o destaque (o fim do vídeo, em letra grande): o número de dias, e o resto da frase embaixo
    if (comTeste.length === 1) testeDestaque = { grande: `${dias} dias grátis`, resto: `com até ${porExtenso(comTeste[0].limite)} ${comTeste[0].limite === 1 ? 'conexão' : 'conexões'}` };
    else if (comTeste.length === planos.length && comTeste.every(p => p.testeDias === dias)) testeDestaque = { grande: `${dias} dias grátis`, resto: 'em qualquer plano' };
    else testeDestaque = { grande: `Até ${dias} dias grátis`, resto: '' };
    teste = testeDestaque.resto ? `${testeDestaque.grande} ${testeDestaque.resto}` : testeDestaque.grande.toLowerCase();
  }
  return { planos, menorPreco: `${reais(menor)} por mês`, aPartirDe: `a partir de ${reais(menor)} por mês`, teste, testeDestaque };
}
