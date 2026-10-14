// Perspectiva 3D de verdade no palco (decisão do Sidney, 14/10/2026: "a perspectiva 3D podemos usar"), pelo WebGL:
// planos com textura (o celular, cada peça da tela) num espaço 3D, vistos por uma câmera com perspectiva, e o
// resultado pintado no canvas do filme. Função pura do tempo como o resto: quem chama passa a pose de cada quadro.
// Sem iluminação, sombra nem brilho (a marca é plana): só a inclinação e a profundidade.

let gl = null, tela = null, programa = null, buffer = null;
const texturas = new WeakMap();

function iniciar(W, H) {
  if (!tela) {
    tela = document.createElement('canvas');
    gl = tela.getContext('webgl', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: true, alpha: true });
    if (!gl) throw new Error('sem WebGL neste navegador: a perspectiva 3D precisa dele');
    const sombreador = (tipo, fonte) => { const s = gl.createShader(tipo); gl.shaderSource(s, fonte); gl.compileShader(s); return s; };
    programa = gl.createProgram();
    gl.attachShader(programa, sombreador(gl.VERTEX_SHADER, 'attribute vec4 p; attribute vec2 uv; varying vec2 v; void main(){ v = uv; gl_Position = p; }'));
    gl.attachShader(programa, sombreador(gl.FRAGMENT_SHADER, 'precision mediump float; varying vec2 v; uniform sampler2D t; uniform float a; void main(){ gl_FragColor = texture2D(t, v) * a; }'));
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
 * Projeta um ponto do plano (x, y em px a partir do centro do plano, z em px na direção de quem olha) pela câmera:
 * gira em Y (ry, graus: positivo leva a borda direita pra longe) e em X (rx: positivo leva o topo pra longe),
 * perspectiva pela distância. Devolve { x, y, w } no quadro (w é o divisor da perspectiva).
 */
export function projetar(px, py, pz, { rx = 0, ry = 0, distancia = 2400, cx = 0, cy = 0, escala = 1 }) {
  const a = (ry * Math.PI) / 180, b = (rx * Math.PI) / 180;
  const x1 = px * Math.cos(a) - pz * Math.sin(a), z1 = px * Math.sin(a) + pz * Math.cos(a);
  const y2 = py * Math.cos(b) + z1 * Math.sin(b), z2 = -py * Math.sin(b) + z1 * Math.cos(b);
  const f = distancia / (distancia - z2);
  return { x: cx + x1 * f * escala, y: cy + y2 * f * escala, w: 1 / f, z: z2 };
}

/**
 * Pinta planos com textura em 3D no canvas g. planos: [{ fonte (Image ou canvas), x, y, w, h (px no plano, a partir
 * do canto do plano), z, alfa, corte (0–1: só a fração da esquerda, pro gráfico que se desenha) }]. camera: { largura,
 * altura (do plano), cx, cy (onde o centro do plano cai no quadro), rx, ry, distancia, escala }.
 */
export function pintar3d(g, W, H, planos, camera) {
  iniciar(W, H);
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(programa);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const pP = gl.getAttribLocation(programa, 'p'), pUv = gl.getAttribLocation(programa, 'uv'), uA = gl.getUniformLocation(programa, 'a');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(pP); gl.enableVertexAttribArray(pUv);
  gl.vertexAttribPointer(pP, 4, gl.FLOAT, false, 24, 0); gl.vertexAttribPointer(pUv, 2, gl.FLOAT, false, 24, 16);
  const ox = camera.largura / 2, oy = camera.altura / 2;
  const prontos = planos.filter(p => p.fonte && (p.alfa ?? 1) > 0).map((p, ordem) => {
    const corte = p.corte ?? 1, w = p.w * corte;
    const cantos = [[p.x, p.y, 0, 0], [p.x + w, p.y, corte, 0], [p.x, p.y + p.h, 0, 1], [p.x + w, p.y + p.h, corte, 1]]
      .map(([x, y, u, v]) => ({ ...projetar(x - ox, y - oy, p.z ?? 0, camera), u, v }));
    return { p, cantos, ordem, z: cantos.reduce((s, c) => s + c.z, 0) / 4 };
  }).sort((a, b) => a.z - b.z || a.ordem - b.ordem); // o de trás primeiro; no mesmo plano, a ordem de quem chamou
  for (const { p, cantos } of prontos) {
    const dados = new Float32Array(cantos.flatMap(c => [((c.x / W) * 2 - 1) * c.w, (1 - (c.y / H) * 2) * c.w, 0, c.w, c.u, c.v]));
    gl.bufferData(gl.ARRAY_BUFFER, dados, gl.DYNAMIC_DRAW);
    gl.bindTexture(gl.TEXTURE_2D, textura(p.fonte));
    gl.uniform1f(uA, p.alfa ?? 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  g.drawImage(tela, 0, 0);
}
