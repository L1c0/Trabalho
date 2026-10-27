import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { cancelRender, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import geo from './data/geometria.json';
import { quadro } from './tabela';

/**
 * O disco: o compositor do LEIA-PRIMEIRO, um fragment shader que, a cada
 * frame, revela a chapa (disco.jpg, impressa uma vez) por um corte de
 * limiar no mapa de anéis, sobre o papel ladrilhado. Câmera, limiar, casca
 * e borda úmida vêm da tabela (tabela.ts); nada aqui gera textura.
 *
 * O canvas tem SS vezes a resolução do quadro e o navegador o reduz para
 * 1080x1920 (média de SS×SS amostras por pixel): sem isso a frente do
 * limiar e as linhas finas do disco serrilham quando a câmera recua.
 */
const SS = 2;
const W = 1080;
const H = 1920;
const L = geo.lado;

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

// O shader do LEIA-PRIMEIRO em GLSL ES 3.0. Só muda o transporte:
// - "tela" em pixels do quadro com y para baixo (o gl_FragCoord do WebGL sobe);
// - o mapa chega em float32, já em coordenada de anel (ferramentas/mapa.py),
//   com o mesmo filtro bilinear de um texture2D em LINEAR;
// - o papel usa REPEAT em vez de fract(uv): a mesma conta, sem a emenda que o
//   fract cria na escolha do mipmap.
const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uDisco, uPapel;
uniform highp sampler2D uMapa;
uniform vec2 uCentroChapa;
uniform float uEscala, uCY, uInterno, uFrente, uCascaOp, uContando;
out vec4 cor;
const float LADO = ${L}.0, SUAVE = 0.06, SS = ${SS}.0, ALTURA = ${H}.0;

float mapa(vec2 p) {
  vec2 q = p - 0.5;
  vec2 b = floor(q);
  vec2 t = q - b;
  ivec2 i = ivec2(b);
  ivec2 lim = ivec2(${L - 1});
  float a00 = texelFetch(uMapa, clamp(i, ivec2(0), lim), 0).r;
  float a10 = texelFetch(uMapa, clamp(i + ivec2(1, 0), ivec2(0), lim), 0).r;
  float a01 = texelFetch(uMapa, clamp(i + ivec2(0, 1), ivec2(0), lim), 0).r;
  float a11 = texelFetch(uMapa, clamp(i + ivec2(1, 1), ivec2(0), lim), 0).r;
  return mix(mix(a00, a10, t.x), mix(a01, a11, t.x), t.y);
}

void main() {
  vec2 tela = vec2(gl_FragCoord.x, ALTURA * SS - gl_FragCoord.y) / SS;
  vec2 p = (tela - vec2(540.0, uCY)) / uEscala + uCentroChapa;
  vec2 uv = p / LADO;

  vec3 papel = texture(uPapel, uv).rgb;

  bool fora = p.x < 0.0 || p.x >= LADO || p.y < 0.0 || p.y >= LADO;
  float m = mapa(p);

  float vis = clamp((m - uInterno) / SUAVE, 0.0, 1.0)
            * clamp((uFrente - m) / SUAVE, 0.0, 1.0);

  if (uCascaOp > 0.0) {
    float casca = uCascaOp
                * clamp((m - 47.0) / SUAVE, 0.0, 1.0)
                * clamp((48.2 - m) / SUAVE, 0.0, 1.0)
                * clamp((1140.0 - tela.y) / 40.0, 0.0, 1.0);
    vis = max(vis, casca);
  }
  if (fora) vis = 0.0;

  vec3 disco = texture(uDisco, uv).rgb;
  float molha = clamp(1.0 - abs(m - uFrente) / 0.45, 0.0, 1.0)
              * step(m, uFrente) * uContando;
  disco *= (1.0 - 0.21 * molha);

  cor = vec4(mix(papel, disco, vis), 1.0);
}`;

type Gpu = { gl: WebGL2RenderingContext; u: Record<string, WebGLUniformLocation | null> };

const compila = (gl: WebGL2RenderingContext, tipo: number, src: string) => {
  const s = gl.createShader(tipo)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`shader: ${gl.getShaderInfoLog(s)}`);
  return s;
};

const imagem = (src: string) =>
  new Promise<HTMLImageElement>((ok, erro) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => erro(new Error(`não carregou ${src}`));
    im.src = staticFile(src);
  });

/** chapa em RGBA8 com mipmaps (a câmera recua até 0,27: sem mipmap as linhas finas fazem moiré) */
const chapa = (gl: WebGL2RenderingContext, unidade: number, im: HTMLImageElement, repete: boolean) => {
  gl.activeTexture(gl.TEXTURE0 + unidade);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, im);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const w = repete ? gl.REPEAT : gl.CLAMP_TO_EDGE;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, w);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, w);
};

const desenha = ({ gl, u }: Gpu, f: number) => {
  const q = quadro(f);
  gl.uniform1f(u.uEscala, q.escala);
  gl.uniform1f(u.uCY, q.cy);
  gl.uniform1f(u.uInterno, q.interno);
  gl.uniform1f(u.uFrente, q.frente);
  gl.uniform1f(u.uCascaOp, q.cascaOp);
  gl.uniform1f(u.uContando, q.contando);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.finish();
};

export const Disco: React.FC = () => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const gpu = useRef<Gpu | null>(null);
  const atual = useRef(f);
  atual.current = f;

  useEffect(() => {
    const h = delayRender('compositor: disco, papel e mapa');
    const gl = ref.current!.getContext('webgl2', {
      preserveDrawingBuffer: true,
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
    });
    if (!gl) {
      cancelRender(new Error('sem WebGL2'));
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compila(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compila(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      cancelRender(new Error(`programa: ${gl.getProgramInfoLog(prog)}`));
      return;
    }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    gl.viewport(0, 0, W * SS, H * SS);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    const u: Gpu['u'] = {};
    for (const n of ['uDisco', 'uPapel', 'uMapa', 'uCentroChapa', 'uEscala', 'uCY', 'uInterno', 'uFrente', 'uCascaOp', 'uContando']) {
      u[n] = gl.getUniformLocation(prog, n);
    }
    Promise.all([
      imagem('chapa/disco.jpg'),
      imagem('chapa/papel.jpg'),
      fetch(staticFile('chapa/mapa-anel.f32')).then((r) => {
        if (!r.ok) throw new Error('não carregou chapa/mapa-anel.f32');
        return r.arrayBuffer();
      }),
    ])
      .then(([disco, papel, mapa]) => {
        chapa(gl, 0, disco, false);
        chapa(gl, 1, papel, true);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, L, L, 0, gl.RED, gl.FLOAT, new Float32Array(mapa));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(u.uDisco, 0);
        gl.uniform1i(u.uPapel, 1);
        gl.uniform1i(u.uMapa, 2);
        gl.uniform2f(u.uCentroChapa, geo.centro[0], geo.centro[1]);
        gpu.current = { gl, u };
        desenha(gpu.current, atual.current);
        continueRender(h);
      })
      .catch((e) => cancelRender(e));
  }, []);

  useLayoutEffect(() => {
    if (gpu.current) desenha(gpu.current, f);
  }, [f]);

  return <canvas ref={ref} width={W * SS} height={H * SS} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H }} />;
};
