// Os formatos de saída e a área segura de cada um. Uma linha do tempo, todos os formatos: as cenas se
// desenham contra o layout (W, H, u, seguro), nunca contra pixel fixo, e o render sai em cada formato
// sem cortar um do outro (o passo 12 do curso). Reenquadre tipo e UI por formato; não recorte 16:9 pra 9:16.
//
// As áreas seguras são as referências comuns do Instagram em out/2026 (o que a interface do app cobre:
// nome e barra no topo, legenda, campo de resposta e botões embaixo e à direita). Não são da marca e mudam
// quando o Instagram muda: confira no celular a cada tanto, e corrija aqui.

export const FORMATOS = Object.freeze({
  stories: { W: 1080, H: 1920, margem: { topo: 250, base: 340, esquerda: 72, direita: 72 }, uso: 'Stories do Instagram e do WhatsApp (9:16)' },
  reels: { W: 1080, H: 1920, margem: { topo: 220, base: 440, esquerda: 72, direita: 160 }, uso: 'Reels, TikTok e Shorts (9:16): a legenda e os botões cobrem embaixo e à direita' },
  feed: { W: 1080, H: 1350, margem: { topo: 72, base: 72, esquerda: 72, direita: 72 }, uso: 'Post no feed (4:5); a grade do perfil mostra o meio em 3:4' },
  quadrado: { W: 1080, H: 1080, margem: { topo: 72, base: 72, esquerda: 72, direita: 72 }, uso: 'Feed quadrado, LinkedIn, WhatsApp' },
  horizontal: { W: 1920, H: 1080, margem: { topo: 72, base: 96, esquerda: 120, direita: 120 }, uso: 'YouTube, site, apresentação (16:9)' },
});

/** O layout de um formato: tamanho, unidade (u = 1 num lado de 1080) e a área segura. */
export function layout(nome) {
  const f = FORMATOS[nome];
  if (!f) throw new Error(`formato desconhecido: ${nome} (use ${Object.keys(FORMATOS).join(', ')})`);
  const { W, H, margem: m } = f;
  const seguro = { x: m.esquerda, y: m.topo, w: W - m.esquerda - m.direita, h: H - m.topo - m.base };
  return Object.freeze({
    nome, W, H,
    u: Math.min(W, H) / 1080,
    retrato: H > W,
    cx: W / 2, cy: H / 2,
    seguro: Object.freeze({ ...seguro, cx: seguro.x + seguro.w / 2, cy: seguro.y + seguro.h / 2, direita: seguro.x + seguro.w, base: seguro.y + seguro.h }),
  });
}

/** O formato que a pessoa pediu, em português de conversa ("stories", "feed", "reels", "vertical"…). */
export function formatoDoPedido(texto = '') {
  const t = texto.toLowerCase();
  if (/reel|tiktok|short/.test(t)) return 'reels';
  if (/stor|vertical|9:16|status/.test(t)) return 'stories';
  if (/quadrad|1:1|linkedin/.test(t)) return 'quadrado';
  if (/horizontal|youtube|16:9|site/.test(t)) return 'horizontal';
  if (/feed|post|4:5/.test(t)) return 'feed';
  return null;
}
