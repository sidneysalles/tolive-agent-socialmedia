// O Chromium do render, pelo Playwright. O estúdio não instala dependência (a stack da toLive: zero
// dependências); usa o Playwright que a máquina já tem. Procura, nesta ordem: instalado no projeto, a
// pasta em PLAYWRIGHT_DIR, o global do npm e o da nuvem do Claude (/opt/node-tools).
//
// Na sua máquina, uma vez: npm i -g playwright && npx playwright install chromium

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

export async function playwright() {
  try { return await import('playwright'); } catch { /* segue procurando */ }
  let global = '';
  try { global = execFileSync('npm', ['root', '-g'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { /* sem npm */ }
  const lugares = [process.env.PLAYWRIGHT_DIR, global && join(global, 'playwright'), '/opt/node-tools/node_modules/playwright'].filter(Boolean);
  for (const lugar of lugares) if (existsSync(lugar)) return createRequire(import.meta.url)(lugar);
  throw new Error('Playwright não encontrado. Uma vez: npm i -g playwright && npx playwright install chromium');
}

export async function abrirNavegador() {
  const { chromium } = await playwright();
  return chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
}
