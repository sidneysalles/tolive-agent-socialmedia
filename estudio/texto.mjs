// Confere o texto que vai pra tela e pra legenda do post contra a voz da marca (guia, seção 2). Pega o que
// dá pra pegar por regra; o resto (o veredito certo, o fato antes do pedido, a calma) é da crítica.
//
//   node estudio/texto.mjs videos/<id>        confere o filme.mjs (só as strings) e a legenda.md

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REGRAS = [
  { nivel: 'erro', regra: 'sem emoji (guia, seção 2)', re: /\p{Extended_Pictographic}/u },
  { nivel: 'erro', regra: 'sem exclamação (calma, sem alarme)', re: /!/ },
  { nivel: 'erro', regra: 'a marca é "toLive"', re: /\bTo ?Live\b(?! Soluções)|\bTOLIVE\b|\btolive\b(?!\.app)/ },
  { nivel: 'erro', regra: 'nunca citar "Lei 10" nem o livro de onde veio (guia, seção 8)', re: /lei\s*10|di[aá]rio de um ceo/i },
  { nivel: 'erro', regra: 'sem urgência falsa nem gamificação', re: /imperd[ií]vel|n[aã]o perca|corra|[uú]ltimas vagas|s[oó] hoje|parab[eé]ns|incr[ií]vel|revolucion|desafio do m[eê]s|sequ[eê]ncia de \d+/i },
  { nivel: 'erro', regra: 'preço só do catálogo da conta (ctx.catalogo), nunca escrito', re: /a partir de R\$|R\$\s?\d+(?:,\d{2})?\s*(?:por conex[aã]o|o plano)|\d+ dias gr[aá]tis/i },
  { nivel: 'erro', regra: 'o nome do app é "toLive Finanças" (nunca "Finance")', re: /(?<!Open )\bFinance\b/ },
  { nivel: 'aviso', regra: 'número até dez por extenso no texto ("três assinaturas", "Faltam quatro")', re: /(?<![\d,.R$%])\b[1-9]\s+(?!out\b|jan\b|fev\b|mar\b|abr\b|mai\b|jun\b|jul\b|ago\b|set\b|nov\b|dez\b|min\b|h\b|s\b|x\b|de\s+\d)[a-zà-ú]{3,}/i },
  { nivel: 'aviso', regra: 'evite o vocabulário de app comum (insights, dica, novidades)', re: /\binsights?\b|dica do dia|confira as novidades|ol[aá],/i },
  { nivel: 'aviso', regra: 'o Toly não comemora nem chama de volta (guia, seção 7)', re: /toly[^.]{0,60}(comemor|festej|volte|sentimos)/i },
];

/** Os preços da toLive que a conta já cobrou (conhecimento/planos.json): escritos à mão num vídeo, são erro. */
function precosDaToLive() {
  try {
    const { resposta } = JSON.parse(readFileSync(new URL('../conhecimento/planos.json', import.meta.url), 'utf8'));
    return (resposta?.planos ?? []).map(p => `${Math.floor(p.valor_centavos / 100)},${String(p.valor_centavos % 100).padStart(2, '0')}`);
  } catch { return []; }
}
const PRECOS = precosDaToLive();

/** Os problemas de um texto: [{ nivel, regra, trecho }]. */
export function conferirTexto(texto, { precos = PRECOS } = {}) {
  const achados = [];
  for (const preco of precos) {
    const i = texto.indexOf(preco);
    if (i >= 0) achados.push({ nivel: 'erro', regra: `o preço de um plano (R$ ${preco}) vem do catálogo da conta (ctx.catalogo), nunca escrito`, trecho: texto.slice(Math.max(0, i - 20), i + 25) });
  }
  for (const { nivel, regra, re } of REGRAS) {
    const m = texto.match(re);
    if (m) achados.push({ nivel, regra, trecho: texto.slice(Math.max(0, m.index - 20), m.index + m[0].length + 20).replace(/\s+/g, ' ').trim() });
  }
  return achados;
}

/** As strings de um módulo JS (aspas simples, duplas e crase), sem os comentários nem o código em volta. */
export function stringsDoCodigo(codigo) {
  const semComentario = codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
  const out = [];
  const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  for (const m of semComentario.matchAll(re)) {
    const s = (m[1] ?? m[2] ?? m[3]).replace(/\$\{[^}]*\}/g, '0');
    // caminho, cor, nome de fonte e seletor não são texto de tela
    if (/^[#./]|^[\w-]+\.(png|svg|mjs|json|wav|woff2)$|^\d|^(rgba?|hsl)\(/.test(s) || !/[a-zà-ú]{3}/i.test(s)) continue;
    out.push(s);
  }
  return out;
}

/** Confere um vídeo: as strings do filme.mjs e a legenda.md. */
export function conferirVideo(pasta) {
  const achados = [];
  const filme = join(pasta, 'filme.mjs');
  if (existsSync(filme)) {
    for (const s of stringsDoCodigo(readFileSync(filme, 'utf8'))) for (const a of conferirTexto(s)) achados.push({ ...a, onde: 'filme.mjs' });
  }
  const legenda = join(pasta, 'legenda.md');
  if (existsSync(legenda)) {
    for (const linha of readFileSync(legenda, 'utf8').split('\n')) {
      if (linha.startsWith('#') || linha.startsWith('<!--')) continue;
      for (const a of conferirTexto(linha)) achados.push({ ...a, onde: 'legenda.md' });
    }
  }
  return achados;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pasta = process.argv[2];
  if (!pasta) { console.error('uso: node estudio/texto.mjs videos/<id>'); process.exit(2); }
  const achados = conferirVideo(pasta);
  for (const a of achados) console.log(`${a.nivel === 'erro' ? 'ERRO ' : 'aviso'}  ${a.onde}: ${a.regra}\n       "${a.trecho}"`);
  const erros = achados.filter(a => a.nivel === 'erro').length;
  console.log(erros ? `\n${erros} erro(s). Corrija antes de renderizar.` : `\nTexto em dia com a voz${achados.length ? ` (${achados.length} aviso(s) pra olhar)` : ''}.`);
  process.exit(erros ? 1 : 0);
}
