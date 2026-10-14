// O que o site diz hoje, em texto, em conhecimento/site/<pagina>.txt: é de onde saem as frases, os números de
// exemplo e as features que um vídeo pode mostrar (o site é revisado pelo Sidney; o vídeo não inventa promessa).
// Rode antes de uma pauta nova: o `git diff conhecimento/site` mostra o que mudou no produto desde o último vídeo.
//
//   node estudio/conhecimento.mjs [--site http://localhost:4181]

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { atualizar } from './catalogo.mjs';

const PAGINAS = ['', 'financas', 'planos', 'sobre', 'privacidade', 'comecar'];
const DESTINO = fileURLToPath(new URL('../conhecimento/site/', import.meta.url));

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' };

/** O texto visível de uma página do site (sem script, estilo, svg e head), uma linha por bloco. */
export function textoDaPagina(html) {
  return html
    .replace(/<(script|style|svg|head)[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/(p|h[1-6]|li|div|section|tr|header|footer|dt|dd|figcaption|blockquote)>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#?\w+);/g, (m, e) => ENTIDADES[e] ?? (e.startsWith('#') ? String.fromCodePoint(Number(e.slice(1))) : m))
    .split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const i = process.argv.indexOf('--site');
  const site = (i > 0 ? process.argv[i + 1] : 'https://tolive.app').replace(/\/$/, '');
  mkdirSync(DESTINO, { recursive: true });
  for (const p of PAGINAS) {
    const r = await fetch(`${site}/${p}`);
    if (!r.ok) { console.log(`ERRO ${r.status} em /${p}`); continue; }
    const nome = p || 'inicio';
    writeFileSync(`${DESTINO}${nome}.txt`, `# ${site}/${p} · lido em ${new Date().toISOString().slice(0, 10)}\n\n${textoDaPagina(await r.text())}\n`);
    console.log(`ok  conhecimento/site/${nome}.txt`);
  }
  const { lido_em } = await atualizar();
  console.log(lido_em ? `ok  conhecimento/planos.json (${lido_em})` : '--  a conta não respondeu: sem catálogo');
  console.log('\nO que mudou desde o último vídeo: git diff conhecimento/');
}
