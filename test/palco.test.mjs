// O palco de verdade, no Chromium: o filme carrega, pinta o mesmo quadro duas vezes igual (determinismo) e o
// quadro 0 não é vazio. Pula se a máquina não tem Playwright (o resto dos testes não depende dele).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { servir } from '../estudio/servidor.mjs';
import { abrirNavegador } from '../estudio/navegador.mjs';
import { fichas } from '../estudio/historico.mjs';

let navegador = null;
try { navegador = await abrirNavegador(); } catch { /* sem Playwright */ }

test('cada filme pinta igual o mesmo quadro, em qualquer ordem, e o quadro 0 já mostra algo', { skip: !navegador && 'sem Playwright nesta máquina' }, async () => {
  const { url, fechar } = await servir();
  try {
    for (const f of fichas(new URL('../', import.meta.url).pathname)) {
      for (const formato of ['stories', 'feed']) {
        const p = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
        await p.goto(`${url}/estudio/palco.html?render&video=videos/${f.id}&formato=${formato}`);
        await p.waitForFunction(() => window.pronto || window.erroDoPalco);
        assert.equal(await p.evaluate(() => window.erroDoPalco ?? null), null, `${f.id}: o palco falhou`);
        const quadro = t => p.evaluate(t => { window.seek(t); return document.getElementById('c').toDataURL('image/png'); }, t);
        const h = s => createHash('sha1').update(s).digest('hex');
        const meio = (await p.evaluate(() => window.filme.duracao)) / 2;
        const a = h(await quadro(meio)); await quadro(1); await quadro(meio * 1.5);
        assert.equal(h(await quadro(meio)), a, `${f.id} (${formato}): o quadro ${meio} mudou entre duas pinturas`);
        const tinta = await p.evaluate(() => { window.seek(0); const c = document.getElementById('c'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let escuros = 0; for (let i = 0; i < d.length; i += 4 * 97) if (d[i] < 80) escuros++; return escuros; });
        assert.ok(tinta > 50, `${f.id} (${formato}): o quadro 0 está vazio (é a miniatura em alguns feeds)`);
        await p.close();
      }
    }
  } finally {
    fechar();
    await navegador?.close();
  }
});
