// Um servidor estático mínimo da raiz do repositório, só no loopback: o palco importa módulos (file:// não
// deixa) e carrega fontes, capturas e o catálogo. Usado pelo render e pela prévia.
//
//   node estudio/servidor.mjs            prévia em http://127.0.0.1:4190/estudio/palco.html?video=videos/<id>

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(fileURLToPath(new URL('..', import.meta.url)));
const TIPOS = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.wav': 'audio/wav' };

export function servir(porta = 0) {
  const servidor = createServer(async (req, res) => {
    const caminho = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    const arquivo = join(RAIZ, caminho);
    if (!arquivo.startsWith(RAIZ) || caminho.startsWith('.git')) { res.writeHead(403).end(); return; }
    try {
      const corpo = await readFile(arquivo);
      res.writeHead(200, { 'content-type': TIPOS[extname(arquivo)] ?? 'application/octet-stream', 'cache-control': 'no-store' }).end(corpo);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise(ok => servidor.listen(porta, '127.0.0.1', () => ok({ url: `http://127.0.0.1:${servidor.address().port}`, fechar: () => servidor.close() })));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { url } = await servir(Number(process.env.PORTA ?? 4190));
  console.log(`Prévia: ${url}/estudio/palco.html?video=videos/<id>&formato=stories  (espaço pausa, ← → andam 1/30 s, #t=3.2 vai pro tempo)`);
}
