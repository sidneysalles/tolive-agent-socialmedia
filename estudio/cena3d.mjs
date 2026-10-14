// Perspectiva 3D de verdade no palco (decisão do Sidney, 14/10/2026: "a perspectiva 3D podemos usar"), pelo WebGL:
// planos com textura (o celular, cada peça da tela) num espaço 3D, vistos por uma câmera com perspectiva, e o
// resultado pintado no canvas do filme. Função pura do tempo como o resto: quem chama passa a pose de cada quadro.
// Sem iluminação, sombra nem brilho (a marca é plana): só a inclinação e a profundidade.
//
// Todos os planos são paralelos (giram juntos com o aparelho), então a ordem de pintura é a profundidade de cada um
// no próprio aparelho (z), nunca a profundidade projetada: com o aparelho inclinado, a média projetada de uma peça
// na metade de trás ficava atrás do corpo do celular, e o corpo a cobria (as peças que "sumiam", out/2026).
// E a tela recorta: o plano marcado `mascara` (a tela do aparelho) vai pro stencil, e os planos com `recorta` só
// aparecem dentro dele (a peça voando nunca passa por cima da borda do celular, out/2026).

let gl = null, tela = null, programa = null, buffer = null;
const texturas = new WeakMap();

function iniciar(W, H) {
  if (!tela) {
    tela = document.createElement('canvas');
    gl = tela.getContext('webgl', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: true, alpha: true, stencil: true });
    if (!gl) throw new Error('sem WebGL neste navegador: a perspectiva 3D precisa dele');
    const sombreador = (tipo, fonte) => { const s = gl.createShader(tipo); gl.shaderSource(s, fonte); gl.compileShader(s); return s; };
    programa = gl.createProgram();
    gl.attachShader(programa, sombreador(gl.VERTEX_SHADER, 'attribute vec4 p; attribute vec2 uv; varying vec2 v; void main(){ v = uv; gl_Position = p; }'));
    gl.attachShader(programa, sombreador(gl.FRAGMENT_SHADER, 'precision mediump float; varying vec2 v; uniform sampler2D t; uniform float a; uniform float m; void main(){ vec4 c = texture2D(t, v); if (m > 0.5 && c.a < 0.5) discard; gl_FragColor = c * a; }'));
    gl.linkProgram(programa);
    buffer = gl.createBuffer();
  }
  if (tela.width !== W || tela.height !== H) { tela.width = W; tela.height = H; }
  gl.viewport(0, 0, W, H);
}

function textura(fonte) {
  let t = texturas.get(fonte);
  if (t) return t;
  t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fonte);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  texturas.set(fonte, t);
  return t;
}

/**
 * Projeta um ponto do plano (x, y em px a partir do ponto de foco do plano, z em px na direção de quem olha) pela
 * câmera: gira em Y (ry, graus: positivo traz a borda direita pra perto) e em X (rx: positivo traz o topo pra perto),
 * perspectiva pela distância, e o foco cai em (cx, cy) do quadro. Devolve { x, y, w, z } (w é o divisor).
 */
export function projetar(px, py, pz, { rx = 0, ry = 0, distancia = 2400, cx = 0, cy = 0, escala = 1 }) {
  const a = (ry * Math.PI) / 180, b = (rx * Math.PI) / 180;
  const x1 = px * Math.cos(a) - pz * Math.sin(a), z1 = px * Math.sin(a) + pz * Math.cos(a);
  const y2 = py * Math.cos(b) + z1 * Math.sin(b), z2 = -py * Math.sin(b) + z1 * Math.cos(b);
  const f = distancia / (distancia - z2);
  return { x: cx + x1 * f * escala, y: cy + y2 * f * escala, w: 1 / f, z: z2 };
}

/** A ordem de pintura: pela profundidade no aparelho (os planos são paralelos), empate pela ordem de quem chamou. */
export function ordemDePintura(planos) {
  return planos.map((p, ordem) => ({ p, ordem })).sort((a, b) => (a.p.z ?? 0) - (b.p.z ?? 0) || a.ordem - b.ordem).map(x => x.p);
}

/**
 * Pinta planos com textura em 3D no canvas g. planos: [{ fonte (Image ou canvas), x, y, w, h (px no plano, a partir
 * do canto do plano), z, alfa, corte (0–1: só a fração da esquerda, pro gráfico que se desenha), sobe (0–1: só a
 * fração de baixo, pra barra que cresce), mascara (vira o recorte, não pinta), recorta (só dentro do recorte) }].
 * camera: { largura, altura (do plano), foco: [x, y] (o ponto do plano, em px, que cai em cx, cy; o centro se
 * faltar), cx, cy, rx, ry, distancia, escala }.
 */
export function pintar3d(g, W, H, planos, camera) {
  iniciar(W, H);
  gl.clearColor(0, 0, 0, 0); gl.clearStencil(0); gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  gl.useProgram(programa);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const pP = gl.getAttribLocation(programa, 'p'), pUv = gl.getAttribLocation(programa, 'uv');
  const uA = gl.getUniformLocation(programa, 'a'), uM = gl.getUniformLocation(programa, 'm');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(pP); gl.enableVertexAttribArray(pUv);
  gl.vertexAttribPointer(pP, 4, gl.FLOAT, false, 24, 0); gl.vertexAttribPointer(pUv, 2, gl.FLOAT, false, 24, 16);
  const [ox, oy] = camera.foco ?? [camera.largura / 2, camera.altura / 2];
  const desenhar = p => {
    const corte = p.corte ?? 1, sobe = p.sobe ?? 1, w = p.w * corte, y0 = p.y + p.h * (1 - sobe);
    const cantos = [[p.x, y0, 0, 1 - sobe], [p.x + w, y0, corte, 1 - sobe], [p.x, p.y + p.h, 0, 1], [p.x + w, p.y + p.h, corte, 1]]
      .map(([x, y, u, v]) => ({ ...projetar(x - ox, y - oy, p.z ?? 0, camera), u, v }));
    const dados = new Float32Array(cantos.flatMap(c => [((c.x / W) * 2 - 1) * c.w, (1 - (c.y / H) * 2) * c.w, 0, c.w, c.u, c.v]));
    gl.bufferData(gl.ARRAY_BUFFER, dados, gl.DYNAMIC_DRAW);
    gl.bindTexture(gl.TEXTURE_2D, textura(p.fonte));
    gl.uniform1f(uA, p.alfa ?? 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const validos = planos.filter(p => p.fonte && (p.mascara || (p.alfa ?? 1) > 0) && (p.corte ?? 1) > 0 && (p.sobe ?? 1) > 0);
  // o recorte: só o stencil, com os pixels transparentes da máscara (os cantos redondos) descartados
  gl.enable(gl.STENCIL_TEST);
  gl.colorMask(false, false, false, false);
  gl.stencilFunc(gl.ALWAYS, 1, 0xff); gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
  gl.uniform1f(uM, 1);
  for (const p of validos) if (p.mascara) desenhar({ ...p, alfa: 1 });
  gl.colorMask(true, true, true, true);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  gl.uniform1f(uM, 0);
  for (const p of ordemDePintura(validos.filter(p => !p.mascara))) {
    gl.stencilFunc(p.recorta ? gl.EQUAL : gl.ALWAYS, 1, 0xff);
    desenhar(p);
  }
  gl.disable(gl.STENCIL_TEST);
  g.drawImage(tela, 0, 0);
}
