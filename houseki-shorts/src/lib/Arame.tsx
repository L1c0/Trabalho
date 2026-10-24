import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { assentar } from './Plano';

/**
 * Objeto em arame (V2 §2.2): só linha. Sem material, sem luz, sem sombra,
 * sem textura — figura de tratado desenhada a bico de pena. A espessura é
 * constante em pixel (2 px em 1080 de largura), não muda com a distância.
 */
export const TINTA_LINHA = '#14120E';
export const FERRUGEM = '#7A3B22';

const linha = (pontos: number[], cor: string, w: number, h: number) => {
  const g = new LineSegmentsGeometry();
  g.setPositions(pontos);
  const m = new LineMaterial({ color: new THREE.Color(cor).getHex(), linewidth: 2, worldUnits: false });
  m.resolution.set(w, h);
  return new LineSegments2(g, m);
};

/** Pose do objeto: inclinação para a câmera (rx) e giro (ry), em radianos. */
export type PoseObj = { f: number; rx: number; ry: number; dur?: number };
const poseObj = (chaves: PoseObj[], f: number) => {
  let a = chaves[0];
  let rx = a.rx;
  let ry = a.ry;
  for (let i = 1; i < chaves.length; i++) {
    const c = chaves[i];
    if (f < c.f) break;
    const t = assentar(Math.min(1, (f - c.f) / (c.dur ?? 24)));
    rx = a.rx + (c.rx - a.rx) * t;
    ry = a.ry + (c.ry - a.ry) * t;
    if (t >= 1) a = c;
  }
  return { rx, ry };
};

/* ------------------------------------------------------------------ *
 * O CASCO: superfície paramétrica, u da popa (0) à proa (1), v da quilha
 * (0) à borda (1). As tábuas são faixas: 4 fiadas por bordo, 3 tábuas por
 * fiada, 24 ao todo. Cada uma é desenhada pelo contorno, um pouco recolhido,
 * para que se veja onde uma termina e a outra começa.
 * ------------------------------------------------------------------ */
const L = 10;
const B = 1.55;
const D = 1.35;
const casco = (u: number, v: number, lado: 1 | -1): [number, number, number] => {
  const s = Math.sin(Math.PI * u);
  const b = B * Math.pow(Math.max(s, 0), 0.55);
  const zq = D * 0.92 * (1 - Math.pow(Math.max(s, 0), 0.45));      // quilha sobe nas pontas
  const zb = D + 0.75 * Math.pow(2 * u - 1, 4);                     // borda sobe na proa e na popa
  const z = zq + (zb - zq) * v;
  const y = lado * b * Math.sqrt(Math.max(0, 1 - Math.pow(1 - v, 2)));
  return [(u - 0.5) * L, z - D / 2, y];
};

export type Tabua = { i: number; j: number; lado: 1 | -1; pontos: number[] };

export const TABUAS: Tabua[] = (() => {
  const out: Tabua[] = [];
  const NU = 3;
  const NV = 4;
  const gu = 0.012;
  const gv = 0.03;
  for (const lado of [1, -1] as const)
    for (let j = 0; j < NV; j++)
      for (let i = 0; i < NU; i++) {
        const u0 = i / NU + gu;
        const u1 = (i + 1) / NU - gu;
        const v0 = j / NV + gv;
        const v1 = (j + 1) / NV - gv;
        const pts: number[] = [];
        const seg = (a: [number, number, number], b: [number, number, number]) => pts.push(...a, ...b);
        const n = 10;
        for (let k = 0; k < n; k++) {
          const ua = u0 + ((u1 - u0) * k) / n;
          const ub = u0 + ((u1 - u0) * (k + 1)) / n;
          seg(casco(ua, v0, lado), casco(ub, v0, lado));
          seg(casco(ua, v1, lado), casco(ub, v1, lado));
        }
        for (let k = 0; k < 3; k++) {
          const va = v0 + ((v1 - v0) * k) / 3;
          const vb = v0 + ((v1 - v0) * (k + 1)) / 3;
          seg(casco(u0, va, lado), casco(u0, vb, lado));
          seg(casco(u1, va, lado), casco(u1, vb, lado));
        }
        out.push({ i, j, lado, pontos: pts });
      }
  return out;
})();

/**
 * Um ou dois cascos. Para cada tábua de cada casco, `cor(casco, k, f)`
 * diz a cor no frame (ou null = ainda não está / já saiu).
 */
export const Navios: React.FC<{
  largura: number;
  altura: number;
  cascos: { pos: [number, number, number] }[];
  cor: (casco: number, k: number, f: number) => string | null;
  poses: PoseObj[];
  /** pixels por unidade: projeção paralela, como figura de tratado */
  zoom: number;
}> = ({ largura, altura, cascos, cor, poses, zoom }) => {
  const f = useCurrentFrame();
  const objetos = useMemo(
    () =>
      cascos.map(() =>
        TABUAS.map((t) => ({
          escura: linha(t.pontos, TINTA_LINHA, largura, altura),
          ferrugem: linha(t.pontos, FERRUGEM, largura, altura),
        })),
      ),
    [cascos, largura, altura],
  );
  const { rx, ry } = poseObj(poses, f);
  // projeção paralela e cada casco girando em torno de si mesmo, com a
  // mesma pose: lado a lado na tela, os dois se veem idênticos (em
  // perspectiva, um saía de frente e o outro de lado)
  return (
    <ThreeCanvas
      width={largura}
      height={altura}
      gl={{ antialias: true, alpha: true }}
      orthographic
      camera={{ position: [0, 0, 50], zoom, near: 0.1, far: 200 }}
      style={{ mixBlendMode: 'multiply' }}
    >
      {cascos.map((c, ci) => (
        <group key={ci} position={c.pos}>
          <group rotation={[rx, ry, 0]}>
            {objetos[ci].map((o, k) => {
              const cc = cor(ci, k, f);
              if (!cc) return null;
              return <primitive key={k} object={cc === FERRUGEM ? o.ferrugem : o.escura} />;
            })}
          </group>
        </group>
      ))}
    </ThreeCanvas>
  );
};

/* ------------------------------------------------------------------ *
 * A FOSFOFILITA: sistema monoclínico. Dois eixos em ângulo reto e um
 * oblíquo (beta ~121°): o prisma é um paralelogramo esticado ao longo de b,
 * com terminações inclinadas. É a forma, não um retrato do espécime.
 * ------------------------------------------------------------------ */
const BETA = (121 * Math.PI) / 180;
const CRISTAL: number[] = (() => {
  const a = 1.0;
  const c = 0.78;
  const meio = 1.25;               // metade do comprimento ao longo de b
  // seção: a ao longo de x, c inclinado de beta em relação a a (plano xz)
  const sec: [number, number][] = [
    [0, 0],
    [a, 0],
    [a + c * Math.cos(BETA), c * Math.sin(BETA)],
    [c * Math.cos(BETA), c * Math.sin(BETA)],
  ];
  const cx = sec.reduce((s, p) => s + p[0], 0) / 4;
  const cz = sec.reduce((s, p) => s + p[1], 0) / 4;
  const v = (p: [number, number], y: number): [number, number, number] => [p[0] - cx, y, p[1] - cz];
  const pts: number[] = [];
  const seg = (p: [number, number, number], q: [number, number, number]) => pts.push(...p, ...q);
  const topo = sec.map((p) => v(p, meio));
  const base = sec.map((p) => v(p, -meio));
  // terminações: uma aresta (domo) deslocada no sentido de a, o que mantém
  // a simetria monoclínica (eixo 2 ao longo de b) e entrega o oblíquo
  const ap: [number, number, number][] = [
    [0.18, meio + 0.55, -0.05],
    [-0.18, meio + 0.55, 0.05],
  ];
  const bp: [number, number, number][] = [
    [-0.18, -meio - 0.55, 0.05],
    [0.18, -meio - 0.55, -0.05],
  ];
  for (let i = 0; i < 4; i++) {
    seg(topo[i], topo[(i + 1) % 4]);
    seg(base[i], base[(i + 1) % 4]);
    seg(topo[i], base[i]);
  }
  seg(ap[0], ap[1]);
  seg(bp[0], bp[1]);
  seg(topo[0], ap[0]);
  seg(topo[1], ap[0]);
  seg(topo[2], ap[1]);
  seg(topo[3], ap[1]);
  seg(base[0], bp[0]);
  seg(base[1], bp[0]);
  seg(base[2], bp[1]);
  seg(base[3], bp[1]);
  return pts;
})();

/** O cristal girando devagar: meia volta entre `de` e `ate`, e para. */
export const Cristal: React.FC<{ largura: number; altura: number; de: number; ate: number; visivel: boolean }> = ({
  largura,
  altura,
  de,
  ate,
  visivel,
}) => {
  const f = useCurrentFrame();
  const obj = useMemo(() => linha(CRISTAL, TINTA_LINHA, largura, altura), [largura, altura]);
  if (!visivel || f < de) return null;
  // velocidade constante e uma desaceleração só no último décimo: para na pergunta
  const t = Math.min(1, Math.max(0, (f - de) / (ate - de)));
  const giro = t < 0.9 ? (t / 0.9) * 0.93 : 0.93 + 0.07 * assentar((t - 0.9) / 0.1);
  return (
    <ThreeCanvas
      width={largura}
      height={altura}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 9], fov: 30, near: 0.1, far: 100 }}
      style={{ mixBlendMode: 'multiply' }}
    >
      <group rotation={[0.32, 0.4 + giro * Math.PI, 0.18]}>
        <primitive object={obj} />
      </group>
    </ThreeCanvas>
  );
};
